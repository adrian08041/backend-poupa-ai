import { User } from 'src/domain/entities/user/user.entity';
import UserPrismaModel from '../user.prisma.model';

export class UserEntityToUserPrismaModelMapper {
  public static map(user: User): UserPrismaModel {
    const aModel: UserPrismaModel = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
      email: user.getEmail(),
      password: user.getPassword(),
      whatsappNumber: user.getWhatsappNumber(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };

    return aModel;
  }
}
