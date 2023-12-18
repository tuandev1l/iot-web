import { IsNumber, IsOptional } from 'class-validator';

export class AddingMoney {
  @IsOptional()
  id: string;

  @IsNumber()
  amount: number;
}
