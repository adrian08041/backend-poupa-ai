import { LinkWhatsappToUserOutput } from 'src/usecases/user/link-whatsapp/link-whatsapp-to-user.usecase';
import { LinkWhatsappResponse } from './link-whatsapp.dto';

export class LinkWhatsappPresenter {
  public static toHttp(input: LinkWhatsappToUserOutput): LinkWhatsappResponse {
    const response: LinkWhatsappResponse = {
      success: input.success,
      whatsappNumber: input.whatsappNumber,
    };

    return response;
  }
}
