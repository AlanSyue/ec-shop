import { Injectable } from '@nestjs/common';
import { AuthDto } from '../dtos/auth-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { EmailExistError } from '../errors/email-exist-error';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  public async signup(authDto: AuthDto) {
    const user = await this.userRepository.findOneBy({ email: authDto.email });
    console.log(user)
    if (user) {
      throw new EmailExistError();
    }

    await this.userRepository.insert({
      email: authDto.email,
      password: authDto.getHashPassword(),
    });
  }

  public async login(user: User): Promise<any> {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async validateUser(authDto: AuthDto): Promise<any> {
    const user = await this.userRepository.findOneBy({ email: authDto.email });
    if (user && await authDto.comparePassword(user.password)) {
      const { ...result } = user;

      return result;
    }

    return null;
  }
}
