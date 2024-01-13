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
import { StokBarangService } from './stok-barang.service';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { createStokBarangDto } from 'src/dto/stok-barang.dto';
import { QueryParams } from 'src/dto/request.dto';

@Controller('stok-barang')
@ApiTags('Stok-Barang')
export class StokBarangController {
  constructor(private readonly stokBarangService: StokBarangService) {}

  @Post()
  @ApiBody({ type: createStokBarangDto })
  create(@Body() createStokBarangDto) {
    return this.stokBarangService.create(createStokBarangDto);
  }

  @Get()
  @ApiQuery({ type: QueryParams })
  findAll(@Query() params: QueryParams) {
    return this.stokBarangService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stokBarangService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: createStokBarangDto })
  update(@Param('id') id: string, @Body() updateStokBarangDto) {
    return this.stokBarangService.update(+id, updateStokBarangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stokBarangService.remove(+id);
  }
}
