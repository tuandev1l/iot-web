import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { instance } from '../config/axios';

type Props = {};

export const Header = ({}: Props) => {
  const [money, setMoney] = useState<number>(0);
  const logoutHandler = () => {
    document.cookie = 'accessToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setTimeout(() => {
      location.reload();
    }, 500);
  };

  useEffect(() => {
    (async () => {
      const { data } = await instance.get('users/money');
      setMoney(data);
    })();
  }, []);

  return (
    <div className='dashboard__header'>
      <Link to={'/'}>
        <div>Smart parking system</div>
      </Link>
      <div className='dashboard__info__wrapper'>
        <div className='dashboard__info'>
          <div>Money: {money}</div>
          <Link to={'/profile'}>
            <div className='dashboard__info--detail'>
              <img className='dashboard__header--avatar' src='user.png' />
              <div>{localStorage.getItem('username')}</div>
            </div>
          </Link>
        </div>
        <div>
          <button className='auth__btn logout__btn' onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
