import { Controller, Get } from '@nestjs/common';
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
  ): Promise<ListTransactionsRouteResponse> {
    const input: ListTransactionsInput = {
      userId,
    };

    const result = await this.listTransactionsUsecase.execute(input);

    const response = ListTransactionsPresenter.toHttp(result);

    return response;
  }
}
