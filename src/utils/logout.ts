import { useCallback } from 'react';
import { useLogin } from '../context/loginContext';
import { deleteLoginToken } from './loginToken';

export const useLogout = () => {
  const { setLogin } = useLogin();

  const onLogout = useCallback(() => {
    deleteLoginToken();
    setLogin(undefined);
  }, [setLogin]);
  return onLogout;
};
