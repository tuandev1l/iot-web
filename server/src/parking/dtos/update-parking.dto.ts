import { IsNotEmpty } from 'class-validator';

export class UpdateParkingDto {
  @IsNotEmpty()
  isParked: boolean;
}
