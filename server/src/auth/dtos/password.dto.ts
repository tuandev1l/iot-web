import { IsNotEmpty } from 'class-validator';

export class PasswordValidate {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  passwordConfirm: string;
}
