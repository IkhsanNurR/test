import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc',
}

export enum respon {
  SUDAH_LUNAS = 'Sudah Lunas',
  BELUM_LUNAS_AKAN_BAYAR = 'Belum Lunas - Akan Bayar',
  BATAL = 'Batal',
}

export class QueryParams {
  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  keyword?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  tanggal_datang_awal?: Date;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(10)
  @IsOptional()
  @ApiProperty({ required: false })
  per_page?: number = 10;

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiProperty({ required: false })
  sort?: SortOrder = SortOrder.DESC;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  order_by?: string = 'created_at';

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @ApiProperty({ required: false })
  is_all_data?: boolean = false;

  constructor(
    keyword = '',
    page = 1,
    sort = SortOrder.DESC,
    order_by = 'created_at',
  ) {
    this.keyword = keyword;
    this.page = page;
    this.sort = sort;
    this.order_by = order_by;
  }
}
