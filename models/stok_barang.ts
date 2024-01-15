import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { jenis_barang } from './jenis_barang';
import { transaksi } from './transaksi';

export interface stok_barangAttributes {
  id_barang?: number;
  nama_barang?: string;
  id_jenis_barang?: number;
  stok?: number;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: 'stok_barang', schema: 'public', timestamps: false })
export class stok_barang
  extends Model<stok_barangAttributes, stok_barangAttributes>
  implements stok_barangAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    defaultValue: Sequelize.literal(
      "nextval('stok_barang_id_barang_seq'::regclass)",
    ),
  })
  @Index({ name: 'stok_barang_pk', using: 'btree', unique: true })
  id_barang?: number;

  @Column({ allowNull: true, type: DataType.STRING })
  nama_barang?: string;

  @ForeignKey(() => jenis_barang)
  @Column({ allowNull: true, type: DataType.INTEGER })
  id_jenis_barang?: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  stok?: number;

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

  @BelongsTo(() => jenis_barang)
  jenis_barang?: jenis_barang;

  @HasMany(() => transaksi, { sourceKey: 'id_barang' })
  transaksis?: transaksi[];
}
