import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Staff } from '../staff/staff.model';

@Table({
  tableName: 'Ticket',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Ticket extends Model<Ticket> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Staff)
  @Column
  assignedStaffId: number;

  @BelongsTo(() => Staff)
  assignedStaff: Staff;

  @Column(
    DataType.ENUM(
      'open',
      'assigned',
      'scheduled',
      'inProgress',
      'resolved',
      'closed',
    ),
  )
  status: string;

  @AllowNull(false)
  @Column(DataType.ENUM('low', 'medium', 'high', 'critical'))
  priority: string;

  @AllowNull(false)
  @Column
  category: string;

  @AllowNull(false)
  @Column
  title: string;

  @AllowNull(false)
  @Column
  description: string;

  @Column(DataType.DATE)
  scheduled_date: Date;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  @Column(DataType.DATE)
  deletedAt: Date | null;

  @Column(DataType.INTEGER)
  createdBy: number | null;

  @Column(DataType.INTEGER)
  updatedBy: number | null;

  @Column(DataType.INTEGER)
  deletedBy: number | null;
}
