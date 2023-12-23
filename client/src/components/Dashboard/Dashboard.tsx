import axios, { AxiosError } from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { socket } from '../../constant';
import { IAuthRes } from '../../interfaces/Auth';
import { instance } from '../config/axios';
import { useCustomToast } from '../hook/useCustomToast';
import { Header } from './Header';
import './style.css';

type Props = {};

interface IStateParking {
  number: number;
  isParked: boolean;
  user: IAuthRes | null;
}

const initialState: IStateParking[] = [
  {
    number: 1,
    isParked: false,
    user: null,
  },
  {
    number: 2,
    isParked: false,
    user: null,
  },
  {
    number: 3,
    isParked: false,
    user: null,
  },
];

interface ICurrentlyParking {
  isCurrentlyParking: boolean;
  parkingNumber: number;
}

const cloudName = 'dfa7qyx7z';
// const gateURL = 'http://192.168.69.82/open/';
const gateURL = 'http://192.168.33.246/open/';
const carURL = 'http://192.168.69.22/parking/';
const plateRecognizationURL = 'http://localhost:8080/get-car-plate';

export const Dashboard = ({}: Props) => {
  const role = localStorage.getItem('role');
  const userIdLocalStorage = localStorage.getItem('id');
  const [imgUrl, setImgUrl] = useState<string>('');
  const [imgResUrl, setImgResUrl] = useState<string>('');
  const [carPlate, setCarPlate] = useState<string>('');
  const [parkings, setParkings] = useState<IStateParking[]>(initialState);
  const [parkingStatus, setParkingStatus] = useState<ICurrentlyParking>({
    isCurrentlyParking: false,
    parkingNumber: 0,
  });
  const [user, setUser] = useState<IAuthRes | null>(null);
  const toast = useCustomToast();

  const resetState = () => {
    setCarPlate('');
    setUser(null);
    setImgUrl('');
    setImgResUrl('');
  };

  const getCarHandler = async () => {
    try {
      if (!userIdLocalStorage || !parkingStatus.isCurrentlyParking)
        throw new Error('Can not get the car, please login again');
      // await instance.get(`${carURL}${parking}`);
      await instance.get('parking/paying-money');
      socket.emit('unparking', {
        number: parkingStatus.parkingNumber,
        userId: userIdLocalStorage,
      });
    } catch (error) {
      const message =
        ((error as AxiosError).response?.data as { message: string }).message ||
        'No user matches this car plate';
      toast({ type: 'error', message });
    }
  };

  useEffect(() => {
    socket.on(
      'unparking',
      ({ number, userId }: { number: number; userId: string }) => {
        console.log(number, userId);

        const parkingActive = parkings[number - 1];
        parkingActive.isParked = false;
        setParkings([...parkings]);

        const isCurrentUser = userIdLocalStorage === userId;
        if (isCurrentUser) {
          setParkingStatus({ isCurrentlyParking: false, parkingNumber: 0 });
        }
      }
    );
  }, []);

  useEffect(() => {
    const parkingSlots = parkings.filter(
      (p) => p.user?.id === userIdLocalStorage
    );
    // console.log(parkingSlots);
    if (parkingSlots.length) {
      const parkingSlot = parkingSlots[0];
      setParkingStatus({
        isCurrentlyParking: true,
        parkingNumber: parkingSlot.number,
      });
    }
  }, [parkings]);

  const uploadImgHandler = async (
    e: ChangeEvent<HTMLInputElement>,
    files: FileList | null
  ) => {
    try {
      if (!files) return;
      const img = files[0];
      const formData = new FormData();
      formData.append('file', img);
      formData.append('upload_preset', 'ml_default');
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData
      );
      setImgUrl(data.secure_url);
      e.target.value = '';
    } catch (error) {
      toast({ type: 'error', message: 'Can not upload image file' });
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await instance.get('parking/slots');
      // console.log(data);
      setParkings(data);
    })();
  }, []);

  const captureHandler = async () => {
    const { data } = await instance.post(plateRecognizationURL, {
      imgUrl,
    });
    console.log(data);
    setUser(null);
    setImgResUrl(data.url);
    setCarPlate(data.text);
  };

  // remove when you are in prod
  useEffect(() => {
    socket.emit('connection', { userId: userIdLocalStorage });
  }, []);

  const checkHandler = async (isIn: boolean) => {
    try {
      const { data } = await instance.post('parking/checking', {
        plate: carPlate,
        isIn,
      });
      if (isIn) {
        setUser(data.user);
      } else {
        resetState();
      }
      toast({ type: 'success', message: 'Open the gate' });
      instance.get(`${gateURL}${isIn ? 1 : 0}`);
    } catch (error: unknown) {
      const message =
        ((error as AxiosError).response?.data as { message: string }).message ||
        'No user matches this car plate';
      toast({ type: 'error', message });
    }
  };

  const parkingCarHandler = async () => {
    try {
      if (!user) return;
      // await instance.get(`${carURL}${parking}`);
      toast({ type: 'success', message: 'Parking successful' });
      socket.emit('parking', {
        userId: user.id,
      });
      resetState();
    } catch (error) {
      toast({ type: 'error', message: 'Can not park the car' });
    }
  };

  useEffect(() => {
    socket.on(
      'parking',
      ({ number, userId }: { number: number; userId: string }) => {
        console.log(number, userId);

        const parkingActive = parkings[number - 1];
        parkingActive.isParked = true;
        setParkings([...parkings]);

        const isCurrentUser = userIdLocalStorage === userId;
        if (isCurrentUser) {
          setParkingStatus({
            isCurrentlyParking: true,
            parkingNumber: number,
          });
        }
      }
    );
  }, []);

  return (
    <div className='dashboard'>
      <Header />
      <div className='dashboard__price'>Price: 30000/day</div>
      <div className='dashboard__controller'>
        {role === 'admin' && (
          <div className='dashboard__plate__wrapper'>
            <div className='car__plate'>
              <div>Biển số xe:</div>
              <img
                className='car__plate__img'
                src={`${
                  imgUrl
                    ? imgUrl
                    : 'https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg'
                }`}
              />
              <img
                className='car__plate__img'
                src={`${
                  imgResUrl
                    ? imgResUrl
                    : 'https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg'
                }`}
              />
            </div>
            <div className='dashboard__upload__img'>
              <div>Upload img:</div>
              <input
                type='file'
                onChange={(e) => uploadImgHandler(e, e.target.files)}
              />
            </div>
            <div className='car__plate__detection'>
              <div>Nhận diện: </div>
              <input
                className='dashboard__plate__input'
                onChange={(e) => setCarPlate(e.target.value)}
                value={carPlate}
              />
            </div>
            <div className='car__plate__btn'>
              <button
                className={`auth__btn ${!imgUrl && 'disabled'}`}
                onClick={captureHandler}
                disabled={!imgUrl}
              >
                Capture
              </button>
              <button
                onClick={() => checkHandler(true)}
                className={`auth__btn ${!carPlate && 'disabled'}`}
                disabled={!carPlate}
              >
                In
              </button>
              <button
                className={`auth__btn ${!carPlate && 'disabled'}`}
                disabled={!carPlate}
                onClick={() => checkHandler(false)}
              >
                Out
              </button>
              <button
                className={`auth__btn ${!user && 'disabled'}`}
                disabled={!user}
                onClick={parkingCarHandler}
              >
                Parking
              </button>
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
                >
                  <span>{number}</span>
                </div>
              ))}
            </div>
          </div>
          {role === 'user' && (
            <div className='parking__status'>
              {parkingStatus.isCurrentlyParking ? (
                <div className='parked'>
                  <div>{`Xe của bạn đang đỗ ở vị trí số ${parkingStatus.parkingNumber}`}</div>
                  <button
                    className='auth__btn park__btn'
                    onClick={getCarHandler}
                  >
                    Lấy xe
                  </button>
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
