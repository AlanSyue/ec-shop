import { EmailExistError } from '../errors/email-exist-error';
import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthDto } from '../dtos/auth-dto';
import { Response } from 'express'
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private service: AuthService
    ) { }

    @Post('signup')
    @HttpCode(HttpStatus.OK)
    async signup(@Res({ passthrough: true }) res: Response, @Body() authDto: AuthDto) {
        try {
            return await this.service.signup(authDto)
        } catch (error) {
            if (error instanceof EmailExistError) {
                res.status(EmailExistError.STATUS_CODE)
                return {
                    error_code: EmailExistError.ERROR_CODE,
                    error_message: EmailExistError.ERROR_MESSAGE
                }
            }       
        }
    }
}
