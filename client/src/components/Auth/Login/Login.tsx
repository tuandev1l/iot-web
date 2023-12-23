import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { IAuthRes, ILogin } from '../../../interfaces/Auth';
import { instance } from '../../config/axios';
import { useCustomToast } from '../../hook/useCustomToast';
import '../style.css';
import { socket } from '../../../constant';

type Props = {};

const initValue: ILogin = {
  username: '',
  password: '',
};

export const Login = ({}: Props) => {
  const [login, setLogin] = useState<ILogin>(initValue);
  const toast = useCustomToast();

  const formSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data }: { data: IAuthRes } = await instance.post(
      'auth/login',
      login
    );

    socket.emit('connection', data.id);

    toast({ type: 'success', message: 'Login successfully' });
    localStorage.setItem('id', data.id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    setTimeout(() => {
      location.reload();
    }, 2000);
  };

  return (
    <div className='auth__wrapper'>
      <form className='auth__form' onSubmit={formSubmitHandler}>
        <h3 className='auth__title'>Login Here</h3>
        <div className='auth__input__wrapper'>
          <label htmlFor='username'>Username</label>
          <input
            required
            type='text'
            placeholder='Username'
            id='username'
            className='auth__input'
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
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
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
        </div>
        <button className='auth__btn'>Log In</button>
        <Link to={'/signup'}>
          <div className='auth__description'>
            Does not have account ? <span>Signup here</span>
          </div>
        </Link>
      </form>
    </div>
  );
};
