import { Body, Controller, Post } from '@nestjs/common';

import { RefreshAuthTokenPresenter } from './refresh-auth-token.presenter';
import { IsPublic } from 'src/infra/web/auth/decorators/is-public.decorator';
import type {
  RefreshAuthTokenRequest,
  RefreshAuthTokenResponse,
} from './refresh-auth-token-dto';
import {
  RefreshAuthTokenUserUsecase,
  RefreshAuthTokenUserUsecaseInput,
} from 'src/usecases/user/refresh-acess-token/refresh-acess-token-user.usecase';

@Controller('users')
export class RefreshAuthTokenRoute {
  public constructor(
    private readonly refreshAuthTokenUsecase: RefreshAuthTokenUserUsecase,
  ) {}

  @IsPublic()
  @Post('refresh')
  public async handle(
    @Body() request: RefreshAuthTokenRequest,
  ): Promise<RefreshAuthTokenResponse> {
    const input: RefreshAuthTokenUserUsecaseInput = {
      refreshToken: request.refreshToken,
    };

    const result = await this.refreshAuthTokenUsecase.execute(input);

    const response = RefreshAuthTokenPresenter.toHttp(result);

    return response;
  }
}
