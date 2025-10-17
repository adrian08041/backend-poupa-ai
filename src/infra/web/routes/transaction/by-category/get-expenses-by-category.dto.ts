export type CategorySummaryDto = {
  category: string;
  amount: number;
  percentage: number;
  count: number;
};

export type GetExpensesByCategoryRouteResponse = {
  categories: CategorySummaryDto[];
};
