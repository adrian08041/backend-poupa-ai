import { Body, Controller, Put } from '@nestjs/common';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import {
  ChangePasswordInput,
  ChangePasswordUseCase,
} from 'src/usecases/user/change-password/change-password.usecase';
import type {
  ChangePasswordRouteRequest,
  ChangePasswordRouteResponse,
} from './change-password.dto';
import { ChangePasswordPresenter } from './change-password.presenter';

@Controller('users')
export class ChangePasswordRoute {
  public constructor(
    private readonly changePasswordUsecase: ChangePasswordUseCase,
  ) {}

  @Put('change-password')
  public async handle(
    @UserId() userId: string,
    @Body() request: ChangePasswordRouteRequest,
  ): Promise<ChangePasswordRouteResponse> {
    const input: ChangePasswordInput = {
      userId,
      currentPassword: request.currentPassword,
      newPassword: request.newPassword,
    };

    const output = await this.changePasswordUsecase.execute(input);

    const response = ChangePasswordPresenter.toHttp(output);

    return response;
  }
}
