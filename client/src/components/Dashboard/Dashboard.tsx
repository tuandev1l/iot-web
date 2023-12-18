import { useEffect, useState } from 'react';
import { socket } from '../../constant';
import { Header } from './Header';
import './style.css';

type Props = {};

interface IStateParking {
  number: number;
  isParked: boolean;
}

const initialState: IStateParking[] = [
  {
    number: 3,
    isParked: false,
  },
  {
    number: 2,
    isParked: false,
  },
  {
    number: 1,
    isParked: false,
  },
];

interface ICurrentlyParking {
  isCurrentlyParking: boolean;
  parkingNumber: number;
}

export const Dashboard = ({}: Props) => {
  const role = localStorage.getItem('role');
  const [parkings, setParkings] = useState<IStateParking[]>(initialState);
  const [parkingStatus, setParkingStatus] = useState<ICurrentlyParking>({
    isCurrentlyParking: false,
    parkingNumber: 0,
  });

  useEffect(() => {
    console.log(parkingStatus);
  }, [parkingStatus]);

  useEffect(() => {
    socket.emit('connection', localStorage.getItem('id'));
  }, []);

  const parkingHandler = (number: number) => {
    socket.emit('parking', { number, userId: localStorage.getItem('id') });
  };

  useEffect(() => {
    socket.on(
      'parking',
      ({ number, userId }: { number: number; userId: string }) => {
        const parkingActive = parkings.find((p) => p.number === number);
        if (!parkingActive) return;
        parkingActive.isParked = !parkingActive.isParked;
        setParkings([...parkings]);

        const isCurrentUser = localStorage.getItem('id') === userId;
        if (isCurrentUser) {
          setParkingStatus((prev) => {
            const newState = {
              isCurrentlyParking: !prev.isCurrentlyParking,
              parkingNumber: prev.isCurrentlyParking ? 0 : number,
            };
            return newState;
          });
        }
      }
    );
  }, []);

  return (
    <div className='dashboard'>
      <Header />
      <div className='dashboard__controller'>
        {role === 'admin' && (
          <div className='dashboard__plate__wrapper'>
            <div className='car__plate'>
              <div>Biển số xe:</div>
              <img
                className='car__plate__img'
                src='https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg'
              />
            </div>
            <div className='car__plate__detection'>
              <div>Nhận diện: </div>
              <input className='dashboard__plate__input' />
            </div>
            <div className='car__plate__btn'>
              <button className='auth__btn'>Capture</button>
              <button className='auth__btn'>Check</button>
            </div>
          </div>
        )}
        <div className='dashboard__wrapper'>
          <div className='dashboard__parking'>
            <div className='dashboard__left'>
              {parkings.map(({ number, isParked }) => (
                <div
                  key={number}
                  className={`parking__input ${isParked && 'active'}`}
                  onClick={() => parkingHandler(number)}
                >
                  <span>{number}</span>
                </div>
              ))}
            </div>
            {/* <div className='parking__input' onClick={() => parkingHandler(3)}>
              <span>3</span>
            </div>
            <div className='parking__input' onClick={() => parkingHandler(3)}>
              <span>2</span>
            </div>
            <div className='parking__input' onClick={() => parkingHandler(3)}>
              <span>1</span>
            </div> */}
            {/* <div className='dashboard__right'>
              <div className='parking__input'>
                <span>4</span>
              </div>
              <div className='parking__input'>
                <span>5</span>
              </div>
              <div className='parking__input'>
                <span>6</span>
              </div>
            </div> */}
          </div>
          {role === 'user' && (
            <div className='parking__status'>
              {parkingStatus.isCurrentlyParking ? (
                <div className='parked'>
                  <div>{`Xe của bạn đang đỗ ở vị trí số ${parkingStatus.parkingNumber}`}</div>
                  <button className='auth__btn park__btn'>Lấy xe</button>
                </div>
              ) : (
                <div className='unparked'>
                  <div>Xe của bạn hiện tại không ở bãi đỗ xe</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
