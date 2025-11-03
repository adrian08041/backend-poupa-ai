import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from 'src/usecases/usecase';
import type { RecurringTransactionRepository } from 'src/domain/repositories/recurring-transaction.repository.interface';

export interface ListRecurringTransactionsInput {
  userId: string;
  activeOnly?: boolean;
}

export interface ListRecurringTransactionsOutput {
  recurringTransactions: Array<{
    id: string;
    userId: string;
    type: string;
    category: string;
    paymentMethod: string | null;
    amount: number;
    description: string | null;
    frequency: string;
    startDate: Date;
    endDate: Date | null;
    dayOfMonth: number | null;
    dayOfWeek: number | null;
    active: boolean;
    lastProcessed: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

@Injectable()
export class ListRecurringTransactionsUsecase
  implements
    UseCase<ListRecurringTransactionsInput, ListRecurringTransactionsOutput>
{
  constructor(
    @Inject('RecurringTransactionRepository')
    private readonly recurringTransactionRepository: RecurringTransactionRepository,
  ) {}

  async execute(
    input: ListRecurringTransactionsInput,
  ): Promise<ListRecurringTransactionsOutput> {
    const recurringTransactions = input.activeOnly
      ? await this.recurringTransactionRepository.findActiveByUserId(
          input.userId,
        )
      : await this.recurringTransactionRepository.findByUserId(input.userId);

    return {
      recurringTransactions: recurringTransactions.map((rt) => ({
        id: rt.getId(),
        userId: rt.getUserId(),
        type: rt.getType(),
        category: rt.getCategory(),
        paymentMethod: rt.getPaymentMethod(),
        amount: rt.getAmount(),
        description: rt.getDescription(),
        frequency: rt.getFrequency(),
        startDate: rt.getStartDate(),
        endDate: rt.getEndDate(),
        dayOfMonth: rt.getDayOfMonth(),
        dayOfWeek: rt.getDayOfWeek(),
        active: rt.isActive(),
        lastProcessed: rt.getLastProcessed(),
        createdAt: rt.getCreatedAt(),
        updatedAt: rt.getUpdatedAt(),
      })),
    };
  }
}
