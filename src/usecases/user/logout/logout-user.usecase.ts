import { Injectable } from '@nestjs/common';

export type LogoutUserInput = {
  userId: string;
};

export type LogoutUserOutput = {
  message: string;
};

@Injectable()
export class LogoutUserUsecase {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async execute(input: LogoutUserInput): Promise<LogoutUserOutput> {
    console.log(`User ${input.userId} logged out`);

    return {
      message: 'Logout realizado com sucesso',
    };
  }
}
