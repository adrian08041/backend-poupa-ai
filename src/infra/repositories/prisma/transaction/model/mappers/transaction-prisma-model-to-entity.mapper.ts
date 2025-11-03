import {
  Transaction,
  TransactionWithDto,
} from 'src/domain/entities/transaction/transaction.entity';
import TransactionPrismaModel from '../transaction.prisma.model';

/**
 * 🔄 MAPPER: Prisma Model → Entity
 *
 * PROPÓSITO:
 * - Converte modelo Prisma para entidade de domínio (Transaction)
 * - Usado ao LER do banco
 *
 * PADRÃO:
 * - Seguindo UserPrismaModelToUserEntityMapper
 * - Usa Transaction.with() para hidratar
 */

export class TransactionPrismaModelToEntityMapper {
  public static map(model: TransactionPrismaModel): Transaction {
    const dto: TransactionWithDto = {
      id: model.id,
      userId: model.userId,
      type: model.type as any, // Cast para o tipo da entidade
      category: model.category as any,
      paymentMethod: model.paymentMethod as any,
      amount: model.amount,
      description: model.description,
      date: model.date,
      recurringTransactionId: model.recurringTransactionId,
      deletedAt: model.deletedAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };

    const transaction = Transaction.with(dto);

    return transaction;
  }
}
