import { IsNotEmpty } from 'class-validator';
import { PasswordValidate } from './password.dto';

export class SignupCredentials extends PasswordValidate {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  car_plate: string;

  @IsNotEmpty()
  description: string;
}
