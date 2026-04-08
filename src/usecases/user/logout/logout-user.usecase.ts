import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from 'src/infra/repositories/prisma/refresh-token/refresh-token.repository';

export type LogoutUserInput = {
  userId: string;
};

export type LogoutUserOutput = {
  message: string;
};

@Injectable()
export class LogoutUserUsecase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async execute(input: LogoutUserInput): Promise<LogoutUserOutput> {
    await this.refreshTokenRepository.revokeAllByUserId(input.userId);

    return {
      message: 'Logout realizado com sucesso',
    };
  }
}
