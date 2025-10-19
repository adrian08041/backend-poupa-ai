export type GetSummaryRouteResponse = {
  balance: number; // Em reais (convertido de centavos no presenter)
  totalIncome: number; // Em reais (convertido de centavos no presenter)
  totalExpense: number; // Em reais (convertido de centavos no presenter)
  totalInvestment: number; // Em reais (convertido de centavos no presenter)
};
