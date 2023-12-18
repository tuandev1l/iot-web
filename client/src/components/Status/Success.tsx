import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Status from '.';
import { instance } from '../config/axios';
import { EStatus } from './Status';
import './style.css';

type Props = {};

export const Success = ({}: Props) => {
  const [param] = useSearchParams();

  console.log(param.get('id'));
  console.log(param.get('amount'));

  useEffect(() => {
    (async () => {
      const { data } = await instance.post('parking/addingMoney', {
        id: param.get('id'),
        amount: +param.get('amount')!,
      });
      localStorage.setItem('money', data.money);
    })();
  }, []);

  return <Status status={EStatus.SUCCESS} />;
};
