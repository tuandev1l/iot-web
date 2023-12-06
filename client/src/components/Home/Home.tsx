type Props = {};
import { Link } from 'react-router-dom';
import './style.css';

export const Home = ({}: Props) => {
  return (
    <div className='home__wrapper'>
      <div>
        <div className='home__tile'>
          Welcome to{' '}
          <span className='home__subtitle'>Car parking smart system</span>
        </div>
        <Link to={'/login'}>
          <div className='home__button__wrapper'>
            <button className='home__button'>Login here</button>
          </div>
        </Link>
      </div>
    </div>
  );
};
