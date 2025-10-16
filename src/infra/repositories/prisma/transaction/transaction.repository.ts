import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma'; // ← Adicionar este import
import { PrismaService } from 'src/infra/services/database/prisma/prisma.service';
import {
  TransactionRepository,
  FindManyFilters,
  PaginationParams,
  PaginatedResult,
} from 'src/domain/repositories/transaction.repository.interface';
import { Transaction } from 'src/domain/entities/transaction/transaction.entity';
import { TransactionEntityToPrismaModelMapper } from './model/mappers/transaction-entity-to-prisma-model.mapper';
import { TransactionPrismaModelToEntityMapper } from './model/mappers/transaction-prisma-model-to-entity.mapper';

@Injectable()
export class TransactionPrismaRepository extends TransactionRepository {
  public constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(transaction: Transaction): Promise<Transaction> {
    const aModel = TransactionEntityToPrismaModelMapper.map(transaction);

    console.log('🧩 Dados enviados para o Prisma (Transaction):', aModel);

    try {
      const created = await this.prisma.transaction.create({
        data: aModel,
      });

      console.log('✅ Transação criada no banco com sucesso!');

      return TransactionPrismaModelToEntityMapper.map(created);
    } catch (error) {
      console.error('❌ Erro ao criar transação no banco:', error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Transaction | null> {
    const aModel = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!aModel) {
      return null;
    }

    return TransactionPrismaModelToEntityMapper.map(aModel);
  }

  public async findMany(
    filters: FindManyFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Transaction>> {
    const { userId, type, category, startDate, endDate, includeDeleted } =
      filters;
    const { page, limit } = pagination;

    // ✅ Trocar 'any' por 'Prisma.TransactionWhereInput'
    const where: Prisma.TransactionWhereInput = {
      userId,
    };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const total = await this.prisma.transaction.count({ where });

    const models = await this.prisma.transaction.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        date: 'desc',
      },
    });

    const data = models.map((model) =>
      TransactionPrismaModelToEntityMapper.map(model),
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async update(transaction: Transaction): Promise<Transaction> {
    const aModel =
      TransactionEntityToPrismaModelMapper.mapForUpdate(transaction);

    console.log('🧩 Dados enviados para atualização (Transaction):', aModel);

    try {
      const updated = await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: aModel,
      });

      console.log('✅ Transação atualizada com sucesso!');

      return TransactionPrismaModelToEntityMapper.map(updated);
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error);
      throw error;
    }
  }

  public async softDelete(id: string): Promise<void> {
    await this.prisma.transaction.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('✅ Transação marcada como deletada (soft delete)');
  }

  public async sumByType(
    userId: string,
    type: 'INCOME' | 'EXPENSE',
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    // ✅ Trocar 'any' por 'Prisma.TransactionWhereInput'
    const where: Prisma.TransactionWhereInput = {
      userId,
      type,
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const result = await this.prisma.transaction.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }
}
