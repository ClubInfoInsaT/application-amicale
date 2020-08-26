// @flow

import * as React from 'react';
import {View} from 'react-native';
import {Card} from 'react-native-paper';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import {getDateOnlyString, getTimeOnlyString} from '../../utils/Planning';
import DateManager from '../../managers/DateManager';
import BasicLoadingScreen from '../../components/Screens/BasicLoadingScreen';
import {apiRequest, ERROR_TYPE} from '../../utils/WebData';
import ErrorView from '../../components/Screens/ErrorView';
import CustomHTML from '../../components/Overrides/CustomHTML';
import CustomTabBar from '../../components/Tabbar/CustomTabBar';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import type {PlanningEventType} from '../../utils/Planning';
import ImageGalleryButton from '../../components/Media/ImageGalleryButton';

type PropsType = {
  navigation: StackNavigationProp,
  route: {params: {data: PlanningEventType, id: number, eventId: number}},
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
    const {navigation} = this.props;
    const {displayData} = this;
    if (displayData == null) return null;
    let subtitle = getTimeOnlyString(displayData.date_begin);
    const dateString = getDateOnlyString(displayData.date_begin);
    if (dateString !== null && subtitle != null)
      subtitle += ` | ${DateManager.getInstance().getTranslatedDate(
        dateString,
      )}`;
    return (
      <CollapsibleScrollView style={{paddingLeft: 5, paddingRight: 5}} hasTab>
        <Card.Title title={displayData.title} subtitle={subtitle} />
        {displayData.logo !== null ? (
          <ImageGalleryButton
            navigation={navigation}
            images={[{url: displayData.logo}]}
            style={{
              width: 300,
              height: 300,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
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

export default PlanningDisplayScreen;
