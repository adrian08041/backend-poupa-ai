import { RecurringTransaction } from '../entities/recurring-transaction/recurring-transaction.entity';

export interface RecurringTransactionRepository {
  create(recurringTransaction: RecurringTransaction): Promise<RecurringTransaction>;
  findById(id: string): Promise<RecurringTransaction | null>;
  findByUserId(userId: string): Promise<RecurringTransaction[]>;
  findActiveByUserId(userId: string): Promise<RecurringTransaction[]>;
  findActiveDueForProcessing(): Promise<RecurringTransaction[]>;
  update(recurringTransaction: RecurringTransaction): Promise<RecurringTransaction>;
  delete(id: string): Promise<void>;
}
