import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { stok_barang } from './stok_barang';
import { transaksi } from './transaksi';

export interface jenis_barangAttributes {
  id_jenis_barang?: number;
  nama_jenis_barang?: string;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: 'jenis_barang', schema: 'public', timestamps: false })
export class jenis_barang
  extends Model<jenis_barangAttributes, jenis_barangAttributes>
  implements jenis_barangAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    defaultValue: Sequelize.literal(
      "nextval('jenis_barang_id_jenis_barang_seq'::regclass)",
    ),
  })
  @Index({ name: 'jenis_barang_pk', using: 'btree', unique: true })
  id_jenis_barang?: number;

  @Column({ allowNull: true, type: DataType.STRING })
  nama_jenis_barang?: string;

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

  @HasMany(() => stok_barang, { sourceKey: 'id_jenis_barang' })
  stok_barangs?: stok_barang[];

  @HasMany(() => transaksi, { sourceKey: 'id_jenis_barang' })
  transaksis?: transaksi[];
}
