import { IsNotEmpty } from 'class-validator';
export class AuthCredentials {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
