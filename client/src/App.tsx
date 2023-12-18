import { useContext, useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import { Error } from './components/Status/Error';
import { Success } from './components/Status/Success';
import { Context, Provider } from './components/store/Provider';
import Profile from './components/Profile';

function App() {
  const context = useContext(Context);
  const [isLogin, setIsLogin] = useState<boolean>(context.isLogin);

  useEffect(() => {
    setIsLogin(context.isLogin);
  }, [context.isLogin]);

  return (
    <Provider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/login'
            element={isLogin ? <Navigate to={'/dashboard'} /> : <Login />}
          />
          <Route
            path='/signup'
            element={isLogin ? <Navigate to={'/dashboard'} /> : <Signup />}
          />
          <Route
            path='/dashboard'
            element={isLogin ? <Dashboard /> : <Navigate to={'/login'} />}
          />
          <Route
            path='/success'
            element={isLogin ? <Success /> : <Navigate to={'/login'} />}
          />
          <Route
            path='/error'
            element={isLogin ? <Error /> : <Navigate to={'/login'} />}
          />
          <Route
            path='/profile'
            element={isLogin ? <Profile /> : <Navigate to={'/login'} />}
          />
          {/* <Route
            path='*'
            element={isLogin ? <Error /> : <Navigate to={'/login'} />}
          /> */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
