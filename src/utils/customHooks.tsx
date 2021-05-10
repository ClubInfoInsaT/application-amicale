import { DependencyList, useEffect, useRef, useState } from 'react';
import { REQUEST_STATUS } from './Requests';

export function useMountEffect(func: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(func, []);
}

/**
 * Effect that does not run on first render
 *
 * @param effect
 * @param deps
 */
export function useSubsequentEffect(effect: () => void, deps?: DependencyList) {
  const didMountRef = useRef(false);
  useEffect(
    () => {
      if (didMountRef.current) {
        effect();
      } else {
        didMountRef.current = true;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps ? deps : []
  );
}

export function useRequestLogic<T>(
  request: () => Promise<T>,
  cache?: T,
  onCacheUpdate?: (newCache: T) => void,
  startLoading?: boolean,
  minRefreshTime?: number
) {
  const [response, setResponse] = useState<{
    loading: boolean;
    status: REQUEST_STATUS;
    code?: number;
    data: T | undefined;
  }>({
    loading: startLoading !== false && cache === undefined,
    status: REQUEST_STATUS.SUCCESS,
    code: undefined,
    data: undefined,
  });
  const [lastRefreshDate, setLastRefreshDate] = useState<Date | undefined>(
    undefined
  );

  const refreshData = (newRequest?: () => Promise<T>) => {
    let canRefresh;
    if (lastRefreshDate && minRefreshTime) {
      const last = lastRefreshDate;
      canRefresh = new Date().getTime() - last.getTime() > minRefreshTime;
    } else {
      canRefresh = true;
    }
    if (canRefresh) {
      if (!response.loading) {
        setResponse((prevState) => ({
          ...prevState,
          loading: true,
        }));
      }
      setLastRefreshDate(new Date());
      const r = newRequest ? newRequest : request;
      r()
        .then((requestResponse: T) => {
          setResponse({
            loading: false,
            status: REQUEST_STATUS.SUCCESS,
            code: undefined,
            data: requestResponse,
          });
          if (onCacheUpdate) {
            onCacheUpdate(requestResponse);
          }
        })
        .catch(() => {
          setResponse((prevState) => ({
            loading: false,
            status: REQUEST_STATUS.CONNECTION_ERROR,
            code: 0,
            data: prevState.data,
          }));
        });
    }
  };

  const value: [
    boolean,
    REQUEST_STATUS,
    number | undefined,
    T | undefined,
    (newRequest?: () => Promise<T>) => void
  ] = [
    response.loading,
    response.status,
    response.code,
    cache ? cache : response.data,
    refreshData,
  ];
  return value;
}
