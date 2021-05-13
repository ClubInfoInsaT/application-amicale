/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

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
    lastRefreshDate?: Date;
    status: REQUEST_STATUS;
    code?: number;
    data: T | undefined;
  }>({
    loading: startLoading !== false && cache === undefined,
    lastRefreshDate: undefined,
    status: REQUEST_STATUS.SUCCESS,
    code: undefined,
    data: undefined,
  });

  const refreshData = (newRequest?: () => Promise<T>) => {
    let canRefresh;
    if (response.lastRefreshDate && minRefreshTime) {
      canRefresh =
        new Date().getTime() - response.lastRefreshDate.getTime() >
        minRefreshTime;
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
      const r = newRequest ? newRequest : request;
      r()
        .then((requestResponse: T) => {
          setResponse({
            loading: false,
            lastRefreshDate: new Date(),
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
            lastRefreshDate: prevState.lastRefreshDate,
            status: REQUEST_STATUS.CONNECTION_ERROR,
            code: undefined,
            data: prevState.data,
          }));
        });
    }
  };

  const value: [
    boolean,
    Date | undefined,
    REQUEST_STATUS,
    number | undefined,
    T | undefined,
    (newRequest?: () => Promise<T>) => void
  ] = [
    response.loading,
    response.lastRefreshDate,
    response.status,
    response.code,
    cache ? cache : response.data,
    refreshData,
  ];
  return value;
}
