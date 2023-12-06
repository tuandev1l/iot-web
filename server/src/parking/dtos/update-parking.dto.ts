import { IsEnum, IsNotEmpty } from 'class-validator';
import { ParkingStatus } from '../../lib/enum/parking-status.enum';

export class UpdateParkingDto {
  @IsNotEmpty()
  @IsEnum(ParkingStatus)
  status: string;
}
