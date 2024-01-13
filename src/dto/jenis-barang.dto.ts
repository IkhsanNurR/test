import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createJenisBarangDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  nama: string;
}
