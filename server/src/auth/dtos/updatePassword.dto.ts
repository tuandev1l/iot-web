import { IsNotEmpty } from 'class-validator';
import { PasswordValidate } from './password.dto';

export class UpdatePasswordDto extends PasswordValidate {
  @IsNotEmpty()
  currentPassword: string;
}
