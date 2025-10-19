import { UpdateTransactionOutput } from 'src/usecases/transaction/update/update-transaction.usecase';
import { UpdateTransactionRouteResponse } from './update-transaction.dto';

export class UpdateTransactionPresenter {
  public static toHttp(
    output: UpdateTransactionOutput,
  ): UpdateTransactionRouteResponse {
    return {
      id: output.id,
      type: output.type,
      category: output.category,
      paymentMethod: output.paymentMethod,
      amount: output.amount / 100, // Converte centavos para reais
      description: output.description,
      date: output.date.toISOString(),
      updatedAt: output.updatedAt.toISOString(),
    };
  }
}
