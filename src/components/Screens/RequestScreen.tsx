import React, { useEffect, useRef } from 'react';
import ErrorView, { ErrorProps } from './ErrorView';
import { useRequestLogic } from '../../utils/customHooks';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import BasicLoadingScreen from './BasicLoadingScreen';
import i18n from 'i18n-js';
import { API_RESPONSE_CODE, RESPONSE_HTTP_STATUS } from '../../utils/Requests';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainRoutes } from '../../navigation/MainNavigator';
import { useLogout } from '../../utils/logout';

export type RequestScreenProps<T> = {
  request: () => Promise<T>;
  render: (
    data: T | undefined,
    loading: boolean,
    lastRefreshDate: Date | undefined,
    refreshData: (newRequest?: () => Promise<T>) => void,
    status: RESPONSE_HTTP_STATUS,
    code?: API_RESPONSE_CODE,
    message?: string
  ) => React.ReactElement;
  renderError?: (props: ErrorProps) => React.ReactElement;
  renderLoading?: () => React.ReactElement;
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

const MIN_REFRESH_TIME = 3 * 1000;

export default function RequestScreen<T>(props: Props<T>) {
  const onLogout = useLogout();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const refreshInterval = useRef<number>();
  const [loading, lastRefreshDate, status, code, message, data, refreshData] =
    useRequestLogic<T>(
      props.request,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, loading]);

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
    }, [props.cache, props.refreshOnFocus, props.autoRefreshTime])
  );

  const isErrorCritical = (e: API_RESPONSE_CODE | undefined) => {
    return e === API_RESPONSE_CODE.BAD_TOKEN;
  };

  useEffect(() => {
    if (isErrorCritical(code)) {
      onLogout();
      navigation.replace(MainRoutes.Login, { nextScreen: route.name });
    }
  }, [code, navigation, route, onLogout]);

  if (data === undefined && loading && props.showLoading !== false) {
    return props.renderLoading ? props.renderLoading() : <BasicLoadingScreen />;
  } else if (
    data === undefined &&
    (status !== RESPONSE_HTTP_STATUS.SUCCESS ||
      (status === RESPONSE_HTTP_STATUS.SUCCESS && code !== undefined)) &&
    props.showError !== false
  ) {
    const button = isErrorCritical(code)
      ? undefined
      : {
          icon: 'refresh',
          text: i18n.t('general.retry'),
          onPress: () => refreshData(),
        };
    return props.renderError ? (
      props.renderError({
        status,
        code,
        message,
        icon: undefined,
        loading,
        button,
      })
    ) : (
      <ErrorView
        status={status}
        code={code}
        message={message}
        loading={loading}
        button={button}
      />
    );
  } else {
    return props.render(
      data,
      loading,
      lastRefreshDate,
      refreshData,
      status,
      code
    );
  }
}
