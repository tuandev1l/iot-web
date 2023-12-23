import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Parking } from '../../parking/entities/parking.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: false })
  car_plate: string;

  @Column({ default: 0 })
  money: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'user' })
  role: string;

  @OneToOne((_) => Parking, (parking) => parking.id)
  @JoinColumn()
  parking: Parking;
}
