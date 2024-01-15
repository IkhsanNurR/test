import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc',
}

export class deleteTransaksi {
  @Type(() => String)
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  ids?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @ApiProperty({ required: false })
  stok?: boolean = false;
}

export class createTransaksiDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true })
  jumlah: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true })
  id_barang: number;
}

export class updateTransaksiDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true })
  jumlah: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true })
  id_barang: number;
}
