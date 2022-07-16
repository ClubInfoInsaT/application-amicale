import React, { useContext } from 'react';
import { apiRequest } from '../utils/WebData';

export type LoginContextType = {
  token: string | undefined;
  setLogin: (token: string | undefined) => void;
};

export const LoginContext = React.createContext<LoginContextType>({
  token: undefined,
  setLogin: () => undefined,
});

/**
 * Hook used to retrieve the user token and puid.
 * @returns Login context with token and puid to undefined if user is not logged in
 */
export function useLogin() {
  return useContext(LoginContext);
}

/**
 * Checks if the user is connected
 * @returns True if the user is connected
 */
export function useLoginState() {
  const { token } = exports.useLogin();
  return token !== undefined;
}

/**
 * Gets the current user token.
 * @returns The token, or empty string if the user is not logged in
 */
export function useLoginToken() {
  const { token } = exports.useLogin();
  return token ? token : '';
}

export function useAuthenticatedRequest<T>(
  path: string,
  params?: { [key: string]: any }
) {
  const token = useLoginToken();
  return () => apiRequest<T>(path, 'POST', params, token);
}
