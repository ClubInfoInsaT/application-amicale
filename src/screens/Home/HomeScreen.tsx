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
import {FlatList, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import i18n from 'i18n-js';
import {ActivityIndicator, Headline, withTheme} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import {View} from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardItem from '../../components/Home/EventDashboardItem';
import WebSectionList from '../../components/Screens/WebSectionList';
import FeedItem from '../../components/Home/FeedItem';
import SmallDashboardItem from '../../components/Home/SmallDashboardItem';
import PreviewEventDashboardItem from '../../components/Home/PreviewEventDashboardItem';
import ActionsDashBoardItem from '../../components/Home/ActionsDashboardItem';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import AnimatedFAB from '../../components/Animations/AnimatedFAB';
import ConnectionManager from '../../managers/ConnectionManager';
import LogoutDialog from '../../components/Amicale/LogoutDialog';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import DashboardManager from '../../managers/DashboardManager';
import type {ServiceItemType} from '../../managers/ServicesManager';
import {getDisplayEvent, getFutureEvents} from '../../utils/Home';
import type {PlanningEventType} from '../../utils/Planning';
// import DATA from "../dashboard_data.json";

const DATA_URL =
  'https://etud.insa-toulouse.fr/~amicale_app/v2/dashboard/dashboard_data.json';
const FEED_ITEM_HEIGHT = 500;

const SECTIONS_ID = ['dashboard', 'news_feed'];

const REFRESH_TIME = 1000 * 20; // Refresh every 20 seconds

export type FeedItemType = {
  id: string;
  message: string;
  url: string;
  image: string | null;
  video: string | null;
  link: string | null;
  time: number;
  page_id: string;
};

export type FullDashboardType = {
  today_menu: Array<{[key: string]: object}>;
  proximo_articles: number;
  available_dryers: number;
  available_washers: number;
  today_events: Array<PlanningEventType>;
  available_tutorials: number;
};

type RawNewsFeedType = {[key: string]: Array<FeedItemType>};

type RawDashboardType = {
  news_feed: RawNewsFeedType;
  dashboard: FullDashboardType;
};

type PropsType = {
  navigation: StackNavigationProp<any>;
  route: {params: {nextScreen: string; data: object}};
  theme: ReactNativePaper.Theme;
};

type StateType = {
  dialogVisible: boolean;
};

/**
 * Class defining the app's home screen
 */
class HomeScreen extends React.Component<PropsType, StateType> {
  static sortFeedTime = (a: FeedItemType, b: FeedItemType): number =>
    b.time - a.time;

  static generateNewsFeed(rawFeed: RawNewsFeedType): Array<FeedItemType> {
    const finalFeed: Array<FeedItemType> = [];
    Object.keys(rawFeed).forEach((key: string) => {
      const category: Array<FeedItemType> | null = rawFeed[key];
      if (category != null && category.length > 0) {
        finalFeed.push(...category);
      }
    });
    finalFeed.sort(HomeScreen.sortFeedTime);
    return finalFeed;
  }

  isLoggedIn: boolean | null;

  fabRef: {current: null | AnimatedFAB};

  currentNewFeed: Array<FeedItemType>;

  currentDashboard: FullDashboardType | null;

  dashboardManager: DashboardManager;

  constructor(props: PropsType) {
    super(props);
    this.fabRef = React.createRef();
    this.dashboardManager = new DashboardManager(props.navigation);
    this.currentNewFeed = [];
    this.currentDashboard = null;
    this.isLoggedIn = ConnectionManager.getInstance().isLoggedIn();
    props.navigation.setOptions({
      headerRight: this.getHeaderButton,
    });
    this.state = {
      dialogVisible: false,
    };
  }

  componentDidMount() {
    const {props} = this;
    props.navigation.addListener('focus', this.onScreenFocus);
    // Handle link open when home is focused
    props.navigation.addListener('state', this.handleNavigationParams);
  }

  /**
   * Updates login state and navigation parameters on screen focus
   */
  onScreenFocus = () => {
    const {props} = this;
    if (ConnectionManager.getInstance().isLoggedIn() !== this.isLoggedIn) {
      this.isLoggedIn = ConnectionManager.getInstance().isLoggedIn();
      props.navigation.setOptions({
        headerRight: this.getHeaderButton,
      });
    }
    // handle link open when home is not focused or created
    this.handleNavigationParams();
  };

  /**
   * Gets header buttons based on login state
   *
   * @returns {*}
   */
  getHeaderButton = () => {
    const {props} = this;
    let onPressLog = (): void =>
      props.navigation.navigate('login', {nextScreen: 'profile'});
    let logIcon = 'login';
    let logColor = props.theme.colors.primary;
    if (this.isLoggedIn) {
      onPressLog = (): void => this.showDisconnectDialog();
      logIcon = 'logout';
      logColor = props.theme.colors.text;
    }

    const onPressSettings = (): void => props.navigation.navigate('settings');
    return (
      <MaterialHeaderButtons>
        <Item
          title="log"
          iconName={logIcon}
          color={logColor}
          onPress={onPressLog}
        />
        <Item
          title={i18n.t('screens.settings.title')}
          iconName="cog"
          onPress={onPressSettings}
        />
      </MaterialHeaderButtons>
    );
  };

  /**
   * Gets the event dashboard render item.
   * If a preview is available, it will be rendered inside
   *
   * @param content
   * @return {*}
   */
  getDashboardEvent(content: Array<PlanningEventType>) {
    const futureEvents = getFutureEvents(content);
    const displayEvent = getDisplayEvent(futureEvents);
    // const clickPreviewAction = () =>
    //     this.props.navigation.navigate('students', {
    //         screen: 'planning-information',
    //         params: {data: displayEvent}
    //     });
    return (
      <DashboardItem
        eventNumber={futureEvents.length}
        clickAction={this.onEventContainerClick}>
        <PreviewEventDashboardItem
          event={displayEvent}
          clickAction={this.onEventContainerClick}
        />
      </DashboardItem>
    );
  }

  /**
   * Gets a dashboard item with a row of shortcut buttons.
   *
   * @param content
   * @return {*}
   */
  getDashboardRow(content: Array<ServiceItemType | null>) {
    return (
      <FlatList
        data={content}
        renderItem={this.getDashboardRowRenderItem}
        horizontal
        contentContainerStyle={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 10,
          marginBottom: 10,
        }}
      />
    );
  }

  /**
   * Gets a dashboard shortcut item
   *
   * @param item
   * @returns {*}
   */
  getDashboardRowRenderItem = ({item}: {item: ServiceItemType | null}) => {
    if (item != null) {
      return (
        <SmallDashboardItem
          image={item.image}
          onPress={item.onPress}
          badgeCount={
            this.currentDashboard != null && item.badgeFunction != null
              ? item.badgeFunction(this.currentDashboard)
              : undefined
          }
        />
      );
    }
    return <SmallDashboardItem />;
  };

  /**
   * Gets a render item for the given feed object
   *
   * @param item The feed item to display
   * @return {*}
   */
  getFeedItem(item: FeedItemType) {
    return <FeedItem item={item} height={FEED_ITEM_HEIGHT} />;
  }

  /**
   * Gets a FlatList render item
   *
   * @param item The item to display
   * @param section The current section
   * @return {*}
   */
  getRenderItem = ({item}: {item: FeedItemType}) => this.getFeedItem(item);

  getRenderSectionHeader = (
    data: {
      section: {
        data: Array<object>;
        title: string;
      };
    },
    isLoading: boolean,
  ) => {
    const {props} = this;
    if (data.section.data.length > 0) {
      return (
        <Headline
          style={{
            textAlign: 'center',
            marginTop: 50,
            marginBottom: 10,
          }}>
          {data.section.title}
        </Headline>
      );
    }
    return (
      <View>
        <Headline
          style={{
            textAlign: 'center',
            marginTop: 50,
            marginBottom: 10,
            marginLeft: 20,
            marginRight: 20,
            color: props.theme.colors.textDisabled,
          }}>
          {data.section.title}
        </Headline>
        {isLoading ? (
          <ActivityIndicator
            style={{
              marginTop: 10,
            }}
          />
        ) : (
          <MaterialCommunityIcons
            name="access-point-network-off"
            size={100}
            color={props.theme.colors.textDisabled}
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        )}
      </View>
    );
  };

  getListHeader = (fetchedData: RawDashboardType) => {
    let dashboard = null;
    if (fetchedData != null) {
      dashboard = fetchedData.dashboard;
    }
    return (
      <Animatable.View animation="fadeInDown" duration={500} useNativeDriver>
        <ActionsDashBoardItem />
        {this.getDashboardRow(this.dashboardManager.getCurrentDashboard())}
        {this.getDashboardEvent(
          dashboard == null ? [] : dashboard.today_events,
        )}
      </Animatable.View>
    );
  };

  /**
   * Navigates to the a new screen if navigation parameters specify one
   */
  handleNavigationParams = () => {
    const {props} = this;
    if (props.route.params != null) {
      if (props.route.params.nextScreen != null) {
        props.navigation.navigate(
          props.route.params.nextScreen,
          props.route.params.data,
        );
        // reset params to prevent infinite loop
        props.navigation.dispatch(CommonActions.setParams({nextScreen: null}));
      }
    }
  };

  showDisconnectDialog = (): void => this.setState({dialogVisible: true});

  hideDisconnectDialog = (): void => this.setState({dialogVisible: false});

  openScanner = () => {
    const {props} = this;
    props.navigation.navigate('scanner');
  };

  /**
   * Creates the dataset to be used in the FlatList
   *
   * @param fetchedData
   * @param isLoading
   * @return {*}
   */
  createDataset = (
    fetchedData: RawDashboardType | null,
    isLoading: boolean,
  ): Array<{
    title: string;
    data: [] | Array<FeedItemType>;
    id: string;
  }> => {
    // fetchedData = DATA;
    if (fetchedData != null) {
      if (fetchedData.news_feed != null) {
        this.currentNewFeed = HomeScreen.generateNewsFeed(
          fetchedData.news_feed,
        );
      }
      if (fetchedData.dashboard != null) {
        this.currentDashboard = fetchedData.dashboard;
      }
    }
    if (this.currentNewFeed.length > 0) {
      return [
        {
          title: i18n.t('screens.home.feedTitle'),
          data: this.currentNewFeed,
          id: SECTIONS_ID[1],
        },
      ];
    }
    return [
      {
        title: isLoading
          ? i18n.t('screens.home.feedLoading')
          : i18n.t('screens.home.feedError'),
        data: [],
        id: SECTIONS_ID[1],
      },
    ];
  };

  onEventContainerClick = () => {
    const {props} = this;
    props.navigation.navigate('planning');
  };

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (this.fabRef.current) {
      this.fabRef.current.onScroll(event);
    }
  };

  /**
   * Callback when pressing the login button on the banner.
   * This hides the banner and takes the user to the login page.
   */
  onLogin = () => {
    const {props} = this;
    props.navigation.navigate('login', {
      nextScreen: 'profile',
    });
  };

  render() {
    const {props, state} = this;
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}>
          <WebSectionList
            navigation={props.navigation}
            createDataset={this.createDataset}
            autoRefreshTime={REFRESH_TIME}
            refreshOnFocus
            fetchUrl={DATA_URL}
            renderItem={this.getRenderItem}
            itemHeight={FEED_ITEM_HEIGHT}
            onScroll={this.onScroll}
            showError={false}
            renderSectionHeader={this.getRenderSectionHeader}
            renderListHeaderComponent={this.getListHeader}
          />
        </View>
        {!this.isLoggedIn ? (
          <MascotPopup
            prefKey={AsyncStorageManager.PREFERENCES.homeShowMascot.key}
            title={i18n.t('screens.home.mascotDialog.title')}
            message={i18n.t('screens.home.mascotDialog.message')}
            icon="human-greeting"
            buttons={{
              action: {
                message: i18n.t('screens.home.mascotDialog.login'),
                icon: 'login',
                onPress: this.onLogin,
              },
              cancel: {
                message: i18n.t('screens.home.mascotDialog.later'),
                icon: 'close',
                color: props.theme.colors.warning,
              },
            }}
            emotion={MASCOT_STYLE.CUTE}
          />
        ) : null}
        <AnimatedFAB
          ref={this.fabRef}
          icon="qrcode-scan"
          onPress={this.openScanner}
        />
        <LogoutDialog
          visible={state.dialogVisible}
          onDismiss={this.hideDisconnectDialog}
        />
      </View>
    );
  }
}

export default withTheme(HomeScreen);
