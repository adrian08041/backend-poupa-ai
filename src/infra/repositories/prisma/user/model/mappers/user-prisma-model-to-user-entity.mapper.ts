import { User, UserRole } from 'src/domain/entities/user/user.entity';
import UserPrismaModel from '../user.prisma.model';

export class UserPrismaModelToUserEntityMapper {
  public static map(user: UserPrismaModel): User {
    // Sanitização do número de WhatsApp para garantir formato E.164
    let whatsappNumber = user.whatsappNumber;
    if (whatsappNumber) {
      // Remove caracteres não numéricos exceto o +
      whatsappNumber = whatsappNumber.replace(/[^\d+]/g, '');
      // Se não começar com +, adiciona
      if (!whatsappNumber.startsWith('+')) {
        whatsappNumber = `+${whatsappNumber}`;
      }
    }

    const anUser = User.with({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      whatsappNumber: whatsappNumber,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    return anUser;
  }
}
