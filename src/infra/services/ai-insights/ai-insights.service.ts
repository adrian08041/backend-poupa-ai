/**
 * Abstract AI Insights Service Interface
 * Define o contrato para serviços de geração de insights financeiros com IA
 */
export interface ReportData {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  balance: number;
  savingsRate: number;
  categoryBreakdown: CategoryData[];
  paymentMethodBreakdown: PaymentMethodData[];
  topExpenses: TopExpenseData[];
  transactionCount: number;
  averagePerDay: number;
  maxExpenseDay: string;
  maxExpenseAmount: number;
  daysWithoutExpenses: number;
  comparisonData?: ComparisonData;
  categoryComparison?: CategoryComparisonData[];
  isFirstReport: boolean;
  trend: 'increasing' | 'decreasing' | 'stable';
  hasRegularInvestments: boolean;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface PaymentMethodData {
  method: string;
  amount: number;
  transactionCount: number;
}

export interface TopExpenseData {
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface ComparisonData {
  previousMonth: number;
  previousYear: number;
  income: number;
  incomeDifference: number;
  incomePercentage: number;
  expenses: number;
  expensesDifference: number;
  expensesPercentage: number;
  investments: number;
  investmentsDifference: number;
  investmentsPercentage: number;
  balance: number;
  balanceDifference: number;
  balancePercentage: number;
}

export interface CategoryComparisonData {
  category: string;
  currentAmount: number;
  previousAmount: number;
  difference: number;
  percentage: number;
}

export interface AIInsights {
  visaoGeral: string;
  pontosPositivos: string[];
  pontosAtencao: string[];
  analiseCategoria: CategoryAnalysis[];
  dicasPersonalizadas: PersonalizedTip[];
  metasProximoMes: MonthlyGoal[];
  comparacao: ComparisonInsights;
  curiosidade: string;
  score: HealthScore;
}

export interface CategoryAnalysis {
  categoria: string;
  gasto: number;
  percentual: number;
  analise: string;
  oportunidade: string;
}

export interface PersonalizedTip {
  titulo: string;
  descricao: string;
  impacto: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

export interface MonthlyGoal {
  tipo: 'economia' | 'investimento' | 'reducao';
  descricao: string;
  valorAlvo: number;
  categoria?: string;
}

export interface ComparisonInsights {
  resumo: string;
  melhorias: string[];
  retrocessos: string[];
  tendencia: 'positiva' | 'negativa' | 'estavel';
}

export interface HealthScore {
  saudabilidadeFinanceira: number;
  justificativa: string;
}

export abstract class AiInsightsService {
  /**
   * Gera insights financeiros baseados nos dados do relatório
   * @param reportData - Dados do relatório para análise
   * @returns Insights gerados pela IA
   */
  abstract generateInsights(reportData: ReportData): Promise<AIInsights>;
}
