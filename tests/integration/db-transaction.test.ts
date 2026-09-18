/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn().mockReturnValue({ value: 'mock-token' })
  })
}));

vi.mock('../../src/modules/auth/session', () => ({
  validateSession: vi.fn()
}));

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createProductWithSpecs, updateProductWithSpecs } from '../../src/modules/products/services/internal';
import * as session from '../../src/modules/auth/session';
import { db } from '../../src/db';
import { roles, auditLogs, users } from '../../src/modules/auth/db/schema';
import { products, productSpecifications, categories, brands } from '../../src/modules/products/db/schema';
import { eq, desc } from 'drizzle-orm';

describe('Real Postgres Atomicity Test', () => {
  let superAdminRole: any;
  let categoryId: string;
  let brandId: string;
  const uniqueId = Date.now();
  const testSku = `E2E-TX-${uniqueId}`;

  beforeAll(async () => {
    const [role] = await db.select().from(roles).where(eq(roles.code, 'SUPER_ADMIN'));
    superAdminRole = role;

    const [user] = await db.select().from(users).limit(1);
    if (!user) throw new Error("No user found in DB");

    vi.mocked(session.validateSession).mockResolvedValue({
      user: { id: user.id, roleId: superAdminRole?.id, email: user.email } as any,
      session: { id: 'session', userId: user.id, expiresAt: new Date() } as any,
    });

    const [cat] = await db.select().from(categories).limit(1);
    if (!cat) throw new Error("No category found for prerequisites");
    categoryId = cat.id;

    const [brand] = await db.select().from(brands).limit(1);
    if (!brand) throw new Error("No brand found for prerequisites");
    brandId = brand.id;
  });

  afterAll(async () => {
    // clean test product safely
    await db.delete(products).where(eq(products.sku, testSku));
  });

  it('rolls back product mutation if spec persistence fails', async () => {
    if (!superAdminRole) {
      throw new Error("No SUPER_ADMIN role");
    }

    // 1. create E2E-prefixed product with existing spec
    const product = await createProductWithSpecs({
      name: 'TX Test Product',
      sku: testSku,
      slug: `tx-test-${uniqueId}`,
      categoryId,
      brandId,
      publicPrice: '100',
    }, [{ key: 'Initial Key', value: 'Initial Value' }]);

    const initialProduct = await db.select().from(products).where(eq(products.id, product.id)).then(res => res[0]);
    const initialSpecs = await db.select().from(productSpecifications).where(eq(productSpecifications.productId, product.id));

    expect(initialProduct).toBeDefined();
    expect(initialProduct.name).toBe('TX Test Product');
    expect(initialSpecs.length).toBe(1);

    // 2. attempt product + spec update
    // 3. cause a real DB failure during spec persistence (value length > 1000)
    let thrownError: any = null;
    try {
      await updateProductWithSpecs(
        product.id,
        { name: 'Mutated TX Test Product' }, // Attempt to change name
        [
          { key: 'New Key', value: 'a'.repeat(2000) } // This will cause Postgres constraint violation
        ]
      );
    } catch (e) {
      thrownError = e;
    }

    expect(thrownError).toBeDefined();

    // 4. verify product mutation rolled back
    const afterProduct = await db.select().from(products).where(eq(products.id, product.id)).then(res => res[0]);
    expect(afterProduct.name).toBe('TX Test Product'); // Mutation rolled back

    // 5. verify old specs remain
    const afterSpecs = await db.select().from(productSpecifications).where(eq(productSpecifications.productId, product.id));
    expect(afterSpecs.length).toBe(1);
    expect(afterSpecs[0].key).toBe('Initial Key');

    // 6. verify no successful audit event was committed for this failed update
    const logs = await db.select()
      .from(auditLogs)
      .where(eq(auditLogs.entityId, product.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(1);

    // The only successful one should be the creation
    expect(logs[0]?.action).toBe('PRODUCT_CREATED');
  });
});
