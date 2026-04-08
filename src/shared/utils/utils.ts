import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', SALT_ROUNDS);

export class Utils {
  public static generateUUID(): string {
    return crypto.randomUUID();
  }

  public static getDummyHash(): string {
    return DUMMY_HASH;
  }

  public static async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  public static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
