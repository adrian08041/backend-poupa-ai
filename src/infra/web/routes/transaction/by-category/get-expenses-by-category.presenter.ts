import { GetExpensesByCategoryOutput } from 'src/usecases/transaction/by-category/get-expenses-by-category.usecase';
import { GetExpensesByCategoryRouteResponse } from './get-expenses-by-category.dto';

export class GetExpensesByCategoryPresenter {
  public static toHttp(
    output: GetExpensesByCategoryOutput,
  ): GetExpensesByCategoryRouteResponse {
    return {
      categories: output.categories.map((c) => ({
        category: c.category,
        amount: c.amount / 100, // Converte centavos para reais
        percentage: c.percentage,
        count: c.count,
      })),
    };
  }
}
