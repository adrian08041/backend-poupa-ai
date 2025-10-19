export type CategorySummaryDto = {
  category: string;
  amount: number; // Em reais (convertido de centavos no presenter)
  percentage: number;
  count: number;
};

export type GetExpensesByCategoryRouteResponse = {
  categories: CategorySummaryDto[];
};
