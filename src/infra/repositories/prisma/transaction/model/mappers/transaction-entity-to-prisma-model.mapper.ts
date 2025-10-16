import { Prisma } from 'generated/prisma';
import { Transaction } from 'src/domain/entities/transaction/transaction.entity';

export class TransactionEntityToPrismaModelMapper {
  public static map(
    entity: Transaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      id: entity.id,
      userId: entity.userId,
      amount: entity.amount,
      description: entity.description ?? null,
      type: entity.type, // Já é compatível com o enum do Prisma
      category: entity.category, // Já é compatível com o enum do Prisma
      date: entity.date,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }

  public static mapForUpdate(
    entity: Transaction,
  ): Prisma.TransactionUncheckedUpdateInput {
    return {
      amount: entity.amount,
      description: entity.description ?? null,
      type: entity.type,
      category: entity.category,
      date: entity.date,
      updatedAt: new Date(),
    };
  }
}
