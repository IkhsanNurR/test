import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUppercase } from 'class-validator';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  @ApiProperty()
  members_code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
