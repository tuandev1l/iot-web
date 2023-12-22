import axios from 'axios';
import { useEffect, useState } from 'react';
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

const cloudName = 'dfa7qyx7z';
const gateURL = 'http://192.168.69.82/open/';
const carURL = 'http://192.168.69.22/parking/';
const plateRecognizationURL = 'http://localhost:8080/get-car-plate';

export const Dashboard = ({}: Props) => {
  const role = localStorage.getItem('role');
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

  const uploadImgHandler = async (files: FileList | null) => {
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
    } catch (error) {
      toast({ type: 'error', message: 'Can not upload image file' });
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await instance.get('parking/slots');
      setParkings(data);
    })();
  }, []);

  const captureHandler = async () => {
    const { data } = await instance.post(plateRecognizationURL, {
      imgUrl,
    });
    setUser(null);
    setImgResUrl(data.img);
    setCarPlate(data.res);
    setImgUrl('');
  };

  // remove when you are in prod
  useEffect(() => {
    socket.emit('connection', localStorage.getItem('id'));
  }, []);

  const checkHandler = async (number: number) => {
    try {
      const { data } = await instance.post('parking/checking', {
        plate: carPlate,
      });
      setUser(data);
      toast({ type: 'success', message: 'Open the gate' });
      // instance.get(`${gateURL}${number}`);
    } catch (error) {}
  };

  const parkingCarHandler = async () => {
    try {
      // await instance.get(`${carURL}${parking}`);
      toast({ type: 'success', message: 'Parking successful' });
      socket.emit('parking', {
        userId: user?.id || localStorage.getItem('id'),
      });
    } catch (error) {}
  };

  useEffect(() => {
    socket.on(
      'parking',
      ({ number, userId }: { number: number; userId: string }) => {
        try {
          const parkingActive = parkings.find((p) => p.number === number)!;
          parkingActive.isParked = !parkingActive.isParked;
          setParkings([...parkings]);
        } catch (error) {
          return;
        }

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
                onChange={(e) => uploadImgHandler(e.target.files)}
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
              <button className='auth__btn' onClick={captureHandler}>
                Capture
              </button>
              <button className='auth__btn' onClick={() => checkHandler(1)}>
                In
              </button>
              <button className='auth__btn' onClick={() => checkHandler(0)}>
                Out
              </button>
              <button
                className={`auth__btn ${!user && 'disabled'}`}
                disabled={!user && true}
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
