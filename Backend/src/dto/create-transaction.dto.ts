import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUppercase } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  @ApiProperty()
  members_code: string;

  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  @ApiProperty()
  books_code: string;
}
