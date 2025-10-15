import { Controller, Post } from '@nestjs/common';
import {
  LogoutUserInput,
  LogoutUserUsecase,
} from 'src/usecases/user/logout/logout-user.usecase';

import { LogoutUserPresenter } from './logout-user.presenter';
import type { LogoutUserResponse } from './logout-user.dto';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator'; // ← USAR ESSE!

@Controller('/users')
export class LogoutUserRoute {
  public constructor(private readonly logoutUserUsecase: LogoutUserUsecase) {}

  @Post('/logout')
  public async handle(
    @UserId() userId: string, // ← PERFEITO!
  ): Promise<LogoutUserResponse> {
    const input: LogoutUserInput = {
      userId,
    };

    const result = await this.logoutUserUsecase.execute(input);

    const response = LogoutUserPresenter.toHttp(result);

    return response;
  }
}
