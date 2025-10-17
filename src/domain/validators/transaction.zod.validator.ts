import { z } from 'zod';

const transactionTypeSchema = z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']);

const transactionCategorySchema = z.enum([
  // Categorias de DESPESA
  'ALIMENTACAO',
  'TRANSPORTE',
  'LAZER',
  'SAUDE',
  'EDUCACAO',
  'MORADIA',
  'VESTUARIO',
  // Categorias de RECEITA
  'SALARIO',
  'FREELANCE',
  'INVESTIMENTO',
  'PRESENTE',
  // Genérico
  'OUTROS',
]);

const paymentMethodSchema = z
  .enum(['PIX', 'BOLETO', 'CARTAO', 'TRANSFERENCIA', 'DINHEIRO'])
  .optional();

export const TransactionZodValidator = z
  .object({
    userId: z.string().uuid('User ID must be a valid UUID'),

    type: transactionTypeSchema,

    category: transactionCategorySchema,

    paymentMethod: paymentMethodSchema,

    amount: z
      .number()
      .int('Amount must be an integer (in cents)')
      .positive('Amount must be greater than zero'),

    description: z
      .string()
      .max(500, 'Description must be at most 500 characters')
      .optional(),

    date: z.date(),
  })
  .refine(
    (data) => {
      const expenseCategories = [
        'ALIMENTACAO',
        'TRANSPORTE',
        'LAZER',
        'SAUDE',
        'EDUCACAO',
        'MORADIA',
        'VESTUARIO',
      ];

      if (
        data.type === 'EXPENSE' &&
        !expenseCategories.includes(data.category) &&
        data.category !== 'OUTROS'
      ) {
        return false;
      }

      return true;
    },
    {
      message:
        'Category must be compatible with EXPENSE type (ALIMENTACAO, TRANSPORTE, LAZER, SAUDE, EDUCACAO, MORADIA, VESTUARIO, OUTROS)',
      path: ['category'],
    },
  )
  .refine(
    (data) => {
      const incomeCategories = ['SALARIO', 'FREELANCE', 'PRESENTE'];

      if (
        data.type === 'INCOME' &&
        !incomeCategories.includes(data.category) &&
        data.category !== 'OUTROS'
      ) {
        return false;
      }

      return true;
    },
    {
      message:
        'Category must be compatible with INCOME type (SALARIO, FREELANCE, PRESENTE, OUTROS)',
      path: ['category'],
    },
  )
  .refine(
    (data) => {
      // Validação: Categoria INVESTIMENTO apenas para tipo INVESTMENT
      if (data.type === 'INVESTMENT' && data.category !== 'INVESTIMENTO') {
        return false;
      }

      return true;
    },
    {
      message: 'Category must be INVESTIMENTO for INVESTMENT type',
      path: ['category'],
    },
  );

export type TransactionZodValidatorInput = z.infer<
  typeof TransactionZodValidator
>;
