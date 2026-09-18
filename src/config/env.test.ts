import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Environment Variables Foundation', () => {
  it('should validate correctly when all required variables are present', () => {
    // This is a minimal test proving the test runner works
    const schema = z.object({
      APP_URL: z.string().url(),
    });
    
    const result = schema.safeParse({ APP_URL: 'http://localhost:3000' });
    expect(result.success).toBe(true);
  });

  it('should fail when required variables are missing', () => {
    const schema = z.object({
      APP_URL: z.string().url(),
    });
    
    const result = schema.safeParse({});
    expect(result.success).toBe(false);
  });
});
