import { Transaction } from '../entities/transaction/transaction.entity';

/**
 * 🚪 GATEWAY PATTERN (Repository Interface)
 *
 * CONCEITO:
 * - É uma INTERFACE abstrata na camada de domínio
 * - Define O QUE fazer, não COMO fazer
 * - Implementação concreta fica na camada de infraestrutura
 *
 * POR QUE?
 * - Inversão de Dependência (SOLID)
 * - Domínio não depende de detalhes de infraestrutura
 * - Fácil trocar implementação (Prisma → TypeORM → MongoDB)
 * - Facilita testes (mock do repositório)
 *
 * PADRÃO DO PROJETO:
 * - Seguindo o UserGateway (linha 3-7 de user.gateway.ts)
 * - Métodos abstratos que serão implementados pelo PrismaRepository
 */

export type TransactionSummary = {
  balance: number; // Em centavos
  totalIncome: number; // Em centavos
  totalExpense: number; // Em centavos
  totalInvestment: number; // Em centavos
};

export type CategorySummary = {
  category: string;
  amount: number; // Em centavos
  percentage: number; // 0-100
  count: number; // Quantidade de transações
};

export abstract class TransactionGateway {
  /**
   * Cria uma nova transação no banco
   */
  abstract create(transaction: Transaction): Promise<void>;

  /**
   * Busca transação por ID
   * Retorna null se não encontrar
   */
  abstract findById(id: string): Promise<Transaction | null>;

  /**
   * Busca todas as transações de um usuário
   * Não inclui transações deletadas (deletedAt != null)
   */
  abstract findByUserId(userId: string): Promise<Transaction[]>;

  /**
   * Atualiza uma transação existente
   */
  abstract update(transaction: Transaction): Promise<void>;

  /**
   * Soft delete: marca transação como deletada (deletedAt = now)
   */
  abstract softDelete(id: string): Promise<void>;

  /**
   * Retorna resumo financeiro do usuário (dashboard)
   * Calcula: saldo, receitas totais, despesas totais, investimentos totais
   */
  abstract getSummaryByUserId(userId: string): Promise<TransactionSummary>;

  /**
   * Retorna gastos agrupados por categoria (para gráficos)
   * Apenas transações do tipo EXPENSE
   */
  abstract getExpensesByCategory(userId: string): Promise<CategorySummary[]>;
}
