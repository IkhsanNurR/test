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

export interface membersAttributes {
  members_code: string;
  name?: string;
  created_at?: Date;
  updated_at?: Date;
  penalized?: boolean;
  penalized_until?: Date;
}

@Table({ tableName: 'members', schema: 'public', timestamps: false })
export class members
  extends Model<membersAttributes, membersAttributes>
  implements membersAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING })
  @Index({ name: 'members_pk', using: 'btree', unique: true })
  members_code!: string;

  @Column({ allowNull: true, type: DataType.STRING })
  name?: string;

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

  @Column({
    allowNull: true,
    type: DataType.BOOLEAN,
    defaultValue: Sequelize.literal('false'),
  })
  penalized?: boolean;

  @Column({ allowNull: true, type: DataType.DATE })
  penalized_until?: Date;

  @HasMany(() => transaction, { sourceKey: 'members_code' })
  transactions?: transaction[];
}
