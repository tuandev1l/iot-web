import { TypeOptions, toast } from 'react-toastify';

type Props = { type: TypeOptions; message: string };

export const useCustomToast =
  () =>
  ({ type, message }: Props) => {
    let duration = 1000;

    if (type === 'error') {
      duration = 3000;
    }

    return toast(message, {
      type,
      autoClose: duration,
    });
  };
