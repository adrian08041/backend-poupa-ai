import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from 'src/usecases/usecase';
import type { RecurringTransactionRepository } from 'src/domain/repositories/recurring-transaction.repository.interface';
import { RecurringTransaction } from 'src/domain/entities/recurring-transaction/recurring-transaction.entity';

export interface CreateRecurringTransactionInput {
  userId: string;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number; // Em centavos
  description?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: Date;
  endDate?: Date;
  dayOfMonth?: number;
  dayOfWeek?: number;
}

export interface CreateRecurringTransactionOutput {
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
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CreateRecurringTransactionUsecase
  implements
    UseCase<
      CreateRecurringTransactionInput,
      CreateRecurringTransactionOutput
    >
{
  constructor(
    @Inject('RecurringTransactionRepository')
    private readonly recurringTransactionRepository: RecurringTransactionRepository,
  ) {}

  async execute(
    input: CreateRecurringTransactionInput,
  ): Promise<CreateRecurringTransactionOutput> {
    // Validações
    if (!input.amount || input.amount <= 0 || isNaN(input.amount)) {
      throw new Error('O valor deve ser maior que zero');
    }

    if (!input.startDate || isNaN(input.startDate.getTime())) {
      throw new Error('Data de início inválida');
    }

    const recurringTransaction = RecurringTransaction.create({
      userId: input.userId,
      type: input.type as any,
      category: input.category as any,
      paymentMethod: input.paymentMethod as any,
      amount: input.amount,
      description: input.description,
      frequency: input.frequency as any,
      startDate: input.startDate,
      endDate: input.endDate,
      dayOfMonth: input.dayOfMonth,
      dayOfWeek: input.dayOfWeek,
    });

    const created =
      await this.recurringTransactionRepository.create(recurringTransaction);

    return {
      id: created.getId(),
      userId: created.getUserId(),
      type: created.getType(),
      category: created.getCategory(),
      paymentMethod: created.getPaymentMethod(),
      amount: created.getAmount(),
      description: created.getDescription(),
      frequency: created.getFrequency(),
      startDate: created.getStartDate(),
      endDate: created.getEndDate(),
      dayOfMonth: created.getDayOfMonth(),
      dayOfWeek: created.getDayOfWeek(),
      active: created.isActive(),
      createdAt: created.getCreatedAt(),
      updatedAt: created.getUpdatedAt(),
    };
  }
}
