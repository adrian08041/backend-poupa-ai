import { z } from 'zod';

/**
 * Schema de validação para query params do relatório
 */
export const generateReportQuerySchema = z.object({
  month: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(12)),
  year: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(2000).max(2100)),
  includeComparison: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

export type GenerateReportQueryDto = z.infer<
  typeof generateReportQuerySchema
>;
