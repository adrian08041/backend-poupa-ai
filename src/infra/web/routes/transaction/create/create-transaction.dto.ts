import { z } from 'zod';

export const createTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
  category: z.enum([
    'ALIMENTACAO', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO',
    'MORADIA', 'VESTUARIO', 'SALARIO', 'FREELANCE', 'INVESTIMENTO',
    'PRESENTE', 'OUTROS',
  ]),
  paymentMethod: z.enum(['PIX', 'BOLETO', 'CARTAO', 'TRANSFERENCIA', 'DINHEIRO']).optional(),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
}).strict();

export type CreateTransactionRouteRequest = z.infer<typeof createTransactionSchema>;

export type CreateTransactionRouteResponse = {
  id: string; // ID da transa��o criada
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number; // Retornamos em REAIS novamente para o cliente
  description?: string;
  date: string; // Data ISO string
  createdAt: string; // Timestamp de cria��o
};
