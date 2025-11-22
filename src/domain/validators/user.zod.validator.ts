import z from 'zod';

import { ZodUtils } from 'src/shared/utils/zod-utils';
import { Validator } from '../shared/validator/validator';
import { ValidatorDomainException } from '../shared/exception/validator-domain.exception';
import { User } from '../entities/user/user.entity';

export class UserZodValidator implements Validator<User> {
  private constructor() {}

  public static create(): UserZodValidator {
    return new UserZodValidator();
  }

  public validate(input: User): void {
    try {
      this.getZodSchema().parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = ZodUtils.formatZodErrors(error);
        throw new ValidatorDomainException(
          `Error while validating User ${input.getId()}: ${message}`,
          `Os dados para a criação do usuário estão inválidos: ${message}`,
          UserZodValidator.name,
        );
      }

      const err = error as Error;
      throw new ValidatorDomainException(
        `Error while validating User ${input.getId()}: ${err.message}`,
        `Os dados para a criação do usuário estão inválidos`,
        UserZodValidator.name,
      );
    }
  }

  private getZodSchema() {
    const zodSchema = z.object({
      id: z.string().uuid({ message: 'ID deve ser um UUID válido' }),
      name: z.string().nullable(),
      email: z.string().email({ message: 'Email deve ser um endereço válido' }),
      password: z.string().min(1, 'Senha não pode estar vazia'),
      whatsappNumber: z
        .string()
        .regex(/^\+[1-9]\d{1,14}$/, {
          message: 'Número de WhatsApp deve estar no formato E.164 (ex: +5511999999999)',
        })
        .nullable(),
      role: z.enum(['USER', 'ADMIN'], {
        message: 'Role deve ser USER ou ADMIN',
      }),
      createdAt: z.date(),
      updatedAt: z.date(),
    });
    return zodSchema;
  }
}
