export type TransactionResponseDto = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number; // Em centavos
  description?: string;
  date: string;
  createdAt: string;
};

export type ListTransactionsRouteResponse = {
  transactions: TransactionResponseDto[];
};
