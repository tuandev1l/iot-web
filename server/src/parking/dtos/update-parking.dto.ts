import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class UpdateParkingDto {
  @IsNotEmpty()
  isParked: boolean;

  @IsNotEmpty()
  user: User;

  @IsOptional()
  date?: Date;
}
