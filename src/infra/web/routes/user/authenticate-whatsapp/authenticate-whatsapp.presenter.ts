import { AuthenticateWithWhatsappOutput } from 'src/usecases/user/authenticate-whatsapp/authenticate-with-whatsapp.usecase';
import { AuthenticateWhatsappResponse } from './authenticate-whatsapp.dto';

export class AuthenticateWhatsappPresenter {
  public static toHttp(
    input: AuthenticateWithWhatsappOutput,
  ): AuthenticateWhatsappResponse {
    const response: AuthenticateWhatsappResponse = {
      authToken: input.authToken,
      refreshToken: input.refreshToken,
      user: {
        id: input.user.id,
        name: input.user.name,
        email: input.user.email,
      },
    };

    return response;
  }
}
