import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserController } from './applications/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})
export class UserModule {}
