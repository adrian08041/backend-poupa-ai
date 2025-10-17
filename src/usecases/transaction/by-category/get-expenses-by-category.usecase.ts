import { Injectable } from '@nestjs/common';
import { TransactionGateway } from 'src/domain/repositories/transaction.gateway';
import { UseCase } from 'src/usecases/usecase';

export type GetExpensesByCategoryInput = {
  userId: string;
};

export type CategorySummaryOutput = {
  category: string;
  amount: number;
  percentage: number;
  count: number;
};

export type GetExpensesByCategoryOutput = {
  categories: CategorySummaryOutput[];
};

@Injectable()
export class GetExpensesByCategoryUseCase
  implements UseCase<GetExpensesByCategoryInput, GetExpensesByCategoryOutput>
{
  public constructor(private readonly transactionGateway: TransactionGateway) {}

  public async execute({
    userId,
  }: GetExpensesByCategoryInput): Promise<GetExpensesByCategoryOutput> {
    const categories =
      await this.transactionGateway.getExpensesByCategory(userId);

    return {
      categories: categories.map((c) => ({
        category: c.category,
        amount: c.amount,
        percentage: c.percentage,
        count: c.count,
      })),
    };
  }
}
