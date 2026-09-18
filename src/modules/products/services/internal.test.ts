/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateProductSpecifications } from './internal';
import { db } from '../../../db';
import * as auth from '../../auth/authorization';
import * as audit from '../../auth/audit';

// Mock dependencies
vi.mock('../../../db', () => ({
  db: {
    transaction: vi.fn(),
  },
}));

vi.mock('../../auth/authorization', () => ({
  requireRole: vi.fn(),
}));

vi.mock('../../auth/audit', () => ({
  appendAuditLog: vi.fn(),
}));

describe('updateProductSpecifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should wrap operations in a transaction for atomicity', async () => {
    const mockUser = { id: 'test-user-id' };
    vi.mocked(auth.requireRole).mockResolvedValue({ user: mockUser as any, session: {} as any, role: {} as any } as any);

    // Mock transaction implementation
    const mockTx = {
      delete: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(true),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockResolvedValue(true),
    };

    vi.mocked(db.transaction).mockImplementation(async (cb) => {
      return cb(mockTx as never);
    });

    const specs = [
      { key: 'Color', value: 'Black' },
    ];

    await updateProductSpecifications('prod-1', specs);

    // Verify transaction was used
    expect(db.transaction).toHaveBeenCalled();

    // Verify methods were called on the transaction object
    expect(mockTx.delete).toHaveBeenCalled();
    expect(mockTx.insert).toHaveBeenCalled();
    expect(audit.appendAuditLog).toHaveBeenCalledWith(
      'PRODUCT_SPECIFICATIONS_UPDATED',
      expect.objectContaining({
        tx: mockTx,
      })
    );
  });
});
