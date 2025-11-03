import { UsecaseException } from './usecase.exception';

export class RecurringTransactionNotEditableUsecaseException extends UsecaseException {
  public constructor(transactionId: string) {
    super(
      `Transaction ${transactionId} was generated from a recurring transaction and cannot be edited directly`,
      'Esta transação foi gerada automaticamente a partir de uma transação fixa e não pode ser editada. Edite a transação fixa original.',
      'RecurringTransactionNotEditableUsecaseException',
    );
    this.name = RecurringTransactionNotEditableUsecaseException.name;
  }
}
