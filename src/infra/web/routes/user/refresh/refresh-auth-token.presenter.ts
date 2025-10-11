import { RefreshAuthTokenUserUsecaseOutput } from 'src/usecases/user/refresh-acess-token/refresh-acess-token-user.usecase';
import { RefreshAuthTokenResponse } from './refresh-auth-token-dto';

export class RefreshAuthTokenPresenter {
  public static toHttp(
    input: RefreshAuthTokenUserUsecaseOutput,
  ): RefreshAuthTokenResponse {
    const response: RefreshAuthTokenResponse = {
      authToken: input.authToken,
    };

    return response;
  }
}
