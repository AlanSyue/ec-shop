import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { AuthController } from './applications/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
