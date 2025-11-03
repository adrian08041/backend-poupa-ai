import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { UseCase } from 'src/usecases/usecase';
import type { RecurringTransactionRepository } from 'src/domain/repositories/recurring-transaction.repository.interface';

export interface ToggleRecurringTransactionInput {
  id: string;
  userId: string;
}

export interface ToggleRecurringTransactionOutput {
  id: string;
  active: boolean;
}

@Injectable()
export class ToggleRecurringTransactionUsecase
  implements
    UseCase<ToggleRecurringTransactionInput, ToggleRecurringTransactionOutput>
{
  constructor(
    @Inject('RecurringTransactionRepository')
    private readonly recurringTransactionRepository: RecurringTransactionRepository,
  ) {}

  async execute(
    input: ToggleRecurringTransactionInput,
  ): Promise<ToggleRecurringTransactionOutput> {
    const recurringTransaction =
      await this.recurringTransactionRepository.findById(input.id);

    if (!recurringTransaction) {
      throw new NotFoundException('Transação recorrente não encontrada');
    }

    if (recurringTransaction.getUserId() !== input.userId) {
      throw new NotFoundException('Transação recorrente não encontrada');
    }

    if (recurringTransaction.isActive()) {
      recurringTransaction.deactivate();
    } else {
      recurringTransaction.activate();
    }

    const updated =
      await this.recurringTransactionRepository.update(recurringTransaction);

    return {
      id: updated.getId(),
      active: updated.isActive(),
    };
  }
}
