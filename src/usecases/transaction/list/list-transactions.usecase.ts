import { Injectable } from '@nestjs/common';
import { TransactionGateway } from 'src/domain/repositories/transaction.gateway';
import { UseCase } from 'src/usecases/usecase';

export type ListTransactionsInput = {
  userId: string;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
};

export type TransactionOutput = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number;
  description?: string;
  date: Date;
  createdAt: Date;
};

export type ListTransactionsOutput = {
  transactions: TransactionOutput[];
  total: number;
  page: number;
  limit: number;
};

@Injectable()
export class ListTransactionsUseCase
  implements UseCase<ListTransactionsInput, ListTransactionsOutput>
{
  public constructor(
    private readonly transactionGateway: TransactionGateway,
  ) {}

  public async execute({
    userId,
    page = 1,
    limit = 50,
    startDate,
    endDate,
  }: ListTransactionsInput): Promise<ListTransactionsOutput> {
    const skip = (page - 1) * limit;

    const { transactions, total } = await this.transactionGateway.findByUserId(
      userId,
      { skip, take: limit, startDate, endDate },
    );

    return {
      transactions: transactions.map((t) => ({
        id: t.getId(),
        type: t.getType(),
        category: t.getCategory(),
        paymentMethod: t.getPaymentMethod() ?? undefined,
        amount: t.getAmount(),
        description: t.getDescription() ?? undefined,
        date: t.getDate(),
        createdAt: t.getCreatedAt(),
      })),
      total,
      page,
      limit,
    };
  }
}
