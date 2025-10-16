import { CreateTransactionRouteResponse } from './create-transaction.dto';

export type CreateTransactionOutput = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number; // Em centavos (vindo do banco)
  description?: string;
  date: Date; // Objeto Date
  createdAt: Date; // Objeto Date
};

export class CreateTransactionPresenter {
  public static toHttp(
    input: CreateTransactionOutput,
  ): CreateTransactionRouteResponse {
    const response: CreateTransactionRouteResponse = {
      id: input.id,
      type: input.type,
      category: input.category,

      amount: input.amount / 100,

      paymentMethod: input.paymentMethod,
      description: input.description,

      date: input.date.toISOString(),
      createdAt: input.createdAt.toISOString(),
    };

    return response;
  }
}
