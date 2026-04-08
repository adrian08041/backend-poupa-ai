import { z } from 'zod';

export const updateTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']).optional(),
  category: z.enum([
    'ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO',
    'MORADIA', 'VESTUARIO', 'SALARIO', 'FREELANCE', 'INVESTIMENTO',
    'PRESENTE', 'OUTROS',
  ]).optional(),
  paymentMethod: z.enum(['PIX', 'BOLETO', 'CARTAO', 'TRANSFERENCIA', 'DINHEIRO']).optional(),
  amount: z.number().positive('Valor deve ser positivo').optional(),
  description: z.string().optional(),
  date: z.string().optional(),
}).strict();

export type UpdateTransactionRouteRequest = z.infer<typeof updateTransactionSchema>;

export type UpdateTransactionRouteResponse = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number; // Em reais (convertido de centavos no presenter)
  description?: string;
  date: string;
  updatedAt: string;
};
