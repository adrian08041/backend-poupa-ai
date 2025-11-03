import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { UseCase } from 'src/usecases/usecase';
import type { RecurringTransactionRepository } from 'src/domain/repositories/recurring-transaction.repository.interface';
import type { TransactionGateway } from 'src/domain/repositories/transaction.gateway';

export interface DeleteRecurringTransactionInput {
  id: string;
  userId: string;
}

export interface DeleteRecurringTransactionOutput {
  success: boolean;
}

@Injectable()
export class DeleteRecurringTransactionUsecase
  implements
    UseCase<DeleteRecurringTransactionInput, DeleteRecurringTransactionOutput>
{
  constructor(
    @Inject('RecurringTransactionRepository')
    private readonly recurringTransactionRepository: RecurringTransactionRepository,
    private readonly transactionGateway: TransactionGateway,
  ) {}

  async execute(
    input: DeleteRecurringTransactionInput,
  ): Promise<DeleteRecurringTransactionOutput> {
    console.log(
      `🔍 Iniciando deleção da recurring transaction: ${input.id}`,
    );

    const recurringTransaction =
      await this.recurringTransactionRepository.findById(input.id);

    if (!recurringTransaction) {
      throw new NotFoundException('Transação recorrente não encontrada');
    }

    if (recurringTransaction.getUserId() !== input.userId) {
      throw new NotFoundException('Transação recorrente não encontrada');
    }

    console.log(`✅ Recurring transaction encontrada, iniciando deleção...`);

    // Deleta a transação recorrente
    await this.recurringTransactionRepository.delete(input.id);
    console.log(`✅ Recurring transaction deletada`);

    // Deleta todas as transações geradas por esta transação recorrente
    console.log(
      `🔄 Deletando transações vinculadas à recurring ${input.id}...`,
    );
    await this.transactionGateway.softDeleteByRecurringTransactionId(input.id);
    console.log(`✅ Transações vinculadas deletadas`);

    return { success: true };
  }
}
