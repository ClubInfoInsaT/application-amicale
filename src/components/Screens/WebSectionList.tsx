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

import React from 'react';
import i18n from 'i18n-js';
import {
  RefreshControl,
  SectionListData,
  SectionListProps,
  StyleSheet,
} from 'react-native';
import ErrorView from './ErrorView';
import CollapsibleSectionList from '../Collapsible/CollapsibleSectionList';
import RequestScreen, { RequestScreenProps } from './RequestScreen';
import { CollapsibleComponentPropsType } from '../Collapsible/CollapsibleComponent';
import { API_REQUEST_CODES, REQUEST_STATUS } from '../../utils/Requests';

export type SectionListDataType<ItemT> = Array<{
  title: string;
  icon?: string;
  data: Array<ItemT>;
  keyExtractor?: (data: ItemT) => string;
}>;

type Props<ItemT, RawData> = Omit<
  CollapsibleComponentPropsType,
  'children' | 'paddedProps'
> &
  Omit<
    RequestScreenProps<RawData>,
    'render' | 'showLoading' | 'showError' | 'onMajorError'
  > &
  Omit<
    SectionListProps<ItemT>,
    'sections' | 'getItemLayout' | 'ListHeaderComponent' | 'ListEmptyComponent'
  > & {
    createDataset: (
      data: RawData | undefined,
      loading: boolean,
      lastRefreshDate: Date | undefined,
      refreshData: (newRequest?: () => Promise<RawData>) => void,
      status: REQUEST_STATUS,
      code?: API_REQUEST_CODES
    ) => SectionListDataType<ItemT>;
    renderListHeaderComponent?: (
      data: RawData | undefined,
      loading: boolean,
      lastRefreshDate: Date | undefined,
      refreshData: (newRequest?: () => Promise<RawData>) => void,
      status: REQUEST_STATUS,
      code?: API_REQUEST_CODES
    ) => React.ComponentType<any> | React.ReactElement | null;
    itemHeight?: number | null;
  };

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
  },
});

/**
 * Component used to render a SectionList with data fetched from the web
 * To force the component to update, change the value of updateData.
 */
function WebSectionList<ItemT, RawData>(props: Props<ItemT, RawData>) {
  const getItemLayout = (
    height: number,
    _data: Array<SectionListData<ItemT>> | null,
    index: number
  ): { length: number; offset: number; index: number } => {
    return {
      length: height,
      offset: height * index,
      index,
    };
  };

  const render = (
    data: RawData | undefined,
    loading: boolean,
    lastRefreshDate: Date | undefined,
    refreshData: (newRequest?: () => Promise<RawData>) => void,
    status: REQUEST_STATUS,
    code?: API_REQUEST_CODES
  ) => {
    const { itemHeight } = props;
    const dataset = props.createDataset(
      data,
      loading,
      lastRefreshDate,
      refreshData,
      status,
      code
    );
    return (
      <CollapsibleSectionList
        {...props}
        sections={dataset}
        paddedProps={(paddingTop) => ({
          refreshControl: (
            <RefreshControl
              progressViewOffset={paddingTop}
              refreshing={loading}
              onRefresh={refreshData}
            />
          ),
        })}
        renderItem={props.renderItem}
        style={styles.container}
        ListHeaderComponent={
          props.renderListHeaderComponent != null
            ? props.renderListHeaderComponent(
                data,
                loading,
                lastRefreshDate,
                refreshData,
                status,
                code
              )
            : null
        }
        ListEmptyComponent={
          loading ? undefined : (
            <ErrorView
              status={status}
              code={code}
              button={
                code !== API_REQUEST_CODES.BAD_TOKEN
                  ? {
                      icon: 'refresh',
                      text: i18n.t('general.retry'),
                      onPress: () => refreshData(),
                    }
                  : undefined
              }
            />
          )
        }
        getItemLayout={
          itemHeight ? (d, i) => getItemLayout(itemHeight, d, i) : undefined
        }
        // Disable sticky section headers by default on iOS
        stickySectionHeadersEnabled={
          props.stickySectionHeadersEnabled !== false
            ? props.stickySectionHeadersEnabled
            : false
        }
      />
    );
  };

  return (
    <RequestScreen<RawData>
      request={props.request}
      render={render}
      showError={false}
      showLoading={false}
      autoRefreshTime={props.autoRefreshTime}
      refreshOnFocus={props.refreshOnFocus}
      cache={props.cache}
      onCacheUpdate={props.onCacheUpdate}
      refresh={props.refresh}
      onFinish={props.onFinish}
    />
  );
}

export default WebSectionList;
