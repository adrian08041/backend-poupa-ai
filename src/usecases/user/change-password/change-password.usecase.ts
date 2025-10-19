import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { UseCase } from 'src/usecases/usecase';
import { UserNotFoundUsecaseException } from 'src/usecases/exceptions/user-not-found.usecase.exception';

export type ChangePasswordInput = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordOutput = {
  success: boolean;
};

@Injectable()
export class ChangePasswordUseCase
  implements UseCase<ChangePasswordInput, ChangePasswordOutput>
{
  public constructor(private readonly userGateway: UserGateway) {}

  public async execute({
    userId,
    currentPassword,
    newPassword,
  }: ChangePasswordInput): Promise<ChangePasswordOutput> {
    const user = await this.userGateway.findById(userId);

    if (!user) {
      throw new UserNotFoundUsecaseException(
        `User not found with id ${userId} in ${ChangePasswordUseCase.name}.`,
        `Usuário não encontrado.`,
        ChangePasswordUseCase.name,
      );
    }

    // Verificar se a senha atual está correta
    const isPasswordCorrect = user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Senha atual incorreta.');
    }

    // Atualizar a senha
    user.updatePassword(newPassword);

    await this.userGateway.update(user);

    return { success: true };
  }
}
