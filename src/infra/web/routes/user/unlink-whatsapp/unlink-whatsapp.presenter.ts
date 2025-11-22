import { UnlinkWhatsappFromUserOutput } from 'src/usecases/user/unlink-whatsapp/unlink-whatsapp-from-user.usecase';
import { UnlinkWhatsappResponse } from './unlink-whatsapp.dto';

export class UnlinkWhatsappPresenter {
  public static toHttp(
    input: UnlinkWhatsappFromUserOutput,
  ): UnlinkWhatsappResponse {
    const response: UnlinkWhatsappResponse = {
      success: input.success,
    };

    return response;
  }
}
