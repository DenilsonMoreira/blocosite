import { describe, expect, it } from 'vitest';
import { createRequestId } from './index.js';

describe('createRequestId', () => {
  it('gera UUIDs distintos', () => {
    expect(createRequestId()).not.toBe(createRequestId());
  });
});
