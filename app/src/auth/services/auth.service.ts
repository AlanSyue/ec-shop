import { Injectable } from '@nestjs/common';
import { AuthDto } from '../dtos/auth-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { Repository } from 'typeorm';
import { EmailExistError } from '../errors/email-exist-error';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) { }

    public async signup(authDto: AuthDto) {
        const user = await this.usersRepository.findOneBy({ email: authDto.email })

        if (user) {
            throw new EmailExistError()
        }

        await this.usersRepository.insert({
            email: authDto.email,
            password: authDto.getHashPassword(),
        });
    }
}
