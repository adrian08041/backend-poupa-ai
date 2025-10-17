import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Response } from 'express';
import { ExceptionUtils } from 'src/shared/utils/exception-utils';
import { LogUtils } from 'src/shared/utils/log-utils';
import { TransactionNotFoundUsecaseException } from 'src/usecases/exceptions/transaction-not-found.usecase.exception';

@Catch(TransactionNotFoundUsecaseException)
export class TransactionNotFoundUsecaseExceptionFilter
  implements ExceptionFilter
{
  public catch(
    exception: TransactionNotFoundUsecaseException,
    host: ArgumentsHost,
  ) {
    LogUtils.logException(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.NOT_FOUND;

    const aResponseData = ExceptionUtils.buildErrorResponse(exception, status);

    response.status(status).json(aResponseData);
  }
}

export const TransactionNotFoundUsecaseExceptionFilterProvider = {
  provide: APP_FILTER,
  useClass: TransactionNotFoundUsecaseExceptionFilter,
};
