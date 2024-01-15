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
import { TransaksiService } from './transaksi.service';
import { QueryParams } from 'src/dto/request.dto';
import { ApiQuery } from '@nestjs/swagger';
import {
  createTransaksiDto,
  deleteTransaksi,
  updateTransaksiDto,
} from 'src/dto/transaksi.dto';

@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Post()
  create(@Body() createTransaksiDto: createTransaksiDto) {
    return this.transaksiService.create(createTransaksiDto);
  }

  @Get()
  @ApiQuery({ type: QueryParams })
  findAll(@Query() params: QueryParams) {
    return this.transaksiService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transaksiService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransaksiDto: updateTransaksiDto,
  ) {
    return this.transaksiService.update(+id, updateTransaksiDto);
  }

  @Delete()
  remove(@Query() params: deleteTransaksi) {
    return this.transaksiService.remove(params);
  }
}
