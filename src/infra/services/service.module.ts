import { Module } from '@nestjs/common';
import { JasonWebTokenService } from './jwt/jasonwebtoken/jsonwebtoken.jwt.service';

@Module({
  providers: [JasonWebTokenService],
  exports: [JasonWebTokenService],
})
export class ServiceModule {}
