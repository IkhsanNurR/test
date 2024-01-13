import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JenisBarangService } from './jenis-barang.service';
import { createJenisBarangDto } from 'src/dto/jenis-barang.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryParams } from 'src/dto/request.dto';

@Controller('jenis-barang')
@ApiTags('Jenis-Barang')
export class JenisBarangController {
  constructor(private readonly jenisBarangService: JenisBarangService) {}

  @Post()
  @ApiBody({ type: createJenisBarangDto })
  create(@Body() createJenisBarangDto: createJenisBarangDto) {
    return this.jenisBarangService.create(createJenisBarangDto);
  }

  @Get()
  findAll(@Query() params: QueryParams) {
    return this.jenisBarangService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jenisBarangService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: createJenisBarangDto })
  update(
    @Param('id') id: string,
    @Body() updateJenisBarangDto: createJenisBarangDto,
  ) {
    return this.jenisBarangService.update(+id, updateJenisBarangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jenisBarangService.remove(+id);
  }
}
