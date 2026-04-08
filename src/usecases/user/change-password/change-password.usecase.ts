import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { RefreshTokenRepository } from 'src/infra/repositories/prisma/refresh-token/refresh-token.repository';
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
  public constructor(
    private readonly userGateway: UserGateway,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

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

    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Senha atual incorreta.');
    }

    await user.updatePassword(newPassword);
    user.incrementTokenVersion();

    await this.userGateway.update(user);
    await this.refreshTokenRepository.revokeAllByUserId(userId);

    return { success: true };
  }
}
