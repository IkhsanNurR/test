import { Module } from '@nestjs/common';
import { StokBarangService } from './stok-barang.service';
import { StokBarangController } from './stok-barang.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { stok_barang } from 'models';

@Module({
  imports: [SequelizeModule.forFeature([stok_barang])],
  controllers: [StokBarangController],
  providers: [StokBarangService],
})
export class StokBarangModule {}
