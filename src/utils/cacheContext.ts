import React, { useContext } from 'react';

export type CacheContextType<T> = {
  cache: T | undefined;
  setCache: (newCache: T) => void;
  resetCache: () => void;
};

export const CacheContext = React.createContext<CacheContextType<any>>({
  cache: undefined,
  setCache: () => undefined,
  resetCache: () => undefined,
});

function getCacheContext<T>() {
  return CacheContext as React.Context<CacheContextType<T>>;
}

export function useCache<T>() {
  return useContext(getCacheContext<T>());
}
