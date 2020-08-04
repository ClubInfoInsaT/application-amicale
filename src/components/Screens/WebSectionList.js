// @flow

import * as React from 'react';
import i18n from 'i18n-js';
import {Snackbar} from 'react-native-paper';
import {RefreshControl, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Collapsible} from 'react-navigation-collapsible';
import {StackNavigationProp} from '@react-navigation/stack';
import ErrorView from './ErrorView';
import BasicLoadingScreen from './BasicLoadingScreen';
import {withCollapsible} from '../../utils/withCollapsible';
import CustomTabBar from '../Tabbar/CustomTabBar';
import {ERROR_TYPE, readData} from '../../utils/WebData';
import CollapsibleSectionList from '../Collapsible/CollapsibleSectionList';
import type {ApiGenericDataType} from '../../utils/WebData';

export type SectionListDataType<T> = Array<{
  title: string,
  data: Array<T>,
  keyExtractor?: (T) => string,
}>;

type PropsType<T> = {
  navigation: StackNavigationProp,
  fetchUrl: string,
  autoRefreshTime: number,
  refreshOnFocus: boolean,
  renderItem: (data: {item: T}) => React.Node,
  createDataset: (
    data: ApiGenericDataType | null,
    isLoading?: boolean,
  ) => SectionListDataType<T>,
  onScroll: (event: SyntheticEvent<EventTarget>) => void,
  collapsibleStack: Collapsible,

  showError?: boolean,
  itemHeight?: number | null,
  updateData?: number,
  renderListHeaderComponent?: (data: ApiGenericDataType | null) => React.Node,
  renderSectionHeader?: (
    data: {section: {title: string}},
    isLoading?: boolean,
  ) => React.Node,
  stickyHeader?: boolean,
};

type StateType = {
  refreshing: boolean,
  fetchedData: ApiGenericDataType | null,
  snackbarVisible: boolean,
};

const MIN_REFRESH_TIME = 5 * 1000;

/**
 * Component used to render a SectionList with data fetched from the web
 *
 * This is a pure component, meaning it will only update if a shallow comparison of state and props is different.
 * To force the component to update, change the value of updateData.
 */
class WebSectionList<T> extends React.PureComponent<PropsType<T>, StateType> {
  static defaultProps = {
    showError: true,
    itemHeight: null,
    updateData: 0,
    renderListHeaderComponent: (): React.Node => null,
    renderSectionHeader: (): React.Node => null,
    stickyHeader: false,
  };

  refreshInterval: IntervalID;

  lastRefresh: Date | null;

  constructor() {
    super();
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
    const {navigation} = this.props;
    navigation.addListener('focus', this.onScreenFocus);
    navigation.addListener('blur', this.onScreenBlur);
    this.lastRefresh = null;
    this.onRefresh();
  }

  /**
   * Refreshes data when focusing the screen and setup a refresh interval if asked to
   */
  onScreenFocus = () => {
    const {props} = this;
    if (props.refreshOnFocus && this.lastRefresh) this.onRefresh();
    if (props.autoRefreshTime > 0)
      this.refreshInterval = setInterval(this.onRefresh, props.autoRefreshTime);
  };

  /**
   * Removes any interval on un-focus
   */
  onScreenBlur = () => {
    clearInterval(this.refreshInterval);
  };

  /**
   * Callback used when fetch is successful.
   * It will update the displayed data and stop the refresh animation
   *
   * @param fetchedData The newly fetched data
   */
  onFetchSuccess = (fetchedData: ApiGenericDataType) => {
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
    const {fetchUrl} = this.props;
    let canRefresh;
    if (this.lastRefresh != null) {
      const last = this.lastRefresh;
      canRefresh = new Date().getTime() - last.getTime() > MIN_REFRESH_TIME;
    } else canRefresh = true;
    if (canRefresh) {
      this.setState({refreshing: true});
      readData(fetchUrl).then(this.onFetchSuccess).catch(this.onFetchError);
    }
  };

  /**
   * Shows the error popup
   */
  showSnackBar = () => {
    this.setState({snackbarVisible: true});
  };

  /**
   * Hides the error popup
   */
  hideSnackBar = () => {
    this.setState({snackbarVisible: false});
  };

  getItemLayout = (
    data: T,
    index: number,
  ): {length: number, offset: number, index: number} | null => {
    const {itemHeight} = this.props;
    if (itemHeight == null) return null;
    return {
      length: itemHeight,
      offset: itemHeight * index,
      index,
    };
  };

  getRenderSectionHeader = (data: {section: {title: string}}): React.Node => {
    const {renderSectionHeader} = this.props;
    const {refreshing} = this.state;
    if (renderSectionHeader != null) {
      return (
        <Animatable.View animation="fadeInUp" duration={500} useNativeDriver>
          {renderSectionHeader(data, refreshing)}
        </Animatable.View>
      );
    }
    return null;
  };

  getRenderItem = (data: {item: T}): React.Node => {
    const {renderItem} = this.props;
    return (
      <Animatable.View animation="fadeInUp" duration={500} useNativeDriver>
        {renderItem(data)}
      </Animatable.View>
    );
  };

  onScroll = (event: SyntheticEvent<EventTarget>) => {
    const {onScroll} = this.props;
    if (onScroll != null) onScroll(event);
  };

  render(): React.Node {
    const {props, state} = this;
    let dataset = [];
    if (
      state.fetchedData != null ||
      (state.fetchedData == null && !props.showError)
    )
      dataset = props.createDataset(state.fetchedData, state.refreshing);

    const {containerPaddingTop} = props.collapsibleStack;
    return (
      <View>
        <CollapsibleSectionList
          sections={dataset}
          extraData={props.updateData}
          refreshControl={
            <RefreshControl
              progressViewOffset={containerPaddingTop}
              refreshing={state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          renderSectionHeader={this.getRenderSectionHeader}
          renderItem={this.getRenderItem}
          stickySectionHeadersEnabled={props.stickyHeader}
          style={{minHeight: '100%'}}
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
          getItemLayout={props.itemHeight != null ? this.getItemLayout : null}
          onScroll={this.onScroll}
          hasTab
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
            bottom: CustomTabBar.TAB_BAR_HEIGHT,
          }}>
          {i18n.t('general.listUpdateFail')}
        </Snackbar>
      </View>
    );
  }
}

export default withCollapsible(WebSectionList);
