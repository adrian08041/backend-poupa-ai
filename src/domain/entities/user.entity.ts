import { Utils } from 'src/shared/utils/utils';
import { Entity } from '../shared/entities/entity';
import { UserValidatorFactory } from '../factories/user-validator.factory';
import { userPasswordValidatorFactory } from '../factories/user-password.validator.factory';

export type UserCreateDto = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export type UserWithDto = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
export class User extends Entity {
  private constructor(
    id: string,
    private name: string,
    private email: string,
    private password: string,
    private role: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.validate();
  }

  public static create({
    name,
    email,
    password,
    role = 'USER',
  }: UserCreateDto): User {
    const id = Utils.generateUUID();

    userPasswordValidatorFactory.create().validate(password);

    const hashedPassword = Utils.encryptPassword(password);
    const createdAt = new Date();
    const updatedAt = new Date();

    return new User(
      id,
      name,
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
    role = 'USER',
    createdAt,
    updatedAt,
  }: UserWithDto): User {
    return new User(id, name, email, password, role, createdAt, updatedAt);
  }

  protected validate(): void {
    UserValidatorFactory.create().validate(this);
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole(): string {
    return this.role;
  }

  public comparePassword(aPassword: string): boolean {
    return Utils.comparePassword(aPassword, this.password);
  }
}
