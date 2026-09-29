import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'email is not valid' })
  email: string;

  @IsString({ message: 'the password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}