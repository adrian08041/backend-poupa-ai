import { JwtService } from '../jwt.service';
import { JasonWebTokenService } from './jasonwebtoken.jwt.service';

export const jsonWebTokenJwtServiceProvider = {
  provide: JwtService,
  useClass: JasonWebTokenService,
};
