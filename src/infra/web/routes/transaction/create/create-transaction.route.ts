import { Body, Controller, Post } from '@nestjs/common';
import type {
  CreateTransactionRouteRequest,
  CreateTransactionRouteResponse,
} from './create-transaction.dto';
import { CreateTransactionPresenter } from './create-transaction.presenter';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import {
  CreateTransactionInput,
  CreateTransactionUseCase,
} from 'src/usecases/transaction/create/create-transaction.usecase';

@Controller('transactions')
export class CreateTransactionRoute {
  public constructor(
    private readonly createTransactionUsecase: CreateTransactionUseCase,
  ) {}

  @Post()
  public async handle(
    @Body() request: CreateTransactionRouteRequest,
    @UserId() userId: string,
  ): Promise<CreateTransactionRouteResponse> {
    const input: CreateTransactionInput = {
      userId,
      type: request.type,
      category: request.category,
      paymentMethod: request.paymentMethod,
      amount: Math.round(request.amount * 100), // Reais -> Centavos
      description: request.description,
      date: new Date(request.date),
    };

    const result = await this.createTransactionUsecase.execute(input);

    const response = CreateTransactionPresenter.toHttp(result);

    return response;
  }
}
