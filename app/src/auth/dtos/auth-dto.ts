import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator'
import { hashSync } from 'bcrypt';

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string

    public getHashPassword() {
        return hashSync(this.password, 10)
    }
}
