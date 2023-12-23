import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { Header } from '../Dashboard/Header';
import { instance } from '../config/axios';
import './style.css';

type Props = {};

export const Profile = ({}: Props) => {
  const isUser = localStorage.getItem('role') === 'user';
  const [money, setMoney] = useState<number>(0);

  const addingMoneyHandler = async () => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC);
    if (!stripe) return;

    const { data } = await instance.post('parking/createStripeSession', {
      amount: money,
    });

    await stripe.redirectToCheckout({
      sessionId: data.id,
    });
  };

  return (
    <div>
      <Header />
      <div>
        {isUser && (
          <div className='adding__money'>
            <div>Select money to add:</div>
            <div className='price__wrapper'>
              {[200000, 500000, 1000000, 5000000].map((price, idx) => (
                <div
                  key={idx}
                  className='price__element'
                  onClick={() => setMoney(price)}
                >
                  <input type='radio' id={`${price}`} name='price' />
                  <label htmlFor={`${price}`}>{price}</label>
                </div>
              ))}
            </div>
            <div className='money__btn__wrapper'>
              <button
                className={`auth__btn money__btn ${!money && 'disabled'}`}
                disabled={!money && true}
                onClick={addingMoneyHandler}
              >
                Adding money for account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
