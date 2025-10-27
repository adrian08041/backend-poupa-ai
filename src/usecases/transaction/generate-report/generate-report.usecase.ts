import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/usecases/usecase';
import { TransactionGateway } from 'src/domain/repositories/transaction.gateway';
import {
  AiInsightsService,
  ReportData,
  AIInsights,
} from 'src/infra/services/ai-insights/ai-insights.service';

export interface GenerateReportInput {
  userId: string;
  month: number; // 1-12
  year: number;
  includeComparison: boolean;
}

export interface GenerateReportOutput {
  period: {
    month: number;
    year: number;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    totalInvestments: number;
    balance: number;
    savingsRate: number;
  };
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    transactionCount: number;
  }>;
  paymentMethodBreakdown: Array<{
    method: string;
    amount: number;
    transactionCount: number;
  }>;
  topExpenses: Array<{
    description: string;
    amount: number;
    date: string;
    category: string;
  }>;
  statistics: {
    transactionCount: number;
    averagePerDay: number;
    maxExpenseDay: string;
    maxExpenseAmount: number;
    daysWithoutExpenses: number;
  };
  comparison?: {
    previousPeriod: {
      month: number;
      year: number;
    };
    income: {
      current: number;
      previous: number;
      difference: number;
      percentage: number;
    };
    expenses: {
      current: number;
      previous: number;
      difference: number;
      percentage: number;
    };
    investments: {
      current: number;
      previous: number;
      difference: number;
      percentage: number;
    };
    balance: {
      current: number;
      previous: number;
      difference: number;
      percentage: number;
    };
    categoryComparison: Array<{
      category: string;
      currentAmount: number;
      previousAmount: number;
      difference: number;
      percentage: number;
    }>;
  };
  insights: AIInsights;
  generatedAt: Date;
}

@Injectable()
export class GenerateReportUsecase
  implements UseCase<GenerateReportInput, GenerateReportOutput>
{
  constructor(
    private readonly transactionGateway: TransactionGateway,
    private readonly aiInsightsService: AiInsightsService,
  ) {}

  async execute(input: GenerateReportInput): Promise<GenerateReportOutput> {
    console.log(
      `📊 Gerando relatório para ${input.month}/${input.year} - Usuário: ${input.userId}`,
    );

    // 1. Buscar transações do período atual
    const startDate = new Date(input.year, input.month - 1, 1);
    const endDate = new Date(input.year, input.month, 0, 23, 59, 59, 999);

    const transactions = await this.transactionGateway.findByUserIdAndPeriod(
      input.userId,
      startDate,
      endDate,
    );

    console.log(`📋 Encontradas ${transactions.length} transações no período`);

    // 2. Calcular dados do período atual
    const currentPeriodData = this.calculatePeriodData(
      transactions,
      input.month,
      input.year,
      startDate,
      endDate,
    );

    // 3. Se solicitado, buscar dados do mês anterior para comparação
    let comparisonData: ReturnType<typeof this.compareperiods> | null = null;
    let categoryComparison: ReturnType<typeof this.compareCategorias> | null =
      null;

    if (input.includeComparison) {
      const previousMonth = input.month === 1 ? 12 : input.month - 1;
      const previousYear = input.month === 1 ? input.year - 1 : input.year;

      const prevStartDate = new Date(previousYear, previousMonth - 1, 1);
      const prevEndDate = new Date(
        previousYear,
        previousMonth,
        0,
        23,
        59,
        59,
        999,
      );

      const previousTransactions =
        await this.transactionGateway.findByUserIdAndPeriod(
          input.userId,
          prevStartDate,
          prevEndDate,
        );

      const previousPeriodData = this.calculatePeriodData(
        previousTransactions,
        previousMonth,
        previousYear,
        prevStartDate,
        prevEndDate,
      );

      comparisonData = this.compareperiods(
        currentPeriodData,
        previousPeriodData,
        previousMonth,
        previousYear,
      );

      categoryComparison = this.compareCategorias(
        currentPeriodData.categoryBreakdown,
        previousPeriodData.categoryBreakdown,
      );
    }

    // 4. Preparar dados para a IA
    const reportData: ReportData = {
      month: input.month,
      year: input.year,
      totalIncome: currentPeriodData.summary.totalIncome,
      totalExpenses: currentPeriodData.summary.totalExpenses,
      totalInvestments: currentPeriodData.summary.totalInvestments,
      balance: currentPeriodData.summary.balance,
      savingsRate: currentPeriodData.summary.savingsRate,
      categoryBreakdown: currentPeriodData.categoryBreakdown,
      paymentMethodBreakdown: currentPeriodData.paymentMethodBreakdown,
      topExpenses: currentPeriodData.topExpenses,
      transactionCount: currentPeriodData.statistics.transactionCount,
      averagePerDay: currentPeriodData.statistics.averagePerDay,
      maxExpenseDay: currentPeriodData.statistics.maxExpenseDay,
      maxExpenseAmount: currentPeriodData.statistics.maxExpenseAmount,
      daysWithoutExpenses: currentPeriodData.statistics.daysWithoutExpenses,
      comparisonData: comparisonData
        ? {
            previousMonth: comparisonData.previousPeriod.month,
            previousYear: comparisonData.previousPeriod.year,
            income: comparisonData.income.previous,
            incomeDifference: comparisonData.income.difference,
            incomePercentage: comparisonData.income.percentage,
            expenses: comparisonData.expenses.previous,
            expensesDifference: comparisonData.expenses.difference,
            expensesPercentage: comparisonData.expenses.percentage,
            investments: comparisonData.investments.previous,
            investmentsDifference: comparisonData.investments.difference,
            investmentsPercentage: comparisonData.investments.percentage,
            balance: comparisonData.balance.previous,
            balanceDifference: comparisonData.balance.difference,
            balancePercentage: comparisonData.balance.percentage,
          }
        : undefined,
      categoryComparison: categoryComparison || undefined,
      isFirstReport: !input.includeComparison || !comparisonData,
      trend: this.determineTrend(comparisonData),
      hasRegularInvestments: currentPeriodData.summary.totalInvestments > 0,
    };

    // 5. Gerar insights com IA
    const insights = await this.aiInsightsService.generateInsights(reportData);

    console.log('✅ Relatório gerado com sucesso');

    // 6. Retornar relatório completo
    return {
      period: {
        month: input.month,
        year: input.year,
      },
      summary: currentPeriodData.summary,
      categoryBreakdown: currentPeriodData.categoryBreakdown,
      paymentMethodBreakdown: currentPeriodData.paymentMethodBreakdown,
      topExpenses: currentPeriodData.topExpenses,
      statistics: currentPeriodData.statistics,
      comparison: comparisonData || undefined,
      insights,
      generatedAt: new Date(),
    };
  }

  private calculatePeriodData(
    transactions: any[],
    month: number,
    year: number,
    startDate: Date,
    endDate: Date,
  ) {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalInvestments = 0;

    const categoryMap = new Map<string, { amount: number; count: number }>();
    const paymentMethodMap = new Map<
      string,
      { amount: number; count: number }
    >();
    const dailyExpenses = new Map<string, number>();

    // Processar transações
    transactions.forEach((transaction) => {
      const amount = transaction.amount;
      const type = transaction.type;

      // Somar por tipo
      if (type === 'INCOME') {
        totalIncome += amount;
      } else if (type === 'EXPENSE') {
        totalExpenses += amount;

        // Rastrear categoria
        const category = transaction.category || 'OUTROS';
        const existing = categoryMap.get(category) || { amount: 0, count: 0 };
        categoryMap.set(category, {
          amount: existing.amount + amount,
          count: existing.count + 1,
        });

        // Rastrear gasto por dia
        const dateKey = transaction.date.toISOString().split('T')[0];
        dailyExpenses.set(
          dateKey,
          (dailyExpenses.get(dateKey) || 0) + amount,
        );
      } else if (type === 'INVESTMENT') {
        totalInvestments += amount;
      }

      // Rastrear método de pagamento
      const method = transaction.paymentMethod;
      const existingMethod = paymentMethodMap.get(method) || {
        amount: 0,
        count: 0,
      };
      paymentMethodMap.set(method, {
        amount: existingMethod.amount + amount,
        count: existingMethod.count + 1,
      });
    });

    const balance = totalIncome - totalExpenses - totalInvestments;
    const savingsRate =
      totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

    // Calcular breakdown de categorias
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calcular breakdown de métodos de pagamento
    const paymentMethodBreakdown = Array.from(paymentMethodMap.entries())
      .map(([method, data]) => ({
        method,
        amount: data.amount,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Top 5 maiores despesas
    const topExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((t) => ({
        description: t.description,
        amount: t.amount,
        date: t.date.toISOString().split('T')[0],
        category: t.category || 'OUTROS',
      }));

    // Estatísticas
    const daysInMonth = new Date(year, month, 0).getDate();
    const averagePerDay = totalExpenses / daysInMonth;

    let maxExpenseDay = '';
    let maxExpenseAmount = 0;
    dailyExpenses.forEach((amount, date) => {
      if (amount > maxExpenseAmount) {
        maxExpenseAmount = amount;
        maxExpenseDay = date;
      }
    });

    const daysWithoutExpenses = daysInMonth - dailyExpenses.size;

    return {
      summary: {
        totalIncome,
        totalExpenses,
        totalInvestments,
        balance,
        savingsRate,
      },
      categoryBreakdown,
      paymentMethodBreakdown,
      topExpenses,
      statistics: {
        transactionCount: transactions.length,
        averagePerDay,
        maxExpenseDay: maxExpenseDay || 'N/A',
        maxExpenseAmount,
        daysWithoutExpenses,
      },
    };
  }

  private compareperiods(
    current: any,
    previous: any,
    previousMonth: number,
    previousYear: number,
  ) {
    const calculateDiff = (curr: number, prev: number) => {
      const diff = curr - prev;
      const percentage = prev !== 0 ? (diff / prev) * 100 : 0;
      return { current: curr, previous: prev, difference: diff, percentage };
    };

    return {
      previousPeriod: {
        month: previousMonth,
        year: previousYear,
      },
      income: calculateDiff(
        current.summary.totalIncome,
        previous.summary.totalIncome,
      ),
      expenses: calculateDiff(
        current.summary.totalExpenses,
        previous.summary.totalExpenses,
      ),
      investments: calculateDiff(
        current.summary.totalInvestments,
        previous.summary.totalInvestments,
      ),
      balance: calculateDiff(
        current.summary.balance,
        previous.summary.balance,
      ),
      categoryComparison: [],
    };
  }

  private compareCategorias(
    currentCategories: any[],
    previousCategories: any[],
  ): Array<{
    category: string;
    currentAmount: number;
    previousAmount: number;
    difference: number;
    percentage: number;
  }> {
    const result: Array<{
      category: string;
      currentAmount: number;
      previousAmount: number;
      difference: number;
      percentage: number;
    }> = [];

    const prevMap = new Map(
      previousCategories.map((c) => [c.category, c.amount]),
    );

    currentCategories.forEach((curr) => {
      const prevAmount = prevMap.get(curr.category) || 0;
      const diff = curr.amount - prevAmount;
      const percentage = prevAmount !== 0 ? (diff / prevAmount) * 100 : 0;

      result.push({
        category: curr.category,
        currentAmount: curr.amount,
        previousAmount: prevAmount,
        difference: diff,
        percentage,
      });
    });

    return result;
  }

  private determineTrend(comparisonData: any): 'increasing' | 'decreasing' | 'stable' {
    if (!comparisonData) return 'stable';

    const expenseChange = comparisonData.expenses.percentage;

    if (Math.abs(expenseChange) < 5) return 'stable';
    return expenseChange > 0 ? 'increasing' : 'decreasing';
  }
}
