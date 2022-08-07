import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { hashSync, compare } from 'bcrypt';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  public getHashPassword(): string {
    return hashSync(this.password, 10);
  }

  public async comparePassword(hashPassword: string): Promise<boolean> {
    return await compare(this.password, hashPassword);
  }
}
