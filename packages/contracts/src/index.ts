import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  service: z.string().min(1),
  timestamp: z.iso.datetime(),
  checks: z.record(z.string(), z.enum(['ok', 'unavailable'])).optional(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
