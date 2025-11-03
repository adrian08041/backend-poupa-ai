import { Injectable } from '@nestjs/common';
import { TransactionGateway } from 'src/domain/repositories/transaction.gateway';
import { UseCase } from 'src/usecases/usecase';
import { TransactionNotFoundUsecaseException } from 'src/usecases/exceptions/transaction-not-found.usecase.exception';
import { UnauthorizedTransactionAccessUsecaseException } from 'src/usecases/exceptions/unauthorized-transaction-access.usecase.exception';
import { RecurringTransactionNotEditableUsecaseException } from 'src/usecases/exceptions/recurring-transaction-not-editable.usecase.exception';

export type DeleteTransactionInput = {
  transactionId: string;
  userId: string; // Para validar ownership
};

export type DeleteTransactionOutput = {
  success: boolean;
};

@Injectable()
export class DeleteTransactionUseCase
  implements UseCase<DeleteTransactionInput, DeleteTransactionOutput>
{
  public constructor(private readonly transactionGateway: TransactionGateway) {}

  public async execute({
    transactionId,
    userId,
  }: DeleteTransactionInput): Promise<DeleteTransactionOutput> {
    // 1. Busca a transação
    const transaction =
      await this.transactionGateway.findById(transactionId);

    // 2. Verifica se existe
    if (!transaction) {
      throw new TransactionNotFoundUsecaseException(transactionId);
    }

    // 3. Verifica ownership (usuário só pode deletar suas próprias transações)
    if (transaction.getUserId() !== userId) {
      throw new UnauthorizedTransactionAccessUsecaseException(
        userId,
        transactionId,
      );
    }

    // 4. Verifica se é uma transação gerada por recorrência (não pode ser deletada)
    if (transaction.getRecurringTransactionId()) {
      throw new RecurringTransactionNotEditableUsecaseException(transactionId);
    }

    // 5. Soft delete
    await this.transactionGateway.softDelete(transactionId);

    return {
      success: true,
    };
  }
}
