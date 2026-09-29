import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
  IsNumber,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'title must be a string' }) 
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsNumber({}, { message: 'price must be a number' })
  @Min(0, { message: 'price cannot be negative' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'taxes must be a number' })
  @Min(0, { message: 'taxes cannot be negative' })
  taxes?: number;

  @IsOptional()
  @IsNumber({}, { message: 'ads must be a number' })
  @Min(0, { message: 'ads cannot be negative' })
  ads?: number;

  @IsOptional()
  @IsNumber({}, { message: 'discount must be a number' })
  @Min(0, { message: 'discount cannot be negative' })
  discount?: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'category must be a string' }) 
  @IsNotEmpty({ message: 'category is required' })
  category: string;

  @IsOptional()
  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  @Max(100, { message: 'quantity cannot exceed 100' })
  quantity?: number; 
}