import { Injectable } from '@nestjs/common';
import { TransactionGateway } from 'src/domain/repositories/transaction.gateway';
import { Transaction } from 'src/domain/entities/transaction/transaction.entity';
import { prismaClient } from '../client.prisma';
import { TransactionEntityToPrismaModelMapper } from './model/mappers/transaction-entity-to-prisma-model.mapper';
import { TransactionPrismaModelToEntityMapper } from './model/mappers/transaction-prisma-model-to-entity.mapper';

@Injectable()
export class TransactionPrismaRepository extends TransactionGateway {
  public constructor() {
    super();
  }

  public async create(transaction: Transaction): Promise<void> {
    const model = TransactionEntityToPrismaModelMapper.map(transaction);

    console.log('🧩 Dados enviados para o Prisma:', model);

    try {
      await prismaClient.transaction.create({
        data: model,
      });
      console.log('✅ Transação criada no banco com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao criar transação no banco:', error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Transaction | null> {
    const model = await prismaClient.transaction.findUnique({
      where: {
        id: id,
      },
    });

    if (!model) {
      return null;
    }

    const transaction = TransactionPrismaModelToEntityMapper.map(model);

    return transaction;
  }

  public async findByUserId(userId: string): Promise<Transaction[]> {
    const models = await prismaClient.transaction.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const transactions = models.map((model) =>
      TransactionPrismaModelToEntityMapper.map(model),
    );

    return transactions;
  }
}
