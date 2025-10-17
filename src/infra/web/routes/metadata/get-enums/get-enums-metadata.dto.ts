import { z } from 'zod';

export const GetEnumsMetadataInputDtoSchema = z.void();

export const GetEnumsMetadataOutputDtoSchema = z.object({
  transactionTypes: z.array(z.string()),
  transactionCategories: z.array(z.string()),
  paymentMethods: z.array(z.string()),
});

export type GetEnumsMetadataOutputDto = z.infer<
  typeof GetEnumsMetadataOutputDtoSchema
>;
