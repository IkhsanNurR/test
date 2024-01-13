import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface transaksiAttributes {
  id_transaksi?: number;
  id_barang?: number;
  jumlah?: number;
  tanggal_transaksi?: Date;
  created_at?: Date;
  updated_at?: Date;
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
}
