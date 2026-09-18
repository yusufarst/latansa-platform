import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';
import { db } from '@/db';

vi.mock('@/db', () => {
  const m = {
    where: vi.fn(),
  };
  // @ts-expect-error mock assignment
  m.select = vi.fn().mockReturnValue(m);
  // @ts-expect-error mock assignment
  m.from = vi.fn().mockReturnValue(m);
  return { db: m };
});

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn().mockResolvedValue(Buffer.from('fake-image-data')),
  },
  readFile: vi.fn().mockResolvedValue(Buffer.from('fake-image-data')),
}));

vi.mock('@/modules/auth/authorization', () => ({
  getCurrentSession: vi.fn(),
}));

import { getCurrentSession } from '@/modules/auth/authorization';

const mockUser = { id: 'user-1', email: 'test@example.com', roleId: 'role-1', passwordHash: '', isActive: true, lastLoginAt: null, createdAt: new Date(), updatedAt: new Date() };
const mockSession = { id: 'sess-1', userId: 'user-1', tokenHash: '', expiresAt: new Date(), lastSeenAt: null, revokedAt: null, createdAt: new Date() };

describe('Media API Route - Authorization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows public access to published products', async () => {
    // @ts-expect-error mock
    vi.mocked(db.where)
      .mockResolvedValueOnce([{ id: 'img-1', mimeType: 'image/jpeg' }]) // image check
      .mockResolvedValueOnce([{ status: 'PUBLISHED' }]); // product check

    const req = new NextRequest('http://localhost:3000/api/media/products/prod-1/image.jpg');
    const res = await GET(req, { params: Promise.resolve({ path: ['prod-1', 'image.jpg'] }) });

    expect(res.status).toBe(200);
    expect(getCurrentSession).not.toHaveBeenCalled();
  });

  it('denies unauthenticated access to draft products', async () => {
    // @ts-expect-error mock
    vi.mocked(db.where)
      .mockResolvedValueOnce([{ id: 'img-1', mimeType: 'image/jpeg' }])
      .mockResolvedValueOnce([{ status: 'DRAFT' }]);
    
    vi.mocked(getCurrentSession).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/media/products/prod-1/image.jpg');
    const res = await GET(req, { params: Promise.resolve({ path: ['prod-1', 'image.jpg'] }) });

    expect(res.status).toBe(403);
  });

  it('denies INVENTORY_ADMIN access to draft products', async () => {
    // @ts-expect-error mock
    vi.mocked(db.where)
      .mockResolvedValueOnce([{ id: 'img-1', mimeType: 'image/jpeg' }])
      .mockResolvedValueOnce([{ status: 'DRAFT' }])
      .mockResolvedValueOnce([{ code: 'INVENTORY_ADMIN' }]); // Role check
    
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: mockUser,
      session: mockSession
    });

    const req = new NextRequest('http://localhost:3000/api/media/products/prod-1/image.jpg');
    const res = await GET(req, { params: Promise.resolve({ path: ['prod-1', 'image.jpg'] }) });

    expect(res.status).toBe(403);
  });

  it('allows PRODUCT_SALES_ADMIN access to draft products', async () => {
    // @ts-expect-error mock
    vi.mocked(db.where)
      .mockResolvedValueOnce([{ id: 'img-1', mimeType: 'image/jpeg' }])
      .mockResolvedValueOnce([{ status: 'DRAFT' }])
      .mockResolvedValueOnce([{ code: 'PRODUCT_SALES_ADMIN' }]); // Role check
    
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: mockUser,
      session: mockSession
    });

    const req = new NextRequest('http://localhost:3000/api/media/products/prod-1/image.jpg');
    const res = await GET(req, { params: Promise.resolve({ path: ['prod-1', 'image.jpg'] }) });

    expect(res.status).toBe(200);
  });

  it('allows SUPER_ADMIN access to draft products', async () => {
    // @ts-expect-error mock
    vi.mocked(db.where)
      .mockResolvedValueOnce([{ id: 'img-1', mimeType: 'image/jpeg' }])
      .mockResolvedValueOnce([{ status: 'DRAFT' }])
      .mockResolvedValueOnce([{ code: 'SUPER_ADMIN' }]); // Role check
    
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: mockUser,
      session: mockSession
    });

    const req = new NextRequest('http://localhost:3000/api/media/products/prod-1/image.jpg');
    const res = await GET(req, { params: Promise.resolve({ path: ['prod-1', 'image.jpg'] }) });

    expect(res.status).toBe(200);
  });
});
