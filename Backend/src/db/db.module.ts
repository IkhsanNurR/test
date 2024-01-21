// database/database.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { books, members, transaction } from 'models';

@Module({
  imports: [SequelizeModule.forFeature([transaction, books, members])],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
