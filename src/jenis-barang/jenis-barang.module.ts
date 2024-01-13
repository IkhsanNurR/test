import { Module } from '@nestjs/common';
import { JenisBarangService } from './jenis-barang.service';
import { JenisBarangController } from './jenis-barang.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { jenis_barang } from 'models';

@Module({
  imports: [SequelizeModule.forFeature([jenis_barang])],
  controllers: [JenisBarangController],
  providers: [JenisBarangService],
})
export class JenisBarangModule {}
