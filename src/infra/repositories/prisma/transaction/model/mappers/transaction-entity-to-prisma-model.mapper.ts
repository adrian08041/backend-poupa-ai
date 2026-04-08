import { Transaction } from 'src/domain/entities/transaction/transaction.entity';
import TransactionPrismaModel from '../transaction.prisma.model';

/**
 * 🔄 MAPPER: Entity → Prisma Model
 *
 * PROPÓSITO:
 * - Converte entidade de domínio (Transaction) para modelo Prisma
 * - Usado ao SALVAR no banco
 *
 * PADRÃO:
 * - Seguindo UserEntityToUserPrismaModelMapper
 * - Método estático map()
 */

export class TransactionEntityToPrismaModelMapper {
  public static map(transaction: Transaction): TransactionPrismaModel {
    const model: TransactionPrismaModel = {
      id: transaction.getId(),
      userId: transaction.getUserId(),
      type: transaction.getType(),
      category: transaction.getCategory(),
      paymentMethod: transaction.getPaymentMethod(),
      amount: transaction.getAmount(),
      description: transaction.getDescription(),
      date: transaction.getDate(),
      recurringTransactionId: transaction.getRecurringTransactionId(),
      deletedAt: transaction.getDeletedAt(),
      createdAt: transaction.getCreatedAt(),
      updatedAt: transaction.getUpdatedAt(),
    };

    return model;
  }
}
