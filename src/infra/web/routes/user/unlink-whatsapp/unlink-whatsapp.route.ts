import { Controller, Delete } from '@nestjs/common';
import {
  UnlinkWhatsappFromUserInput,
  UnlinkWhatsappFromUserUseCase,
} from 'src/usecases/user/unlink-whatsapp/unlink-whatsapp-from-user.usecase';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import { UnlinkWhatsappPresenter } from './unlink-whatsapp.presenter';
import type { UnlinkWhatsappResponse } from './unlink-whatsapp.dto';

@Controller('/users')
export class UnlinkWhatsappRoute {
  public constructor(
    private readonly unlinkWhatsappUsecase: UnlinkWhatsappFromUserUseCase,
  ) {}

  @Delete('/me/whatsapp')
  public async handle(
    @UserId() userId: string,
  ): Promise<UnlinkWhatsappResponse> {
    const input: UnlinkWhatsappFromUserInput = {
      userId: userId,
    };

    const result = await this.unlinkWhatsappUsecase.execute(input);

    const response = UnlinkWhatsappPresenter.toHttp(result);

    return response;
  }
}
