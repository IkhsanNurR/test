import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { JenisBarangModule } from './jenis-barang/jenis-barang.module';
import { StokBarangModule } from './stok-barang/stok-barang.module';
import { TransaksiModule } from './transaksi/transaksi.module';
import 'dotenv/config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [],
      autoLoadModels: true,
    }),
    JenisBarangModule,
    StokBarangModule,
    TransaksiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
