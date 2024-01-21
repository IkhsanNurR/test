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
import { transaction } from './transaction';

export interface booksAttributes {
  books_code: string;
  title?: string;
  author?: string;
  stock?: number;
  updated_at?: Date;
  created_at?: Date;
}

@Table({ tableName: 'books', schema: 'public', timestamps: false })
export class books
  extends Model<booksAttributes, booksAttributes>
  implements booksAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING })
  @Index({ name: 'books_pk', using: 'btree', unique: true })
  books_code!: string;

  @Column({ allowNull: true, type: DataType.STRING })
  title?: string;

  @Column({ allowNull: true, type: DataType.STRING })
  author?: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  stock?: number;

  @Column({
    allowNull: true,
    type: DataType.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  updated_at?: Date;

  @Column({
    allowNull: true,
    type: DataType.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  created_at?: Date;

  @HasMany(() => transaction, { sourceKey: 'books_code' })
  transactions?: transaction[];
}
