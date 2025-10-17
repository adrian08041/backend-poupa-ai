import { Injectable } from '@nestjs/common';
import { TransactionGateway } from 'src/domain/repositories/transaction.gateway';
import { UseCase } from 'src/usecases/usecase';

export type ListTransactionsInput = {
  userId: string;
};

export type TransactionOutput = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number; // Em centavos
  description?: string;
  date: Date;
  createdAt: Date;
};

export type ListTransactionsOutput = {
  transactions: TransactionOutput[];
};

@Injectable()
export class ListTransactionsUseCase
  implements UseCase<ListTransactionsInput, ListTransactionsOutput>
{
  public constructor(private readonly transactionGateway: TransactionGateway) {}

  public async execute({
    userId,
  }: ListTransactionsInput): Promise<ListTransactionsOutput> {
    const transactions = await this.transactionGateway.findByUserId(userId);

    const output: ListTransactionsOutput = {
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
    };

    return output;
  }
}
