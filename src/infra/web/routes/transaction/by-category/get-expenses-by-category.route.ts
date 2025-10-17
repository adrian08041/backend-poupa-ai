import { Controller, Get } from '@nestjs/common';
import type { GetExpensesByCategoryRouteResponse } from './get-expenses-by-category.dto';
import { GetExpensesByCategoryPresenter } from './get-expenses-by-category.presenter';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import {
  GetExpensesByCategoryInput,
  GetExpensesByCategoryUseCase,
} from 'src/usecases/transaction/by-category/get-expenses-by-category.usecase';

@Controller('transactions')
export class GetExpensesByCategoryRoute {
  public constructor(
    private readonly getExpensesByCategoryUsecase: GetExpensesByCategoryUseCase,
  ) {}

  @Get('by-category')
  public async handle(
    @UserId() userId: string,
  ): Promise<GetExpensesByCategoryRouteResponse> {
    const input: GetExpensesByCategoryInput = {
      userId,
    };

    const result = await this.getExpensesByCategoryUsecase.execute(input);

    const response = GetExpensesByCategoryPresenter.toHttp(result);

    return response;
  }
}
