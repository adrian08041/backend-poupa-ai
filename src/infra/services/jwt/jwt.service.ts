export type GenerateAuthTokenWithResfreshTokenOutput = {
  authToken: string;
  userId: string;
};

export type JwtAuthPayload = {
  userId: string;
  tokenVersion: number;
};

export type JwtRefreshPayload = {
  userId: string;
};

export abstract class JwtService {
  public abstract generateAuthToken(userId: string, tokenVersion?: number): string;
  public abstract generateRefreshToken(userId: string): string;
  public abstract generateAuthTokenWithRefreshToken(
    refreshToken: string,
  ): GenerateAuthTokenWithResfreshTokenOutput;
  public abstract verifyAuthToken(token: string): JwtAuthPayload;
}
