import { Body, Controller, Post } from '@nestjs/common';
import type {
  CreateUserRouteRequest,
  CreateUserRouteResponse,
} from './create.user.dto';
import { createUserSchema } from './create.user.dto';
import {
  CreateUserInput,
  CreateUserUseCase,
} from 'src/usecases/user/create/create-user.usecase';
import { CreateUserPresenter } from './create-user.presenter';
import { IsPublic } from 'src/infra/web/auth/decorators/is-public.decorator';
import { ZodValidationPipe } from 'src/infra/web/pipes/zod-validation.pipe';

@Controller('users')
export class CreateUserRoute {
  public constructor(private readonly createUserUsecase: CreateUserUseCase) {}
  @IsPublic()
  @Post()
  public async handle(
    @Body(new ZodValidationPipe(createUserSchema)) request: CreateUserRouteRequest,
  ): Promise<CreateUserRouteResponse> {
    const input: CreateUserInput = {
      name: request.name,
      email: request.email,
      password: request.password,
    };

    const result = await this.createUserUsecase.execute(input);

    const response = CreateUserPresenter.toHttp(result);

    return response;
  }
}
