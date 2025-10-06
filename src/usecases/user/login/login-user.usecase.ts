import { UserGateway } from 'src/domain/repositories/user.gateway';
import { JwtService } from 'src/infra/services/jwt/jwt.service';
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

export class LoginUserUseCase
  implements UseCase<LoginUserInput, LoginUserOutput>
{
  public constructor(
    private readonly userGateway: UserGateway,

    private readonly jwtService: JwtService,
  ) {}

  public async execute({
    email,
    password,
  }: LoginUserInput): Promise<LoginUserOutput> {
    const anUser = await this.userGateway.findByEmail(email);

    if (!anUser) {
      throw new CredentialsNotValidUsecaseException(
        `User not found while login user with email ${email} in ${LoginUserUseCase.name}.`,
        `Credenciais inválidas.`,
        LoginUserUseCase.name,
      );
    }
    const isValidPassword = anUser.comparePassword(password);

    if (!isValidPassword) {
      throw new CredentialsNotValidUsecaseException(
        `Password ${password} is not valid while login user with email ${email} in ${LoginUserUseCase.name}.`,
        `Credenciais inválidas.`,
        LoginUserUseCase.name,
      );
    }

    const authToken = await this.jwtService.generateAuthToken(anUser.getId());
    const refreshToken = await this.jwtService.generateRefreshToken(
      anUser.getId(),
    );

    const output: LoginUserOutput = {
      authToken,
      refreshToken,
    };

    return output;
  }
}
