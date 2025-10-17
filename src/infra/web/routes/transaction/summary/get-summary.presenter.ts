import { GetSummaryOutput } from 'src/usecases/transaction/summary/get-summary.usecase';
import { GetSummaryRouteResponse } from './get-summary.dto';

export class GetSummaryPresenter {
  public static toHttp(output: GetSummaryOutput): GetSummaryRouteResponse {
    return {
      balance: output.balance,
      totalIncome: output.totalIncome,
      totalExpense: output.totalExpense,
      totalInvestment: output.totalInvestment,
    };
  }
}
