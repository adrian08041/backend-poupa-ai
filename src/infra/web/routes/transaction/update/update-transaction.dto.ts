export type UpdateTransactionRouteRequest = {
  type?: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category?: string;
  paymentMethod?: 'PIX' | 'BOLETO' | 'CARTAO' | 'TRANSFERENCIA' | 'DINHEIRO';
  amount?: number;
  description?: string;
  date?: string;
};

export type UpdateTransactionRouteResponse = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number; // Em reais (convertido de centavos no presenter)
  description?: string;
  date: string;
  updatedAt: string;
};
