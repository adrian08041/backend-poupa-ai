import { User } from '../entities/user.entity';
import { Validator } from '../shared/validator/validator';
import { UserZodValidator } from '../validators/user.zod.validator';

export class UserValidatorFactory {
  public static create(): Validator<User> {
    return UserZodValidator.create();
  }
}
