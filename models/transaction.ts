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
import { books } from './books';
import { members } from './members';

export interface transactionAttributes {
  id?: number;
  books_code?: string;
  members_code?: string;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: 'transaction', schema: 'public', timestamps: false })
export class transaction
  extends Model<transactionAttributes, transactionAttributes>
  implements transactionAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    defaultValue: Sequelize.literal("nextval('transaction_id_seq'::regclass)"),
  })
  @Index({ name: 'transaction_pk', using: 'btree', unique: true })
  id?: number;

  @ForeignKey(() => books)
  @Column({ allowNull: true, type: DataType.STRING })
  books_code?: string;

  @ForeignKey(() => members)
  @Column({ allowNull: true, type: DataType.STRING })
  members_code?: string;

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

  @BelongsTo(() => books)
  book?: books;

  @BelongsTo(() => members)
  member?: members;
}
