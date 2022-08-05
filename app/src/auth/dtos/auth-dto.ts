import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator'

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string
}
