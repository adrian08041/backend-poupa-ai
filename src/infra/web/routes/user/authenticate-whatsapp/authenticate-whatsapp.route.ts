import { Body, Controller, Post } from '@nestjs/common';
import {
  AuthenticateWithWhatsappInput,
  AuthenticateWithWhatsappUseCase,
} from 'src/usecases/user/authenticate-whatsapp/authenticate-with-whatsapp.usecase';
import { IsPublic } from 'src/infra/web/auth/decorators/is-public.decorator';
import { AuthenticateWhatsappPresenter } from './authenticate-whatsapp.presenter';
import type {
  AuthenticateWhatsappRequest,
  AuthenticateWhatsappResponse,
} from './authenticate-whatsapp.dto';

@Controller('/users')
export class AuthenticateWhatsappRoute {
  public constructor(
    private readonly authenticateWhatsappUsecase: AuthenticateWithWhatsappUseCase,
  ) {}

  @IsPublic()
  @Post('/whatsapp/auth')
  public async handle(
    @Body() request: AuthenticateWhatsappRequest,
  ): Promise<AuthenticateWhatsappResponse> {
    const input: AuthenticateWithWhatsappInput = {
      whatsappNumber: request.whatsappNumber,
    };

    const result = await this.authenticateWhatsappUsecase.execute(input);

    const response = AuthenticateWhatsappPresenter.toHttp(result);

    return response;
  }
}
