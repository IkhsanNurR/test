import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUppercase,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  author: string;

  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  @ApiProperty({ required: true })
  books_code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: true })
  stock: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  title: string;
}
