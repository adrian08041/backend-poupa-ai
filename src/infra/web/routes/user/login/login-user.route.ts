import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import {
  LoginUserInput,
  LoginUserUsecase,
} from 'src/usecases/user/login/login-user.usecase';

import type { LoginUserRequest } from './login-user.dto';
import { IsPublic } from 'src/infra/web/auth/decorators/is-public.decorator';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

@Controller('/users')
export class LoginUserRoute {
  public constructor(private readonly loginUserUsecase: LoginUserUsecase) {}
  @IsPublic()
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @Post('/login')
  public async handle(
    @Body() request: LoginUserRequest,
    @Res() res: Response,
  ): Promise<void> {
    const input: LoginUserInput = {
      email: request.email,
      password: request.password,
    };

    const result = await this.loginUserUsecase.execute(input);

    res.cookie('access_token', result.authToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'lax',
      maxAge: 3600 * 1000,
      path: '/',
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000,
      path: '/api/users/refresh',
    });

    res.json({ message: 'Login realizado com sucesso' });
  }
}
