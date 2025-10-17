import { UserPasswordValidatorFactory } from 'src/domain/factories/user-password.validator.factory';
import { UserValidatorFactory } from 'src/domain/factories/user-validator.factory';
import { Entity } from 'src/domain/shared/entities/entity';
import { Utils } from 'src/shared/utils/utils';
import { UserRole } from './user-role.enum';

export { UserRole };

export type UserCreateDto = {
  name?: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type UserWithDto = {
  id: string;
  name: string | null;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export class User extends Entity {
  private constructor(
    id: string,
    private name: string | null,
    private email: string,
    private password: string,
    private role: UserRole,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.validate();
  }

  public static create({
    name = undefined,
    email,
    password,
    role = UserRole.USER,
  }: UserCreateDto): User {
    const id = Utils.generateUUID();

    UserPasswordValidatorFactory.create().validate(password);

    const hashedPassword = Utils.encryptPassword(password);
    const createdAt = new Date();
    const updatedAt = new Date();

    return new User(
      id,
      name ?? null,
      email,
      hashedPassword,
      role,
      createdAt,
      updatedAt,
    );
  }

  public static with({
    id,
    name,
    email,
    password,
    role,
    createdAt,
    updatedAt,
  }: UserWithDto): User {
    return new User(id, name, email, password, role, createdAt, updatedAt);
  }

  protected validate(): void {
    UserValidatorFactory.create().validate(this);
  }

  public getName(): string | null {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public comparePassword(aPassword: string): boolean {
    return Utils.comparePassword(aPassword, this.password);
  }
}
