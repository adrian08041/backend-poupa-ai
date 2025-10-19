import { ChangePasswordOutput } from 'src/usecases/user/change-password/change-password.usecase';
import { ChangePasswordRouteResponse } from './change-password.dto';

export class ChangePasswordPresenter {
  public static toHttp(
    output: ChangePasswordOutput,
  ): ChangePasswordRouteResponse {
    return {
      success: output.success,
    };
  }
}
