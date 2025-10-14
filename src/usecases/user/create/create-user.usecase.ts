import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { EmailAlreadyExistsUsecaseException } from 'src/usecases/exceptions/email-already-exists.usecase.exception';
import { UseCase } from 'src/usecases/usecase';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserOutput = {
  id: string;
};
@Injectable()
export class CreateUserUseCase
  implements UseCase<CreateUserInput, CreateUserOutput>
{
  public constructor(private readonly userGateway: UserGateway) {}

  public async execute({
    name,
    email,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    const existentUser = await this.userGateway.findByEmail(email);

    if (existentUser) {
      throw new EmailAlreadyExistsUsecaseException(
        `Email already exists while creating user with email ${email} in ${CreateUserUseCase.name}.`,
        `O e-mail já está em uso.`,
        CreateUserUseCase.name,
      );
    }
    const anUser = User.create({ name, email, password });

    await this.userGateway.create(anUser);

    const output: CreateUserOutput = {
      id: anUser.getId(),
    };

    return output;
  }
}
