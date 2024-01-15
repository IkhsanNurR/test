import { Module } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { jenis_barang, stok_barang, transaksi } from 'models';

@Module({
  imports: [SequelizeModule.forFeature([stok_barang, transaksi, jenis_barang])],
  controllers: [TransaksiController],
  providers: [TransaksiService],
})
export class TransaksiModule {}
