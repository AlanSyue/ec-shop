import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
