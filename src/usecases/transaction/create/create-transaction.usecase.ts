import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/domain/entities/transaction/transaction.entity';
import { TransactionGateway } from 'src/domain/repositories/transaction.gateway';
import { UseCase } from 'src/usecases/usecase';

export type CreateTransactionInput = {
  userId: string;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number; // Em centavos
  description?: string;
  date: Date;
};

export type CreateTransactionOutput = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number; // Em centavos
  description?: string;
  date: Date;
  createdAt: Date;
};

@Injectable()
export class CreateTransactionUseCase
  implements UseCase<CreateTransactionInput, CreateTransactionOutput>
{
  public constructor(private readonly transactionGateway: TransactionGateway) {}

  public async execute({
    userId,
    type,
    category,
    paymentMethod,
    amount,
    description,
    date,
  }: CreateTransactionInput): Promise<CreateTransactionOutput> {
    const transaction = Transaction.create({
      userId,
      type: type as any,
      category: category as any,
      paymentMethod: paymentMethod as any,
      amount,
      description,
      date,
    });

    await this.transactionGateway.create(transaction);

    const output: CreateTransactionOutput = {
      id: transaction.getId(),
      type: transaction.getType(),
      category: transaction.getCategory(),
      paymentMethod: transaction.getPaymentMethod() ?? undefined,
      amount: transaction.getAmount(),
      description: transaction.getDescription() ?? undefined,
      date: transaction.getDate(),
      createdAt: transaction.getCreatedAt(),
    };

    return output;
  }
}
