import React, { useEffect, useRef } from 'react';
import ErrorView from './ErrorView';
import { useRequestLogic } from '../../utils/customHooks';
import { useFocusEffect } from '@react-navigation/native';
import BasicLoadingScreen from './BasicLoadingScreen';
import i18n from 'i18n-js';
import { REQUEST_CODES, REQUEST_STATUS } from '../../utils/Requests';

export type RequestScreenProps<T> = {
  request: () => Promise<T>;
  render: (
    data: T | undefined,
    loading: boolean,
    refreshData: (newRequest?: () => Promise<T>) => void,
    status: REQUEST_STATUS,
    code?: REQUEST_CODES
  ) => React.ReactElement;
  cache?: T;
  onCacheUpdate?: (newCache: T) => void;
  onMajorError?: (status: number, code?: number) => void;
  showLoading?: boolean;
  showError?: boolean;
  refreshOnFocus?: boolean;
  autoRefreshTime?: number;
  refresh?: boolean;
  onFinish?: () => void;
};

export type RequestProps = {
  refreshData: () => void;
  loading: boolean;
};

type Props<T> = RequestScreenProps<T>;

const MIN_REFRESH_TIME = 5 * 1000;

export default function RequestScreen<T>(props: Props<T>) {
  const refreshInterval = useRef<number>();
  const [loading, status, code, data, refreshData] = useRequestLogic<T>(
    () => props.request(),
    props.cache,
    props.onCacheUpdate,
    props.refreshOnFocus,
    MIN_REFRESH_TIME
  );
  // Store last refresh prop value
  const lastRefresh = useRef<boolean>(false);

  useEffect(() => {
    // Refresh data if refresh prop changed and we are not loading
    if (props.refresh && !lastRefresh.current && !loading) {
      refreshData();
      // Call finish callback if refresh prop was set and we finished loading
    } else if (lastRefresh.current && !loading && props.onFinish) {
      props.onFinish();
    }
    // Update stored refresh prop value
    if (props.refresh !== lastRefresh.current) {
      lastRefresh.current = props.refresh === true;
    }
  }, [props, loading, refreshData]);

  useFocusEffect(
    React.useCallback(() => {
      if (!props.cache && props.refreshOnFocus !== false) {
        refreshData();
      }
      if (props.autoRefreshTime && props.autoRefreshTime > 0) {
        refreshInterval.current = setInterval(
          refreshData,
          props.autoRefreshTime
        );
      }
      return () => {
        if (refreshInterval.current) {
          clearInterval(refreshInterval.current);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.cache, props.refreshOnFocus])
  );

  // useEffect(() => {
  //   if (status === REQUEST_STATUS.BAD_TOKEN && props.onMajorError) {
  //     props.onMajorError(status, code);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [status, code]);

  // if (status === REQUEST_STATUS.BAD_TOKEN && props.onMajorError) {
  //   return <View />;
  // } else
  if (data === undefined && loading && props.showLoading !== false) {
    return <BasicLoadingScreen />;
  } else if (
    data === undefined &&
    status !== REQUEST_STATUS.SUCCESS &&
    props.showError !== false
  ) {
    return (
      <ErrorView
        status={status}
        loading={loading}
        button={{
          icon: 'refresh',
          text: i18n.t('general.retry'),
          onPress: () => refreshData(),
        }}
      />
    );
  } else {
    return props.render(data, loading, refreshData, status, code);
  }
}
