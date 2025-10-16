import { TransactionType, TransactionCategory, PaymentMethod } from 'generated/prisma';

/**
 * 📦 Modelo Prisma Transaction
 * Representa a estrutura da tabela no banco de dados
 */

type TransactionPrismaModel = {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: PaymentMethod | null;
  amount: number; // Em centavos
  description: string | null;
  date: Date;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default TransactionPrismaModel;
