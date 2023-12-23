import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Parking {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  number: number;

  @OneToOne((_) => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @Column()
  isParked: boolean;

  @Column({ type: 'datetime', nullable: true })
  date: Date;
}
