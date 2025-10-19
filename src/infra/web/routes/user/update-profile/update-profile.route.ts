import { Body, Controller, Put } from '@nestjs/common';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import {
  UpdateProfileInput,
  UpdateProfileUseCase,
} from 'src/usecases/user/update-profile/update-profile.usecase';
import type {
  UpdateProfileRouteRequest,
  UpdateProfileRouteResponse,
} from './update-profile.dto';
import { UpdateProfilePresenter } from './update-profile.presenter';

@Controller('users')
export class UpdateProfileRoute {
  public constructor(
    private readonly updateProfileUsecase: UpdateProfileUseCase,
  ) {}

  @Put('profile')
  public async handle(
    @UserId() userId: string,
    @Body() request: UpdateProfileRouteRequest,
  ): Promise<UpdateProfileRouteResponse> {
    const input: UpdateProfileInput = {
      userId,
      name: request.name,
      email: request.email,
    };

    const output = await this.updateProfileUsecase.execute(input);

    const response = UpdateProfilePresenter.toHttp(output);

    return response;
  }
}
