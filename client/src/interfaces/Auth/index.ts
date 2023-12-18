export interface ISignup extends Omit<IAuthRes, 'role'> {
  password: string;
  passwordConfirm: string;
}

export interface IAuthRes {
  username: string;
  fullName: string;
  car_plate: string;
  description: string;
  role: string;
  money: number;
}

export type ILogin = Pick<IAuthRes, 'username'> & Pick<ISignup, 'password'>;
