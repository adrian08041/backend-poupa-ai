import { Injectable } from '@nestjs/common';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { JwtService } from 'src/infra/services/jwt/jwt.service';
import { WhatsappNotLinkedUsecaseException } from 'src/usecases/exceptions/whatsapp-not-linked.usecase.exception';
import { UseCase } from 'src/usecases/usecase';

export type AuthenticateWithWhatsappInput = {
  whatsappNumber: string;
};

export type AuthenticateWithWhatsappOutput = {
  authToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

@Injectable()
export class AuthenticateWithWhatsappUseCase
  implements
    UseCase<AuthenticateWithWhatsappInput, AuthenticateWithWhatsappOutput>
{
  public constructor(
    private readonly userGateway: UserGateway,
    private readonly jwtService: JwtService,
  ) {}

  public async execute({
    whatsappNumber,
  }: AuthenticateWithWhatsappInput): Promise<AuthenticateWithWhatsappOutput> {
    // Sanitizar o número recebido
    let sanitizedNumber = whatsappNumber.replace(/[^\d+]/g, '');
    if (!sanitizedNumber.startsWith('+')) {
      sanitizedNumber = `+${sanitizedNumber}`;
    }

    // 1. Buscar usuário pelo WhatsApp
    const user = await this.userGateway.findByWhatsappNumber(sanitizedNumber);

    if (!user) {
      throw new WhatsappNotLinkedUsecaseException(
        `User not found while authenticating with whatsapp ${whatsappNumber} in ${AuthenticateWithWhatsappUseCase.name}.`,
        `Este número de WhatsApp não está vinculado a nenhuma conta.`,
        AuthenticateWithWhatsappUseCase.name,
      );
    }

    // 2. Gerar tokens JWT
    const authToken = this.jwtService.generateAuthToken(user.getId());
    const refreshToken = this.jwtService.generateRefreshToken(user.getId());

    // 3. Retornar tokens e dados do usuário
    return {
      authToken,
      refreshToken,
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
      },
    };
  }
}
