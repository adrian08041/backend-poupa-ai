import { Controller, Get, Query } from '@nestjs/common';
import type { ListTransactionsRouteResponse } from './list-transactions.dto';
import { ListTransactionsPresenter } from './list-transactions.presenter';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import {
  ListTransactionsInput,
  ListTransactionsUseCase,
} from 'src/usecases/transaction/list/list-transactions.usecase';

@Controller('transactions')
export class ListTransactionsRoute {
  public constructor(
    private readonly listTransactionsUsecase: ListTransactionsUseCase,
  ) {}

  @Get()
  public async handle(
    @UserId() userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ListTransactionsRouteResponse> {
    const input: ListTransactionsInput = {
      userId,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    const result = await this.listTransactionsUsecase.execute(input);

    return ListTransactionsPresenter.toHttp(result);
  }
}
