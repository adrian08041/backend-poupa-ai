import { Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  LogoutUserInput,
  LogoutUserUsecase,
} from 'src/usecases/user/logout/logout-user.usecase';

import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';

@Controller('/users')
export class LogoutUserRoute {
  public constructor(private readonly logoutUserUsecase: LogoutUserUsecase) {}

  @Post('/logout')
  public async handle(
    @UserId() userId: string,
    @Res() res: Response,
  ): Promise<void> {
    const input: LogoutUserInput = { userId };

    await this.logoutUserUsecase.execute(input);

    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/api/users/refresh' });

    res.json({ message: 'Logout realizado com sucesso' });
  }
}
