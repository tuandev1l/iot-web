import { IsNotEmpty } from 'class-validator';

export class CreateParkingDto {
  @IsNotEmpty()
  number: number;
}
