import { Validator } from '../shared/validator/validator';
import { UserPasswordZodValidator } from '../validators/user-password.zod.validator';

export class userPasswordValidatorFactory {
  public static create(): Validator<string> {
    return UserPasswordZodValidator.create();
  }
}
