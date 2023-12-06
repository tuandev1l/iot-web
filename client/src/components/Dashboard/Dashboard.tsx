import './style.css';

type Props = {};

export const Dashboard = ({}: Props) => {
  const logoutHandler = () => {
    document.cookie = 'accessToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setTimeout(() => {
      location.reload();
    }, 500);
  };

  const role = localStorage.getItem('role');

  return (
    <div className='dashboard'>
      <div className='dashboard__header'>
        <div>Smart parking system</div>
        <div className='dashboard__info__wrapper'>
          <div className='dashboard__info'>
            <div>Money: 100000</div>
            <div className='dashboard__info--detail'>
              <img className='dashboard__header--avatar' src='user.png' />
              <div>tuantm</div>
            </div>
          </div>
          <div>
            <button className='auth__btn logout__btn' onClick={logoutHandler}>
              Logout
            </button>
          </div>
        </div>
      </div>
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
              <div className='parking__input'>
                <span>3</span>
              </div>
              <div className='parking__input'>
                <span>2</span>
              </div>
              <div className='parking__input active'>
                <span>1</span>
              </div>
            </div>
            <div className='dashboard__right'>
              <div className='parking__input'>
                <span>4</span>
              </div>
              <div className='parking__input'>
                <span>5</span>
              </div>
              <div className='parking__input'>
                <span>6</span>
              </div>
            </div>
          </div>
          {role === 'user' && (
            <div className='parking__status'>
              <div className='parked'>
                <div>Xe của bạn đang đỗ ở vị trí số 1</div>
                <button className='auth__btn park__btn'>Lấy xe</button>
              </div>
              {/* <div className='unparked'>
            <div>Xe của bạn hiện tại không ở bãi đỗ xe</div>
          </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
