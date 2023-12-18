import { loadStripe } from '@stripe/stripe-js';
import { Header } from '../Dashboard/Header';
import { instance } from '../config/axios';
import './style.css';

type Props = {};

export const Profile = ({}: Props) => {
  const isUser = localStorage.getItem('role') === 'user';

  const addingMoneyHandler = async () => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC);
    if (!stripe) return;

    const { data } = await instance.post('parking/createStripeSession', {
      amount: 500000,
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
          <button onClick={addingMoneyHandler}>Adding money for account</button>
        )}
      </div>
    </div>
  );
};
