import { UsecaseException } from './usecase.exception';

export class UnauthorizedTransactionAccessUsecaseException extends UsecaseException {
  public constructor(userId: string, transactionId: string) {
    super(
      `User ${userId} attempted to access transaction ${transactionId} without permission`,
      'You do not have permission to access this transaction',
      'UnauthorizedTransactionAccessUsecaseException',
    );
    this.name = UnauthorizedTransactionAccessUsecaseException.name;
  }
}
