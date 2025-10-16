// <� Request: O que o CLIENTE envia para criar uma transa��o
export type CreateTransactionRouteRequest = {
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT'; // Tipo: receita, despesa ou investimento
  category:
    | 'ALIMENTACAO'
    | 'TRANSPORTE'
    | 'LAZER'
    | 'SAUDE'
    | 'EDUCACAO'
    | 'MORADIA'
    | 'VESTUARIO'
    | 'SALARIO'
    | 'FREELANCE'
    | 'INVESTIMENTO'
    | 'PRESENTE'
    | 'OUTROS';
  paymentMethod?: 'PIX' | 'BOLETO' | 'CARTAO' | 'TRANSFERENCIA' | 'DINHEIRO';
  amount: number;
  description?: string;
  date: string;
};

export type CreateTransactionRouteResponse = {
  id: string; // ID da transa��o criada
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category: string;
  paymentMethod?: string;
  amount: number; // Retornamos em REAIS novamente para o cliente
  description?: string;
  date: string; // Data ISO string
  createdAt: string; // Timestamp de cria��o
};
