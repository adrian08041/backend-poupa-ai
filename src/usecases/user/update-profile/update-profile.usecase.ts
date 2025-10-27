import { Injectable } from '@nestjs/common';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { JwtService } from 'src/infra/services/jwt/jwt.service';
import { UseCase } from 'src/usecases/usecase';
import { UserNotFoundUsecaseException } from 'src/usecases/exceptions/user-not-found.usecase.exception';

export type UpdateProfileInput = {
  userId: string;
  name: string;
};

export type UpdateProfileOutput = {
  id: string;
  name: string | null;
  email: string;
  authToken: string;
};

@Injectable()
export class UpdateProfileUseCase
  implements UseCase<UpdateProfileInput, UpdateProfileOutput>
{
  public constructor(
    private readonly userGateway: UserGateway,
    private readonly jwtService: JwtService,
  ) {}

  public async execute({
    userId,
    name,
  }: UpdateProfileInput): Promise<UpdateProfileOutput> {
    const user = await this.userGateway.findById(userId);

    if (!user) {
      throw new UserNotFoundUsecaseException(
        `User not found with id ${userId} in ${UpdateProfileUseCase.name}.`,
        `Usuário não encontrado.`,
        UpdateProfileUseCase.name,
      );
    }

    user.updateName(name);

    await this.userGateway.update(user);

    const authToken = this.jwtService.generateAuthToken(user.getId());

    const output: UpdateProfileOutput = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      authToken,
    };

    return output;
  }
}
