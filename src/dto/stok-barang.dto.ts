import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createStokBarangDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  nama: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true })
  stok: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true })
  id_jenis_barang: number;
}

export class updateStokBarangDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  nama: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  stok: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  id_jenis_barang: number;
}
