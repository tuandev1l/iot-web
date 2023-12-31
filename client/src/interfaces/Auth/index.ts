export interface ISignup extends Omit<IAuthRes, 'role' | 'money' | 'id'> {
  password: string;
  passwordConfirm: string;
}

export interface IAuthRes {
  id: string;
  username: string;
  fullName: string;
  car_plate: string;
  description: string;
  role: string;
  money: number;
}

export type ILogin = Pick<IAuthRes, 'username'> & Pick<ISignup, 'password'>;
