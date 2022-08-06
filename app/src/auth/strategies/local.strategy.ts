import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth-dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const authDto = new AuthDto();
    authDto.email = email;
    authDto.password = password;

    const user = await this.authService.validateUser(authDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
