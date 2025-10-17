import { DeleteTransactionOutput } from 'src/usecases/transaction/delete/delete-transaction.usecase';
import { DeleteTransactionRouteResponse } from './delete-transaction.dto';

export class DeleteTransactionPresenter {
  public static toHttp(
    output: DeleteTransactionOutput,
  ): DeleteTransactionRouteResponse {
    return {
      success: output.success,
    };
  }
}
