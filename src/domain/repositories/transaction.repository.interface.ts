import { TransactionType, TransactionCategory } from 'generated/prisma';
import { Transaction } from '../entities/transaction/transaction.entity';

export type FindManyFilters = {
  userId: string;
  type?: TransactionType;
  category?: TransactionCategory;
  startDate?: Date;
  endDate?: Date;
  includeDeleted?: boolean;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export abstract class TransactionRepository {
  abstract create(transaction: Transaction): Promise<Transaction>;

  abstract findById(id: string): Promise<Transaction | null>;

  abstract findMany(
    filters: FindManyFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Transaction>>;

  abstract update(transaction: Transaction): Promise<Transaction>;

  abstract softDelete(id: string): Promise<void>;

  abstract sumByType(
    userId: string,
    type: TransactionType,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number>;
}
