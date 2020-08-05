// @flow

import * as React from 'react';
import {View} from 'react-native';
import {Card, withTheme} from 'react-native-paper';
import ImageModal from 'react-native-image-modal';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import {getDateOnlyString, getFormattedEventTime} from '../../utils/Planning';
import DateManager from '../../managers/DateManager';
import BasicLoadingScreen from '../../components/Screens/BasicLoadingScreen';
import {apiRequest, ERROR_TYPE} from '../../utils/WebData';
import ErrorView from '../../components/Screens/ErrorView';
import CustomHTML from '../../components/Overrides/CustomHTML';
import CustomTabBar from '../../components/Tabbar/CustomTabBar';
import type {CustomThemeType} from '../../managers/ThemeManager';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import type {PlanningEventType} from '../../utils/Planning';

type PropsType = {
  navigation: StackNavigationProp,
  route: {params: {data: PlanningEventType, id: number, eventId: number}},
  theme: CustomThemeType,
};

type StateType = {
  loading: boolean,
};

const EVENT_INFO_URL = 'event/info';

/**
 * Class defining a planning event information page.
 */
class PlanningDisplayScreen extends React.Component<PropsType, StateType> {
  displayData: null | PlanningEventType;

  shouldFetchData: boolean;

  eventId: number;

  errorCode: number;

  /**
   * Generates data depending on whether the screen was opened from the planning or from a link
   *
   * @param props
   */
  constructor(props: PropsType) {
    super(props);

    if (props.route.params.data != null) {
      this.displayData = props.route.params.data;
      this.eventId = this.displayData.id;
      this.shouldFetchData = false;
      this.errorCode = 0;
      this.state = {
        loading: false,
      };
    } else {
      this.displayData = null;
      this.eventId = props.route.params.eventId;
      this.shouldFetchData = true;
      this.errorCode = 0;
      this.state = {
        loading: true,
      };
      this.fetchData();
    }
  }

  /**
   * Hides loading and saves fetched data
   *
   * @param data Received data
   */
  onFetchSuccess = (data: PlanningEventType) => {
    this.displayData = data;
    this.setState({loading: false});
  };

  /**
   * Hides loading and saves the error code
   *
   * @param error
   */
  onFetchError = (error: number) => {
    this.errorCode = error;
    this.setState({loading: false});
  };

  /**
   * Gets content to display
   *
   * @returns {*}
   */
  getContent(): React.Node {
    const {theme} = this.props;
    const {displayData} = this;
    if (displayData == null) return null;
    let subtitle = getFormattedEventTime(
      displayData.date_begin,
      displayData.date_end,
    );
    const dateString = getDateOnlyString(displayData.date_begin);
    if (dateString !== null)
      subtitle += ` | ${DateManager.getInstance().getTranslatedDate(
        dateString,
      )}`;
    return (
      <CollapsibleScrollView style={{paddingLeft: 5, paddingRight: 5}} hasTab>
        <Card.Title title={displayData.title} subtitle={subtitle} />
        {displayData.logo !== null ? (
          <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor={theme.colors.background}
              style={{
                width: 300,
                height: 300,
              }}
              source={{
                uri: displayData.logo,
              }}
            />
          </View>
        ) : null}

        {displayData.description !== null ? (
          <Card.Content
            style={{paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
            <CustomHTML html={displayData.description} />
          </Card.Content>
        ) : (
          <View />
        )}
      </CollapsibleScrollView>
    );
  }

  /**
   * Shows an error view and use a custom message if the event does not exist
   *
   * @returns {*}
   */
  getErrorView(): React.Node {
    const {navigation} = this.props;
    if (this.errorCode === ERROR_TYPE.BAD_INPUT)
      return (
        <ErrorView
          navigation={navigation}
          showRetryButton={false}
          message={i18n.t('screens.planning.invalidEvent')}
          icon="calendar-remove"
        />
      );
    return (
      <ErrorView
        navigation={navigation}
        errorCode={this.errorCode}
        onRefresh={this.fetchData}
      />
    );
  }

  /**
   * Fetches data for the current event id from the API
   */
  fetchData = () => {
    this.setState({loading: true});
    apiRequest(EVENT_INFO_URL, 'POST', {id: this.eventId})
      .then(this.onFetchSuccess)
      .catch(this.onFetchError);
  };

  render(): React.Node {
    const {loading} = this.state;
    if (loading) return <BasicLoadingScreen />;
    if (this.errorCode === 0) return this.getContent();
    return this.getErrorView();
  }
}

export default withTheme(PlanningDisplayScreen);
