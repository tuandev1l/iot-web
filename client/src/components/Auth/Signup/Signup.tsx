import { ChangeEvent, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { IAuthRes, ISignup } from '../../../interfaces/Auth';
import { instance } from '../../config/axios';
import { useCustomToast } from '../../hook/useCustomToast';
import '../style.css';
import { socket } from '../../../constant';

type Props = {};

export const initValue: ISignup = {
  fullName: '',
  car_plate: '',
  password: '',
  passwordConfirm: '',
  username: '',
  description: '',
};

export const Signup = ({}: Props) => {
  const [signup, setSignup] = useState<ISignup>(initValue);
  const toast = useCustomToast();

  const signupChangeHandler =
    (el: keyof ISignup) => (e: ChangeEvent<HTMLInputElement>) => {
      setSignup({ ...signup, [el]: e.target.value });
    };

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data }: { data: IAuthRes } = await instance.post(
      'auth/signup',
      signup
    );

    socket.emit('connection', data.id);

    toast({ type: 'success', message: 'Signup successfully' });
    localStorage.setItem('id', data.id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    setTimeout(() => {
      location.reload();
    }, 2000);
  };

  return (
    <div className='auth__wrapper'>
      <form className='auth__form' onSubmit={submitFormHandler}>
        <h3 className='auth__title'>Signup here</h3>
        <div className='auth__input__wrapper'>
          <label htmlFor='username'>Username</label>
          <input
            required
            type='text'
            placeholder='Username'
            id='username'
            className='auth__input'
            onChange={signupChangeHandler('username')}
          />
        </div>
        <div className='auth__input__wrapper'>
          <label htmlFor='password'>Password</label>
          <input
            className='auth__input'
            required
            type='password'
            placeholder='Password'
            id='password'
            onChange={signupChangeHandler('password')}
          />
        </div>
        <div className='auth__input__wrapper'>
          <label htmlFor='password_confirm'>Password Confirm</label>
          <input
            className='auth__input'
            required
            type='password'
            placeholder='Password Confirm'
            id='password_confirm'
            onChange={signupChangeHandler('passwordConfirm')}
          />
        </div>
        <div className='auth__input__wrapper'>
          <label htmlFor='fullname'>Fullname</label>
          <input
            className='auth__input'
            required
            type='text'
            placeholder='Fullname'
            id='fullname'
            onChange={signupChangeHandler('fullName')}
          />
        </div>
        <div className='auth__input__wrapper'>
          <label htmlFor='car_plate'>Car plate</label>
          <input
            className='auth__input'
            required
            type='text'
            placeholder='Car plate'
            id='car_plate'
            onChange={signupChangeHandler('car_plate')}
          />
        </div>
        <div className='auth__input__wrapper'>
          <label htmlFor='description'>Description</label>
          <input
            className='auth__input'
            required
            type='text'
            placeholder='Description'
            id='description'
            onChange={signupChangeHandler('description')}
          />
        </div>
        <button className='auth__btn'>Sign up</button>
        <Link to={'/login'}>
          <div className='auth__description'>
            Have an account ? <span>Login here</span>
          </div>
        </Link>
      </form>
    </div>
  );
};
