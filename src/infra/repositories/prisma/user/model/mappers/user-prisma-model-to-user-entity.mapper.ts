import { User, UserRole } from 'src/domain/entities/user/user.entity';
import UserPrismaModel from '../user.prisma.model';

export class UserPrismaModelToUserEntityMapper {
  public static map(user: UserPrismaModel): User {
    const anUser = User.with({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      whatsappNumber: user.whatsappNumber,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    return anUser;
  }
}
