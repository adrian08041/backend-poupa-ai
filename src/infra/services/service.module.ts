import { Module } from '@nestjs/common';
import { JasonWebTokenService } from './jwt/jasonwebtoken/jsonwebtoken.jwt.service';

import { JwtService } from './jwt/jwt.service';

@Module({
  providers: [
    {
      provide: JwtService,
      useClass: JasonWebTokenService,
    },
  ],
  exports: [JwtService],
})
export class ServiceModule {}
