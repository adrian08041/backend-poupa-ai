import { UsecaseException } from './usecase.exception';

export class TransactionNotFoundUsecaseException extends UsecaseException {
  public constructor(transactionId: string) {
    super(
      `Transaction with ID ${transactionId} not found`,
      'Transaction not found',
      'TransactionNotFoundUsecaseException',
    );
    this.name = TransactionNotFoundUsecaseException.name;
  }
}
