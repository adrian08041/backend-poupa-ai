import { Injectable } from '@nestjs/common';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { UserNotFoundUsecaseException } from 'src/usecases/exceptions/user-not-found.usecase.exception';
import { UseCase } from 'src/usecases/usecase';

export type UnlinkWhatsappFromUserInput = {
  userId: string;
};

export type UnlinkWhatsappFromUserOutput = {
  success: boolean;
};

@Injectable()
export class UnlinkWhatsappFromUserUseCase
  implements UseCase<UnlinkWhatsappFromUserInput, UnlinkWhatsappFromUserOutput>
{
  public constructor(private readonly userGateway: UserGateway) {}

  public async execute({
    userId,
  }: UnlinkWhatsappFromUserInput): Promise<UnlinkWhatsappFromUserOutput> {
    // 1. Buscar o usuário pelo ID
    const user = await this.userGateway.findById(userId);

    if (!user) {
      throw new UserNotFoundUsecaseException(
        `User not found while unlinking whatsapp with id ${userId} in ${UnlinkWhatsappFromUserUseCase.name}.`,
        `Usuário não encontrado.`,
        UnlinkWhatsappFromUserUseCase.name,
      );
    }

    // 2. Remover o número de WhatsApp
    user.updateWhatsappNumber(null);

    // 3. Salvar no banco de dados
    await this.userGateway.update(user);

    return {
      success: true,
    };
  }
}
