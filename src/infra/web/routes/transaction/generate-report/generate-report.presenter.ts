import { GenerateReportOutput } from 'src/usecases/transaction/generate-report/generate-report.usecase';

/**
 * Presenter para formatar a resposta do relatório
 */
export class GenerateReportPresenter {
  static toHttp(output: GenerateReportOutput) {
    return {
      period: output.period,
      summary: {
        totalIncome: output.summary.totalIncome,
        totalExpenses: output.summary.totalExpenses,
        totalInvestments: output.summary.totalInvestments,
        balance: output.summary.balance,
        savingsRate: Math.round(output.summary.savingsRate * 100) / 100,
      },
      categoryBreakdown: output.categoryBreakdown.map((cat) => ({
        category: cat.category,
        amount: cat.amount,
        percentage: Math.round(cat.percentage * 100) / 100,
        transactionCount: cat.transactionCount,
      })),
      paymentMethodBreakdown: output.paymentMethodBreakdown.map((pm) => ({
        method: pm.method,
        amount: pm.amount,
        transactionCount: pm.transactionCount,
      })),
      topExpenses: output.topExpenses,
      statistics: {
        transactionCount: output.statistics.transactionCount,
        averagePerDay: Math.round(output.statistics.averagePerDay * 100) / 100,
        maxExpenseDay: output.statistics.maxExpenseDay,
        maxExpenseAmount: output.statistics.maxExpenseAmount,
        daysWithoutExpenses: output.statistics.daysWithoutExpenses,
      },
      comparison: output.comparison
        ? {
            previousPeriod: output.comparison.previousPeriod,
            income: {
              current: output.comparison.income.current,
              previous: output.comparison.income.previous,
              difference: output.comparison.income.difference,
              percentage:
                Math.round(output.comparison.income.percentage * 100) / 100,
            },
            expenses: {
              current: output.comparison.expenses.current,
              previous: output.comparison.expenses.previous,
              difference: output.comparison.expenses.difference,
              percentage:
                Math.round(output.comparison.expenses.percentage * 100) / 100,
            },
            investments: {
              current: output.comparison.investments.current,
              previous: output.comparison.investments.previous,
              difference: output.comparison.investments.difference,
              percentage:
                Math.round(output.comparison.investments.percentage * 100) /
                100,
            },
            balance: {
              current: output.comparison.balance.current,
              previous: output.comparison.balance.previous,
              difference: output.comparison.balance.difference,
              percentage:
                Math.round(output.comparison.balance.percentage * 100) / 100,
            },
            categoryComparison: output.comparison.categoryComparison.map(
              (cat) => ({
                category: cat.category,
                currentAmount: cat.currentAmount,
                previousAmount: cat.previousAmount,
                difference: cat.difference,
                percentage: Math.round(cat.percentage * 100) / 100,
              }),
            ),
          }
        : null,
      insights: output.insights,
      generatedAt: output.generatedAt,
    };
  }
}
