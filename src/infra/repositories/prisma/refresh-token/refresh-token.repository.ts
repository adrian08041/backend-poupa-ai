import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from 'src/infra/services/database/prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  public generateToken(): string {
    return randomBytes(32).toString('base64url');
  }

  public async create(userId: string, token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);

    await this.prisma.refreshToken.create({
      data: { tokenHash, userId, expiresAt },
    });
  }

  public async validate(token: string): Promise<{ userId: string; id: string } | null> {
    const tokenHash = this.hashToken(token);

    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!record) return null;

    if (record.revokedAt) {
      await this.revokeAllByUserId(record.userId);
      return null;
    }

    if (record.expiresAt < new Date()) return null;

    return { userId: record.userId, id: record.id };
  }

  public async rotate(oldTokenId: string, userId: string): Promise<string> {
    const newToken = this.generateToken();
    const newTokenHash = this.hashToken(newToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);

    await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: oldTokenId },
        data: { revokedAt: new Date(), replacedById: newTokenHash },
      }),
      this.prisma.refreshToken.create({
        data: { tokenHash: newTokenHash, userId, expiresAt },
      }),
    ]);

    return newToken;
  }

  public async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  public async cleanExpired(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
