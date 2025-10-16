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
}
