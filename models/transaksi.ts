import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { stok_barang } from './stok_barang';
import { jenis_barang } from './jenis_barang';

export interface transaksiAttributes {
  id_transaksi?: number;
  id_barang?: number;
  jumlah?: number;
  tanggal_transaksi?: Date;
  created_at?: Date;
  updated_at?: Date;
  id_jenis_barang?: number;
}

@Table({ tableName: 'transaksi', schema: 'public', timestamps: false })
export class transaksi
  extends Model<transaksiAttributes, transaksiAttributes>
  implements transaksiAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    defaultValue: Sequelize.literal(
      "nextval('transaksi_id_transaksi_seq'::regclass)",
    ),
  })
  @Index({ name: 'transaksi_pk', using: 'btree', unique: true })
  id_transaksi?: number;

  @ForeignKey(() => stok_barang)
  @Column({ allowNull: true, type: DataType.INTEGER })
  id_barang?: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  jumlah?: number;

  @Column({
    allowNull: true,
    type: DataType.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  tanggal_transaksi?: Date;

  @Column({
    allowNull: true,
    type: DataType.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  created_at?: Date;

  @Column({
    allowNull: true,
    type: DataType.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  updated_at?: Date;

  @ForeignKey(() => jenis_barang)
  @Column({ allowNull: true, type: DataType.INTEGER })
  id_jenis_barang?: number;

  @BelongsTo(() => stok_barang)
  stok_barang?: stok_barang;

  @BelongsTo(() => jenis_barang)
  jenis_barang?: jenis_barang;
}
