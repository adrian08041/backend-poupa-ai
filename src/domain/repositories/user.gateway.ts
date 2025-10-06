import { User } from '../entities/user.entity';

export interface UserGateway {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<void>;
}
