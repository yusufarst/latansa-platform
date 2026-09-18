import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';
import * as publicService from '@/modules/products/services/public';
import { env } from '@/config/env';

vi.mock('@/modules/products/services/public', () => ({
  isProductPublished: vi.fn(),
  recordWhatsAppClickEvent: vi.fn(),
}));

vi.mock('@/config/env', () => ({
  env: {
    NEXT_PUBLIC_WHATSAPP_NUMBER: '0812-3456-7890',
  }
}));

describe('WhatsApp API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to whatsapp with encoded message for published product', async () => {
    vi.mocked(publicService.isProductPublished).mockResolvedValue({
      published: true,
      productId: 'prod-1',
      productName: 'Laptop Asus',
      sku: 'SKU-001',
    });

    const req = new NextRequest('http://localhost:3000/api/go/whatsapp/laptop-asus');
    const res = await GET(req, { params: Promise.resolve({ slug: 'laptop-asus' }) });

    expect(res.status).toBe(303);
    const redirectUrl = res.headers.get('location');
    expect(redirectUrl).toContain('wa.me/081234567890');
    expect(redirectUrl).toContain(encodeURIComponent('Halo LATANSA JOGJAKARTA,\nsaya tertarik dengan Laptop Asus (SKU-001).\nMohon informasi harga dan ketersediaannya.'));
    
    expect(publicService.recordWhatsAppClickEvent).toHaveBeenCalledWith('prod-1', { source: 'whatsapp_redirect_route' });
  });

  it('returns 404 for draft/archived product', async () => {
    vi.mocked(publicService.isProductPublished).mockResolvedValue({
      published: false,
    });

    const req = new NextRequest('http://localhost:3000/api/go/whatsapp/laptop-asus');
    const res = await GET(req, { params: Promise.resolve({ slug: 'laptop-asus' }) });

    expect(res.status).toBe(404);
    expect(publicService.recordWhatsAppClickEvent).not.toHaveBeenCalled();
  });

  it('fails safely when whatsapp number is not configured', async () => {
    vi.mocked(publicService.isProductPublished).mockResolvedValue({
      published: true,
      productId: 'prod-1',
      productName: 'Laptop Asus',
      sku: 'SKU-001',
    });

    // Mock env without WhatsApp number
    const originalNumber = env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    env.NEXT_PUBLIC_WHATSAPP_NUMBER = undefined;

    const req = new NextRequest('http://localhost:3000/api/go/whatsapp/laptop-asus');
    const res = await GET(req, { params: Promise.resolve({ slug: 'laptop-asus' }) });

    expect(res.status).toBe(503);
    expect(await res.text()).toBe('WhatsApp contact not configured');

    env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalNumber; // Restore
  });
});
