import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'the name must be a string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  name: string;

  @IsEmail({}, { message: 'email is not valid' })
  email: string;

  @IsString({ message: 'the password must be a string' })
  @MinLength(6, { message: 'weak password' })
  password: string;
}
