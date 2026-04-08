import { Body, Controller, Put } from '@nestjs/common';
import {
  LinkWhatsappToUserInput,
  LinkWhatsappToUserUseCase,
} from 'src/usecases/user/link-whatsapp/link-whatsapp-to-user.usecase';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import { LinkWhatsappPresenter } from './link-whatsapp.presenter';
import type { LinkWhatsappRequest, LinkWhatsappResponse } from './link-whatsapp.dto';
import { linkWhatsappSchema } from './link-whatsapp.dto';
import { ZodValidationPipe } from 'src/infra/web/pipes/zod-validation.pipe';

@Controller('/users')
export class LinkWhatsappRoute {
  public constructor(
    private readonly linkWhatsappUsecase: LinkWhatsappToUserUseCase,
  ) {}

  @Put('/me/whatsapp')
  public async handle(
    @UserId() userId: string,
    @Body(new ZodValidationPipe(linkWhatsappSchema)) request: LinkWhatsappRequest,
  ): Promise<LinkWhatsappResponse> {
    const input: LinkWhatsappToUserInput = {
      userId: userId,
      whatsappNumber: request.whatsappNumber,
    };

    const result = await this.linkWhatsappUsecase.execute(input);

    const response = LinkWhatsappPresenter.toHttp(result);

    return response;
  }
}
