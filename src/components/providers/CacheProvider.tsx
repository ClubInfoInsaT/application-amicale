import React, { useState } from 'react';
import {
  CacheContext,
  CacheContextType,
  CacheType,
} from '../../context/cacheContext';

type Props = {
  children: React.ReactChild;
};

export default function CacheProvider(props: Props) {
  const setCache = (newCache: CacheType) => {
    setCacheState((prevState) => ({
      ...prevState,
      cache: {
        ...prevState.cache,
        ...newCache,
      },
    }));
  };

  const resetCache = () => {
    setCacheState((prevState) => ({
      ...prevState,
      cache: undefined,
    }));
  };

  const [cacheState, setCacheState] = useState<CacheContextType>({
    cache: undefined,
    setCache: setCache,
    resetCache: resetCache,
  });

  return (
    <CacheContext.Provider value={cacheState}>
      {props.children}
    </CacheContext.Provider>
  );
}
