import { Injectable } from '@nestjs/common';
import { TransactionGateway } from 'src/domain/repositories/transaction.gateway';
import { UseCase } from 'src/usecases/usecase';

export type GetSummaryInput = {
  userId: string;
};

export type GetSummaryOutput = {
  balance: number; // Em centavos
  totalIncome: number; // Em centavos
  totalExpense: number; // Em centavos
  totalInvestment: number; // Em centavos
};

@Injectable()
export class GetSummaryUseCase
  implements UseCase<GetSummaryInput, GetSummaryOutput>
{
  public constructor(private readonly transactionGateway: TransactionGateway) {}

  public async execute({
    userId,
  }: GetSummaryInput): Promise<GetSummaryOutput> {
    const summary = await this.transactionGateway.getSummaryByUserId(userId);

    return {
      balance: summary.balance,
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
      totalInvestment: summary.totalInvestment,
    };
  }
}
