import { describe, expect, it } from 'vitest';
import { healthResponseSchema } from './index.js';

describe('healthResponseSchema', () => {
  it('aceita uma resposta de saúde válida', () => {
    expect(healthResponseSchema.safeParse({ status: 'ok', service: 'api', timestamp: new Date().toISOString() }).success).toBe(true);
  });
});
