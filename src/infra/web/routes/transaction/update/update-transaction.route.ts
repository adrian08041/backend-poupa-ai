import { Body, Controller, Param, Put } from '@nestjs/common';
import type {
  UpdateTransactionRouteRequest,
  UpdateTransactionRouteResponse,
} from './update-transaction.dto';
import { UpdateTransactionPresenter } from './update-transaction.presenter';
import { UserId } from 'src/infra/web/auth/decorators/user-id.decorator';
import {
  UpdateTransactionInput,
  UpdateTransactionUseCase,
} from 'src/usecases/transaction/update/update-transaction.usecase';
import {
  TransactionType,
  TransactionCategory,
  PaymentMethod,
} from 'src/domain/entities/transaction/transaction.entity';

@Controller('transactions')
export class UpdateTransactionRoute {
  public constructor(
    private readonly updateTransactionUsecase: UpdateTransactionUseCase,
  ) {}

  @Put(':id')
  public async handle(
    @Param('id') transactionId: string,
    @Body() request: UpdateTransactionRouteRequest,
    @UserId() userId: string,
  ): Promise<UpdateTransactionRouteResponse> {
    const input: UpdateTransactionInput = {
      transactionId,
      userId,
      type: request.type as TransactionType | undefined,
      category: request.category as TransactionCategory | undefined,
      paymentMethod: request.paymentMethod as PaymentMethod | undefined,
      amount: request.amount ? Math.round(request.amount * 100) : undefined, // Reais -> Centavos
      description: request.description,
      date: request.date ? new Date(request.date) : undefined,
    };

    const result = await this.updateTransactionUsecase.execute(input);

    const response = UpdateTransactionPresenter.toHttp(result);

    return response;
  }
}
