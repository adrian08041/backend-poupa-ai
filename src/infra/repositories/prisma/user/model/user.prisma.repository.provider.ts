import { UserGateway } from 'src/domain/repositories/user.gateway';
import { UserPrismaRepository } from './user.prisma.repository';

export const UserPrismaRepositoryProvider = {
  provide: UserGateway,
  useClass: UserPrismaRepository,
};
