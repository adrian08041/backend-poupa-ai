import { Injectable } from '@nestjs/common';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { UseCase } from 'src/usecases/usecase';
import { UserNotFoundUsecaseException } from 'src/usecases/exceptions/user-not-found.usecase.exception';
import { EmailAlreadyExistsUsecaseException } from 'src/usecases/exceptions/email-already-exists.usecase.exception';

export type UpdateProfileInput = {
  userId: string;
  name: string;
  email: string;
};

export type UpdateProfileOutput = {
  id: string;
  name: string | null;
  email: string;
};

@Injectable()
export class UpdateProfileUseCase
  implements UseCase<UpdateProfileInput, UpdateProfileOutput>
{
  public constructor(private readonly userGateway: UserGateway) {}

  public async execute({
    userId,
    name,
    email,
  }: UpdateProfileInput): Promise<UpdateProfileOutput> {
    const user = await this.userGateway.findById(userId);

    if (!user) {
      throw new UserNotFoundUsecaseException(
        `User not found with id ${userId} in ${UpdateProfileUseCase.name}.`,
        `Usuário não encontrado.`,
        UpdateProfileUseCase.name,
      );
    }

    // Verificar se o email já está em uso por outro usuário
    if (email !== user.getEmail()) {
      const existingUser = await this.userGateway.findByEmail(email);
      if (existingUser && existingUser.getId() !== userId) {
        throw new EmailAlreadyExistsUsecaseException(
          `Email already exists while updating user with email ${email} in ${UpdateProfileUseCase.name}.`,
          `O e-mail já está em uso por outro usuário.`,
          UpdateProfileUseCase.name,
        );
      }
    }

    user.updateName(name);
    user.updateEmail(email);

    await this.userGateway.update(user);

    const output: UpdateProfileOutput = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    };

    return output;
  }
}
