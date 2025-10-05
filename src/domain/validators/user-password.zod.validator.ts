import { z } from 'zod';
import { ZodUtils } from 'src/shared/utils/zod-utils';
import { Validator } from '../shared/validator/validator';
import { DomainException } from '../shared/exception/domain.exception';
import { ValidatorDomainException } from '../shared/exception/validator-domain.exception';

export class UserPasswordZodValidator implements Validator<string> {
  private constructor() {}

  public static create(): UserPasswordZodValidator {
    return new UserPasswordZodValidator();
  }

  public validate(input: string): void {
    try {
      this.getZodSchema().parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = ZodUtils.formatZodErrors(error);
        throw new ValidatorDomainException(
          `Error while validating user password: ${message}`,
          `Senha inválida`,
          UserPasswordZodValidator.name,
        );
      }

      const err = error as Error;

      throw new DomainException(
        `Error while validating user password: ${err.message}`,
        `Houve um erro inesperado ao validaar a senha do usuário`,
        UserPasswordZodValidator.name,
      );
    }
  }

  private getZodSchema() {
    const zodSchema = z.string().min(8);

    return zodSchema;
  }
}
