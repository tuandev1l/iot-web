import { Link } from 'react-router-dom';
import { Header } from '../Dashboard/Header';
import './style.css';

export enum EStatus {
  SUCCESS,
  ERROR,
}

type Props = {
  status: EStatus;
};

export const Status = ({ status }: Props) => {
  const isSuccess = status === EStatus.SUCCESS;

  return (
    <div className='status__wrapper'>
      <Header />
      <div className='status__wrapper'>
        <div className='status__message'>
          <div className='status__img__wrapper'>
            {isSuccess ? (
              <img
                className='status__img'
                src='https://cdn-icons-png.flaticon.com/512/5206/5206272.png'
              />
            ) : (
              <img
                className='status__img'
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1024px-Flat_cross_icon.svg.png'
              />
            )}
          </div>
          <div className='payment__status'>{`Payment ${
            isSuccess ? 'Successful' : 'Error'
          }`}</div>
          <div className='payment__description'>
            {isSuccess
              ? 'Thank you for your payment'
              : 'Please try again later'}
          </div>
          <Link to='/dashboard'>
            <button
              className={`auth__btn ${isSuccess ? 'success' : 'error'}__btn`}
            >
              Back to dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
