import { Injectable } from '@nestjs/common';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { UserNotFoundUsecaseException } from 'src/usecases/exceptions/user-not-found.usecase.exception';
import { UseCase } from 'src/usecases/usecase';

export type FindUserInput = {
  id: string;
};

export type FindUserOutput = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class FindUserUseCase implements UseCase<FindUserInput, FindUserOutput> {
  public constructor(private readonly userGateway: UserGateway) {}

  public async execute({ id }: FindUserInput): Promise<FindUserOutput> {
    const anUser = await this.userGateway.findById(id);

    if (!anUser) {
      throw new UserNotFoundUsecaseException(
        `User not found while finding user with id ${id} in ${FindUserUseCase.name}.`,
        `Usuario não encontrado.`,
        FindUserUseCase.name,
      );
    }

    const output: FindUserOutput = {
      id: anUser.getId(),
      name: anUser.getName(),
      email: anUser.getEmail(),
      createdAt: anUser.getCreatedAt(),
      updatedAt: anUser.getUpdatedAt(),
    };
    return output;
  }
}
