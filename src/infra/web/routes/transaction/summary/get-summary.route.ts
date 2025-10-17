import { Controller, Get } from '@nestjs/common';
import type { GetSummaryRouteResponse } from './get-summary.dto';
import { GetSummaryPresenter } from './get-summary.presenter';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import {
  GetSummaryInput,
  GetSummaryUseCase,
} from 'src/usecases/transaction/summary/get-summary.usecase';

@Controller('transactions')
export class GetSummaryRoute {
  public constructor(private readonly getSummaryUsecase: GetSummaryUseCase) {}

  @Get('summary')
  public async handle(
    @UserId() userId: string,
  ): Promise<GetSummaryRouteResponse> {
    const input: GetSummaryInput = {
      userId,
    };

    const result = await this.getSummaryUsecase.execute(input);

    const response = GetSummaryPresenter.toHttp(result);

    return response;
  }
}
