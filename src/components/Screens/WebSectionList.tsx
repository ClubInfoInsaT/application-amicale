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

import React, { useState } from 'react';
import i18n from 'i18n-js';
import { Snackbar } from 'react-native-paper';
import {
  RefreshControl,
  SectionListData,
  SectionListProps,
  StyleSheet,
  View,
} from 'react-native';
import ErrorView from './ErrorView';
import { TAB_BAR_HEIGHT } from '../Tabbar/CustomTabBar';
import CollapsibleSectionList from '../Collapsible/CollapsibleSectionList';
import GENERAL_STYLES from '../../constants/Styles';
import RequestScreen, { RequestScreenProps } from './RequestScreen';
import { CollapsibleComponentPropsType } from '../Collapsible/CollapsibleComponent';
import { REQUEST_CODES, REQUEST_STATUS } from '../../utils/Requests';

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
    | 'render'
    | 'showLoading'
    | 'showError'
    | 'refresh'
    | 'onFinish'
    | 'onMajorError'
  > &
  Omit<
    SectionListProps<ItemT>,
    'sections' | 'getItemLayout' | 'ListHeaderComponent' | 'ListEmptyComponent'
  > & {
    createDataset: (
      data: RawData | undefined,
      isLoading: boolean
    ) => SectionListDataType<ItemT>;
    renderListHeaderComponent?: (
      data?: RawData
    ) => React.ComponentType<any> | React.ReactElement | null;
    renderSectionHeader?: (
      data: { section: SectionListData<ItemT> },
      isLoading: boolean
    ) => React.ReactElement | null;
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
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const showSnackBar = () => setSnackbarVisible(true);

  const hideSnackBar = () => setSnackbarVisible(false);

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
    refreshData: (newRequest?: () => Promise<RawData>) => void,
    status: REQUEST_STATUS,
    code?: REQUEST_CODES
  ) => {
    const { itemHeight } = props;
    const dataset = props.createDataset(data, loading);
    if (!data && !loading) {
      showSnackBar();
    }
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
            ? props.renderListHeaderComponent(data)
            : null
        }
        ListEmptyComponent={
          loading ? undefined : (
            <ErrorView
              status={status}
              code={code}
              button={{
                icon: 'refresh',
                text: i18n.t('general.retry'),
                onPress: refreshData,
              }}
            />
          )
        }
        getItemLayout={
          itemHeight ? (d, i) => getItemLayout(itemHeight, d, i) : undefined
        }
      />
    );
  };

  return (
    <View style={GENERAL_STYLES.flex}>
      <RequestScreen<RawData>
        request={props.request}
        render={render}
        showError={false}
        showLoading={false}
        autoRefreshTime={props.autoRefreshTime}
        refreshOnFocus={props.refreshOnFocus}
        cache={props.cache}
        onCacheUpdate={props.onCacheUpdate}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={hideSnackBar}
        action={{
          label: 'OK',
          onPress: hideSnackBar,
        }}
        duration={4000}
        style={{
          bottom: TAB_BAR_HEIGHT,
        }}
      >
        {i18n.t('general.listUpdateFail')}
      </Snackbar>
    </View>
  );
}

export default WebSectionList;
