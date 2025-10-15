import { LogoutUserOutput } from 'src/usecases/user/logout/logout-user.usecase';
import { LogoutUserResponse } from './logout-user.dto';

export class LogoutUserPresenter {
  public static toHttp(input: LogoutUserOutput): LogoutUserResponse {
    const response: LogoutUserResponse = {
      message: input.message,
    };

    return response;
  }
}
