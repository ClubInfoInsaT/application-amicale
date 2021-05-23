import { useCallback } from 'react';
import { useLogin } from '../context/loginContext';

export const useLogout = () => {
  const { setLogin } = useLogin();

  const onLogout = useCallback(() => {
    setLogin(undefined);
  }, [setLogin]);
  return onLogout;
};
