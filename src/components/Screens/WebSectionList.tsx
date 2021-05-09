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

import * as React from 'react';
import i18n from 'i18n-js';
import { Snackbar } from 'react-native-paper';
import {
  NativeSyntheticEvent,
  RefreshControl,
  SectionListData,
  StyleSheet,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Collapsible } from 'react-navigation-collapsible';
import { StackNavigationProp } from '@react-navigation/stack';
import ErrorView from './ErrorView';
import BasicLoadingScreen from './BasicLoadingScreen';
import { TAB_BAR_HEIGHT } from '../Tabbar/CustomTabBar';
import { ERROR_TYPE, readData } from '../../utils/WebData';
import CollapsibleSectionList from '../Collapsible/CollapsibleSectionList';
import GENERAL_STYLES from '../../constants/Styles';

export type SectionListDataType<ItemT> = Array<{
  title: string;
  icon?: string;
  data: Array<ItemT>;
  keyExtractor?: (data: ItemT) => string;
}>;

type PropsType<ItemT, RawData> = {
  navigation: StackNavigationProp<any>;
  fetchUrl: string;
  autoRefreshTime: number;
  refreshOnFocus: boolean;
  renderItem: (data: { item: ItemT }) => React.ReactNode;
  createDataset: (
    data: RawData | null,
    isLoading?: boolean
  ) => SectionListDataType<ItemT>;

  onScroll?: (event: NativeSyntheticEvent<EventTarget>) => void;
  showError?: boolean;
  itemHeight?: number | null;
  updateData?: number;
  renderListHeaderComponent?: (
    data: RawData | null
  ) => React.ComponentType<any> | React.ReactElement | null;
  renderSectionHeader?: (
    data: { section: SectionListData<ItemT> },
    isLoading?: boolean
  ) => React.ReactElement | null;
  stickyHeader?: boolean;
};

type StateType<RawData> = {
  refreshing: boolean;
  fetchedData: RawData | null;
  snackbarVisible: boolean;
};

const MIN_REFRESH_TIME = 5 * 1000;

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
  },
});

/**
 * Component used to render a SectionList with data fetched from the web
 *
 * This is a pure component, meaning it will only update if a shallow comparison of state and props is different.
 * To force the component to update, change the value of updateData.
 */
class WebSectionList<ItemT, RawData> extends React.PureComponent<
  PropsType<ItemT, RawData>,
  StateType<RawData>
> {
  static defaultProps = {
    showError: true,
    itemHeight: null,
    updateData: 0,
    renderListHeaderComponent: () => null,
    renderSectionHeader: () => null,
    stickyHeader: false,
  };

  refreshInterval: NodeJS.Timeout | undefined;

  lastRefresh: Date | undefined;

  constructor(props: PropsType<ItemT, RawData>) {
    super(props);
    this.state = {
      refreshing: false,
      fetchedData: null,
      snackbarVisible: false,
    };
  }

  /**
   * Registers react navigation events on first screen load.
   * Allows to detect when the screen is focused
   */
  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('focus', this.onScreenFocus);
    navigation.addListener('blur', this.onScreenBlur);
    this.lastRefresh = undefined;
    this.onRefresh();
  }

  /**
   * Refreshes data when focusing the screen and setup a refresh interval if asked to
   */
  onScreenFocus = () => {
    const { props } = this;
    if (props.refreshOnFocus && this.lastRefresh) {
      setTimeout(this.onRefresh, 200);
    }
    if (props.autoRefreshTime > 0) {
      this.refreshInterval = setInterval(this.onRefresh, props.autoRefreshTime);
    }
  };

  /**
   * Removes any interval on un-focus
   */
  onScreenBlur = () => {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  };

  /**
   * Callback used when fetch is successful.
   * It will update the displayed data and stop the refresh animation
   *
   * @param fetchedData The newly fetched data
   */
  onFetchSuccess = (fetchedData: RawData) => {
    this.setState({
      fetchedData,
      refreshing: false,
    });
    this.lastRefresh = new Date();
  };

  /**
   * Callback used when fetch encountered an error.
   * It will reset the displayed data and show an error.
   */
  onFetchError = () => {
    this.setState({
      fetchedData: null,
      refreshing: false,
    });
    this.showSnackBar();
  };

  /**
   * Refreshes data and shows an animations while doing it
   */
  onRefresh = () => {
    const { fetchUrl } = this.props;
    let canRefresh;
    if (this.lastRefresh != null) {
      const last = this.lastRefresh;
      canRefresh = new Date().getTime() - last.getTime() > MIN_REFRESH_TIME;
    } else {
      canRefresh = true;
    }
    if (canRefresh) {
      this.setState({ refreshing: true });
      readData(fetchUrl).then(this.onFetchSuccess).catch(this.onFetchError);
    }
  };

  /**
   * Shows the error popup
   */
  showSnackBar = () => {
    this.setState({ snackbarVisible: true });
  };

  /**
   * Hides the error popup
   */
  hideSnackBar = () => {
    this.setState({ snackbarVisible: false });
  };

  getItemLayout = (
    height: number,
    data: Array<SectionListData<ItemT>> | null,
    index: number
  ): { length: number; offset: number; index: number } => {
    return {
      length: height,
      offset: height * index,
      index,
    };
  };

  getRenderSectionHeader = (data: { section: SectionListData<ItemT> }) => {
    const { renderSectionHeader } = this.props;
    const { refreshing } = this.state;
    if (renderSectionHeader != null) {
      return (
        <Animatable.View animation="fadeInUp" duration={500} useNativeDriver>
          {renderSectionHeader(data, refreshing)}
        </Animatable.View>
      );
    }
    return null;
  };

  getRenderItem = (data: { item: ItemT }) => {
    const { renderItem } = this.props;
    return (
      <Animatable.View animation="fadeInUp" duration={500} useNativeDriver>
        {renderItem(data)}
      </Animatable.View>
    );
  };

  onScroll = (event: NativeSyntheticEvent<EventTarget>) => {
    const { onScroll } = this.props;
    if (onScroll != null) {
      onScroll(event);
    }
  };

  render() {
    const { props, state } = this;
    const { itemHeight } = props;
    let dataset: SectionListDataType<ItemT> = [];
    if (
      state.fetchedData != null ||
      (state.fetchedData == null && !props.showError)
    ) {
      dataset = props.createDataset(state.fetchedData, state.refreshing);
    }

    return (
      <View style={GENERAL_STYLES.flex}>
        <CollapsibleSectionList
          sections={dataset}
          extraData={props.updateData}
          paddedProps={(paddingTop) => ({
            refreshControl: (
              <RefreshControl
                progressViewOffset={paddingTop}
                refreshing={state.refreshing}
                onRefresh={this.onRefresh}
              />
            ),
          })}
          renderSectionHeader={this.getRenderSectionHeader}
          renderItem={this.getRenderItem}
          stickySectionHeadersEnabled={props.stickyHeader}
          style={styles.container}
          ListHeaderComponent={
            props.renderListHeaderComponent != null
              ? props.renderListHeaderComponent(state.fetchedData)
              : null
          }
          ListEmptyComponent={
            state.refreshing ? (
              <BasicLoadingScreen />
            ) : (
              <ErrorView
                navigation={props.navigation}
                errorCode={ERROR_TYPE.CONNECTION_ERROR}
                onRefresh={this.onRefresh}
              />
            )
          }
          getItemLayout={
            itemHeight
              ? (data, index) => this.getItemLayout(itemHeight, data, index)
              : undefined
          }
          onScroll={this.onScroll}
          hasTab={true}
        />
        <Snackbar
          visible={state.snackbarVisible}
          onDismiss={this.hideSnackBar}
          action={{
            label: 'OK',
            onPress: () => {},
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
}

export default WebSectionList;
