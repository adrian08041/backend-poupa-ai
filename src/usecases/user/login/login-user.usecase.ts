import { Injectable } from '@nestjs/common';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { RefreshTokenRepository } from 'src/infra/repositories/prisma/refresh-token/refresh-token.repository';
import { JwtService } from 'src/infra/services/jwt/jwt.service';
import { Utils } from 'src/shared/utils/utils';
import { CredentialsNotValidUsecaseException } from 'src/usecases/exceptions/credentials-not-valid.usecase';
import { UseCase } from 'src/usecases/usecase';

export type LoginUserInput = {
  email: string;
  password: string;
};

export type LoginUserOutput = {
  authToken: string;
  refreshToken: string;
};

@Injectable()
export class LoginUserUsecase
  implements UseCase<LoginUserInput, LoginUserOutput>
{
  public constructor(
    private readonly userGateway: UserGateway,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async execute({
    email,
    password,
  }: LoginUserInput): Promise<LoginUserOutput> {
    const anUser = await this.userGateway.findByEmail(email);

    if (!anUser) {
      await Utils.comparePassword(password, Utils.getDummyHash());
      throw new CredentialsNotValidUsecaseException(
        `User not found while login user with email ${email} in ${LoginUserUsecase.name}`,
        `Credenciais inválidas`,
        LoginUserUsecase.name,
      );
    }

    const isValidPassword = await anUser.comparePassword(password);

    if (!isValidPassword) {
      throw new CredentialsNotValidUsecaseException(
        `Invalid password for user with email ${email} and id ${anUser.getId()} in ${LoginUserUsecase.name}`,
        `Credenciais inválidas`,
        LoginUserUsecase.name,
      );
    }

    const authToken = this.jwtService.generateAuthToken(anUser.getId(), anUser.getTokenVersion());
    const refreshToken = this.refreshTokenRepository.generateToken();
    await this.refreshTokenRepository.create(anUser.getId(), refreshToken);

    return { authToken, refreshToken };
  }
}
