import { Transaction as PrismaTransaction } from 'generated/prisma';
import { Transaction } from 'src/domain/entities/transaction/transaction.entity';

export class TransactionPrismaModelToEntityMapper {
  public static map(model: PrismaTransaction): Transaction {
    return Transaction.from({
      id: model.id,
      userId: model.userId,
      type: model.type as 'INCOME' | 'EXPENSE', // Cast para o tipo da entidade
      category: model.category, // Os enums são compatíveis
      amount: model.amount,
      description: model.description ?? undefined,
      date: model.date,
      deletedAt: model.deletedAt ?? undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
