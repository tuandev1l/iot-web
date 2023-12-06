import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import { Context, Provider } from './components/store/Provider';
import { useContext, useEffect, useState } from 'react';

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
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
