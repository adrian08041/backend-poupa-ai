import { Injectable } from '@nestjs/common';

import { User } from 'src/domain/entities/user.entity';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { prismaClient } from '../../client.prisma';
import { UserPrismaModelToUserEntityMapper } from './mappers/user-prisma-model-to-user-entity.mapper';
import { UserEntityToUserPrismaModelMapper } from './mappers/user-entity-to-user-prisma-model.mapper';

@Injectable()
export class UserPrismaRepository extends UserGateway {
  public constructor() {
    super();
  }

  public async findByEmail(email: string): Promise<User | null> {
    const aModel = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!aModel) {
      return null;
    }

    const anUser = UserPrismaModelToUserEntityMapper.map(aModel);

    return anUser;
  }

  public async findById(id: string): Promise<User | null> {
    const aModel = await prismaClient.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!aModel) {
      return null;
    }

    const anUser = UserPrismaModelToUserEntityMapper.map(aModel);

    return anUser;
  }

  public async create(user: User): Promise<void> {
    const aModel = UserEntityToUserPrismaModelMapper.map(user);
    await prismaClient.user.create({
      data: aModel,
    });
  }
}
