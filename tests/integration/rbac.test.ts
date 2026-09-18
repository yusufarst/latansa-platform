import { vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn().mockReturnValue({ value: 'mock-token' })
  })
}));

vi.mock('../../src/modules/auth/session', () => ({
  validateSession: vi.fn()
}));

import { describe, it, expect } from 'vitest';
import { createProductWithSpecs } from '../../src/modules/products/services/internal';
import * as session from '../../src/modules/auth/session';
import { db } from '../../src/db';
import { roles } from '../../src/modules/auth/db/schema';
import { eq } from 'drizzle-orm';

describe('INVENTORY_ADMIN RBAC Runtime Proof', () => {
  it('should deny INVENTORY_ADMIN from mutating product master data', async () => {
    // 1. Find the role ID for INVENTORY_ADMIN
    const [invAdminRole] = await db.select().from(roles).where(eq(roles.code, 'INVENTORY_ADMIN'));
    
    if (!invAdminRole) {
      console.warn("Skipping test because INVENTORY_ADMIN role does not exist. Run seed script.");
      return;
    }

    // 2. Mock validateSession to return a user with that role
    vi.mocked(session.validateSession).mockResolvedValue({
      user: { id: 'test-user', roleId: invAdminRole.id, email: 'inv@test.com', name: 'Inv Admin' } as any,
      session: { id: 'session', userId: 'test-user', expiresAt: new Date() } as any,
    });

    // 3. Try to create a product
    let thrownError: any = null;
    try {
      await createProductWithSpecs({
        name: 'Test Product', sku: 'TEST-SKU', slug: 'test-slug', categoryId: 'cat', brandId: 'brand'
      }, []);
    } catch (e) {
      thrownError = e;
    }

    // 4. Verify that access was denied (redirected)
    expect(thrownError).toBeDefined();
    // Next.js redirect throws an error object with a specific signature, usually message includes NEXT_REDIRECT
    expect(thrownError.message).toContain('NEXT_REDIRECT');
  });
});
