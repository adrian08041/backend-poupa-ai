import { ListTransactionsOutput } from 'src/usecases/transaction/list/list-transactions.usecase';
import { ListTransactionsRouteResponse } from './list-transactions.dto';

export class ListTransactionsPresenter {
  public static toHttp(
    output: ListTransactionsOutput,
  ): ListTransactionsRouteResponse {
    return {
      transactions: output.transactions.map((t) => ({
        id: t.id,
        type: t.type,
        category: t.category,
        paymentMethod: t.paymentMethod,
        amount: t.amount,
        description: t.description,
        date: t.date.toISOString(),
        createdAt: t.createdAt.toISOString(),
      })),
    };
  }
}
