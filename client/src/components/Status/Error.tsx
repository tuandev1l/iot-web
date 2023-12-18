import Status from '.';
import { EStatus } from './Status';

type Props = {};

export const Error = ({}: Props) => {
  return <Status status={EStatus.ERROR} />;
};
