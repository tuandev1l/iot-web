import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Parking {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  number: number;

  @OneToOne(() => User)
  user: User;

  @Column()
  isParked: boolean;
}
