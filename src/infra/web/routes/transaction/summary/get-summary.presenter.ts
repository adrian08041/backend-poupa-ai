import { GetSummaryOutput } from 'src/usecases/transaction/summary/get-summary.usecase';
import { GetSummaryRouteResponse } from './get-summary.dto';

export class GetSummaryPresenter {
  public static toHttp(output: GetSummaryOutput): GetSummaryRouteResponse {
    return {
      balance: output.balance / 100, // Converte centavos para reais
      totalIncome: output.totalIncome / 100, // Converte centavos para reais
      totalExpense: output.totalExpense / 100, // Converte centavos para reais
      totalInvestment: output.totalInvestment / 100, // Converte centavos para reais
    };
  }
}
