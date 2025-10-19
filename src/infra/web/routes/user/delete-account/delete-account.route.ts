import { Controller, Delete } from '@nestjs/common';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import {
  DeleteAccountInput,
  DeleteAccountUseCase,
} from 'src/usecases/user/delete-account/delete-account.usecase';
import { DeleteAccountRouteResponse } from './delete-account.dto';
import { DeleteAccountPresenter } from './delete-account.presenter';

@Controller('users')
export class DeleteAccountRoute {
  public constructor(
    private readonly deleteAccountUsecase: DeleteAccountUseCase,
  ) {}

  @Delete('account')
  public async handle(
    @UserId() userId: string,
  ): Promise<DeleteAccountRouteResponse> {
    const input: DeleteAccountInput = {
      userId,
    };

    const output = await this.deleteAccountUsecase.execute(input);

    const response = DeleteAccountPresenter.toHttp(output);

    return response;
  }
}
