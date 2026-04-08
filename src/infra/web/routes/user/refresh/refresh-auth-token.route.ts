import { Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';

import { IsPublic } from 'src/infra/web/auth/decorators/is-public.decorator';
import {
  RefreshAuthTokenUserUsecase,
  RefreshAuthTokenUserUsecaseInput,
} from 'src/usecases/user/refresh-acess-token/refresh-acess-token-user.usecase';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

@Controller('users')
export class RefreshAuthTokenRoute {
  public constructor(
    private readonly refreshAuthTokenUsecase: RefreshAuthTokenUserUsecase,
  ) {}

  @IsPublic()
  @Post('refresh')
  public async handle(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    const input: RefreshAuthTokenUserUsecaseInput = { refreshToken };

    const result = await this.refreshAuthTokenUsecase.execute(input);

    res.cookie('access_token', result.authToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'lax',
      maxAge: 3600 * 1000,
      path: '/',
    });

    res.cookie('refresh_token', result.newRefreshToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000,
      path: '/api/users/refresh',
    });

    res.json({ message: 'Token renovado com sucesso' });
  }
}
