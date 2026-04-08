import { Injectable } from '@nestjs/common';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { RefreshTokenRepository } from 'src/infra/repositories/prisma/refresh-token/refresh-token.repository';
import { JwtService } from 'src/infra/services/jwt/jwt.service';
import { CredentialsNotValidUsecaseException } from 'src/usecases/exceptions/credentials-not-valid.usecase';
import { UseCase } from 'src/usecases/usecase';

export type RefreshAuthTokenUserUsecaseInput = {
  refreshToken: string;
};

export type RefreshAuthTokenUserUsecaseOutput = {
  authToken: string;
  newRefreshToken: string;
};

@Injectable()
export class RefreshAuthTokenUserUsecase
  implements
    UseCase<RefreshAuthTokenUserUsecaseInput, RefreshAuthTokenUserUsecaseOutput>
{
  public constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userGateway: UserGateway,
  ) {}

  public async execute({
    refreshToken,
  }: RefreshAuthTokenUserUsecaseInput): Promise<RefreshAuthTokenUserUsecaseOutput> {
    const tokenRecord = await this.refreshTokenRepository.validate(refreshToken);

    if (!tokenRecord) {
      throw new CredentialsNotValidUsecaseException(
        `Invalid or revoked refresh token in ${RefreshAuthTokenUserUsecase.name}`,
        `Credenciais inválidas. Faça o login novamente`,
        RefreshAuthTokenUserUsecase.name,
      );
    }

    const user = await this.userGateway.findById(tokenRecord.userId);

    if (!user) {
      throw new CredentialsNotValidUsecaseException(
        `User not found for refresh token in ${RefreshAuthTokenUserUsecase.name}`,
        `Credenciais inválidas. Faça o login novamente`,
        RefreshAuthTokenUserUsecase.name,
      );
    }

    const authToken = this.jwtService.generateAuthToken(user.getId(), user.getTokenVersion());
    const newRefreshToken = await this.refreshTokenRepository.rotate(
      tokenRecord.id,
      tokenRecord.userId,
    );

    return { authToken, newRefreshToken };
  }
}
