/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPublicProductDetail } from './public';
import { db } from '../../../db';

vi.mock('../../../db', () => {
  const m = {
    limit: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
  };
  (m as any).select = vi.fn().mockReturnValue(m);
  (m as any).from = vi.fn().mockReturnValue(m);
  (m as any).innerJoin = vi.fn().mockReturnValue(m);
  (m as any).where = vi.fn().mockReturnValue(m);
  return { db: m };
});

describe('Public DTO Projection Safety', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('strips all sensitive internal data from product detail', async () => {
    // Setup a mock DB row that contains all the internal fields
    const mockDbRow = {
      product: {
        id: 'internal-uuid-123', // Internal
        sku: 'TEST-001',
        slug: 'test-product',
        name: 'Test Product',
        shortDescription: 'Short',
        description: 'Long description',
        publicPrice: '1000',
        isFeatured: false,
        status: 'PUBLISHED',
        trackingMode: 'SERIALIZED', // Internal
        createdAt: new Date(), // Internal
        updatedAt: new Date(), // Internal
      },
      category: {
        id: 'cat-uuid', // Internal
        name: 'Category 1',
        slug: 'category-1',
      },
      brand: {
        id: 'brand-uuid', // Internal
        name: 'Brand 1',
        slug: 'brand-1',
      }
    };

    const mockImages = [{
      id: 'img-uuid', // Internal
      productId: 'internal-uuid-123', // Internal
      storageKey: 'products/internal-uuid-123/img.jpg', // Internal
      mimeType: 'image/jpeg',
      sortOrder: 0,
      createdAt: new Date(), // Internal
    }];

    const mockSpecs = [{
      id: 'spec-uuid', // Internal
      productId: 'internal-uuid-123', // Internal
      groupName: 'General',
      key: 'Color',
      value: 'Red',
      sortOrder: 1, // Internal
    }];

    // Setup mocks
    // @ts-ignore
    vi.mocked((db as any).limit).mockResolvedValueOnce([mockDbRow]);
    // @ts-ignore
    vi.mocked((db as any).orderBy).mockResolvedValueOnce(mockImages);
    // @ts-ignore
    vi.mocked((db as any).orderBy).mockResolvedValueOnce(mockSpecs);

    const result = await getPublicProductDetail('test-product');

    expect(result).toBeDefined();
    
    // VERIFY UUIDS ARE STRIPPED
    expect((result as any).id).toBeUndefined();
    expect((result as any).category.id).toBeUndefined();
    expect((result as any).brand.id).toBeUndefined();
    
    // VERIFY INTERNAL FIELDS ARE STRIPPED
    expect((result as any).trackingMode).toBeUndefined();
    expect((result as any).createdAt).toBeUndefined();
    expect((result as any).updatedAt).toBeUndefined();
    
    // VERIFY IMAGE STORAGE KEYS ARE STRIPPED
    expect(result?.images[0]).toBeDefined();
    expect((result?.images[0] as any).storageKey).toBeUndefined();
    expect((result?.images[0] as any).id).toBeUndefined();
    expect(result?.images[0].url).toBe('/api/media/products/internal-uuid-123/img.jpg');
    
    // VERIFY SPECS ARE CLEAN
    expect(result?.specifications[0]).toBeDefined();
    expect((result?.specifications[0] as any).id).toBeUndefined();
    expect((result?.specifications[0] as any).productId).toBeUndefined();
    
    // VERIFY EXPECTED PUBLIC DATA EXISTS
    expect(result?.slug).toBe('test-product');
    expect(result?.sku).toBe('TEST-001');
  });
});
