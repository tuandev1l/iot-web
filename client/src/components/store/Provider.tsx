import React, { useReducer, createContext, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

const initState = document.cookie.includes('accessToken');

export enum AuthStatus {
  LOGIN,
  LOGOUT,
}

const reducer = (_: any, action: AuthStatus) => {
  switch (action) {
    case AuthStatus.LOGIN:
      return true;
    case AuthStatus.LOGOUT:
      return false;
    default:
      return false;
  }
};

export type IValue = {
  isLogin: boolean;
  dispatch: React.Dispatch<AuthStatus>;
};

export const Context = createContext<IValue>({
  isLogin: initState,
  dispatch: (): void => {},
});

export const Provider = ({ children }: Props) => {
  const [isLogin, dispatch] = useReducer(reducer, initState);

  return (
    <Context.Provider value={{ isLogin, dispatch }}>
      {children}
    </Context.Provider>
  );
};
