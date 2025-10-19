import { Injectable } from '@nestjs/common';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { UseCase } from 'src/usecases/usecase';
import { UserNotFoundUsecaseException } from 'src/usecases/exceptions/user-not-found.usecase.exception';

export type DeleteAccountInput = {
  userId: string;
};

export type DeleteAccountOutput = {
  success: boolean;
};

@Injectable()
export class DeleteAccountUseCase
  implements UseCase<DeleteAccountInput, DeleteAccountOutput>
{
  public constructor(private readonly userGateway: UserGateway) {}

  public async execute({
    userId,
  }: DeleteAccountInput): Promise<DeleteAccountOutput> {
    const user = await this.userGateway.findById(userId);

    if (!user) {
      throw new UserNotFoundUsecaseException(
        `User not found with id ${userId} in ${DeleteAccountUseCase.name}.`,
        `Usuário não encontrado.`,
        DeleteAccountUseCase.name,
      );
    }

    await this.userGateway.delete(userId);

    return { success: true };
  }
}
