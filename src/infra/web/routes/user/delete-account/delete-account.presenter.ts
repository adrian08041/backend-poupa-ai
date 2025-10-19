import { DeleteAccountOutput } from 'src/usecases/user/delete-account/delete-account.usecase';
import { DeleteAccountRouteResponse } from './delete-account.dto';

export class DeleteAccountPresenter {
  public static toHttp(
    output: DeleteAccountOutput,
  ): DeleteAccountRouteResponse {
    return {
      success: output.success,
    };
  }
}
