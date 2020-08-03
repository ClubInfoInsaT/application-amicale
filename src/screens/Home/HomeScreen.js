// @flow

import * as React from 'react';
import {FlatList} from 'react-native';
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
import type {CustomTheme} from '../../managers/ThemeManager';
import ConnectionManager from '../../managers/ConnectionManager';
import LogoutDialog from '../../components/Amicale/LogoutDialog';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import DashboardManager from '../../managers/DashboardManager';
import type {ServiceItemType} from '../../managers/ServicesManager';
import {getDisplayEvent, getFutureEvents} from '../../utils/Home';
// import DATA from "../dashboard_data.json";

const NAME_AMICALE = 'Amicale INSA Toulouse';
const DATA_URL =
  'https://etud.insa-toulouse.fr/~amicale_app/v2/dashboard/dashboard_data.json';
const FEED_ITEM_HEIGHT = 500;

const SECTIONS_ID = ['dashboard', 'news_feed'];

const REFRESH_TIME = 1000 * 20; // Refresh every 20 seconds

export type FeedItemType = {
  full_picture: string,
  message: string,
  permalink_url: string,
  created_time: number,
  id: string,
};

export type EventType = {
  id: number,
  title: string,
  logo: string | null,
  date_begin: string,
  date_end: string,
  description: string,
  club: string,
  category_id: number,
  url: string,
};

export type FullDashboardType = {
  today_menu: Array<{[key: string]: {...}}>,
  proximo_articles: number,
  available_dryers: number,
  available_washers: number,
  today_events: Array<EventType>,
  available_tutorials: number,
};

type RawDashboardType = {
  news_feed: {
    data: Array<FeedItemType>,
  },
  dashboard: FullDashboardType,
};

type PropsType = {
  navigation: StackNavigationProp,
  route: {params: {nextScreen: string, data: {...}}},
  theme: CustomTheme,
};

type StateType = {
  dialogVisible: boolean,
};

/**
 * Class defining the app's home screen
 */
class HomeScreen extends React.Component<PropsType, StateType> {
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
   * Converts a dateString using Unix Timestamp to a formatted date
   *
   * @param dateString {string} The Unix Timestamp representation of a date
   * @return {string} The formatted output date
   */
  static getFormattedDate(dateString: number): string {
    const date = new Date(dateString * 1000);
    return date.toLocaleString();
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
  getHeaderButton = (): React.Node => {
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
  getDashboardEvent(content: Array<EventType>): React.Node {
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
   * Gets a dashboard item with action buttons
   *
   * @returns {*}
   */
  getDashboardActions(): React.Node {
    const {props} = this;
    return (
      <ActionsDashBoardItem
        navigation={props.navigation}
        isLoggedIn={this.isLoggedIn}
      />
    );
  }

  /**
   * Gets a dashboard item with a row of shortcut buttons.
   *
   * @param content
   * @return {*}
   */
  getDashboardRow(content: Array<ServiceItemType | null>): React.Node {
    return (
      // $FlowFixMe
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
  getDashboardRowRenderItem = ({
    item,
  }: {
    item: ServiceItemType | null,
  }): React.Node => {
    if (item != null)
      return (
        <SmallDashboardItem
          image={item.image}
          onPress={item.onPress}
          badgeCount={
            this.currentDashboard != null && item.badgeFunction != null
              ? item.badgeFunction(this.currentDashboard)
              : null
          }
        />
      );
    return <SmallDashboardItem image={null} onPress={null} badgeCount={null} />;
  };

  /**
   * Gets a render item for the given feed object
   *
   * @param item The feed item to display
   * @return {*}
   */
  getFeedItem(item: FeedItemType): React.Node {
    const {props} = this;
    return (
      <FeedItem
        navigation={props.navigation}
        item={item}
        title={NAME_AMICALE}
        subtitle={HomeScreen.getFormattedDate(item.created_time)}
        height={FEED_ITEM_HEIGHT}
      />
    );
  }

  /**
   * Gets a FlatList render item
   *
   * @param item The item to display
   * @param section The current section
   * @return {*}
   */
  getRenderItem = ({item}: {item: FeedItemType}): React.Node =>
    this.getFeedItem(item);

  getRenderSectionHeader = (
    data: {
      section: {
        data: Array<{...}>,
        title: string,
      },
    },
    isLoading: boolean,
  ): React.Node => {
    const {props} = this;
    if (data.section.data.length > 0)
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

  getListHeader = (fetchedData: RawDashboardType): React.Node => {
    let dashboard = null;
    if (fetchedData != null) dashboard = fetchedData.dashboard;
    return (
      <Animatable.View animation="fadeInDown" duration={500} useNativeDriver>
        {this.getDashboardActions()}
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
    title: string,
    data: [] | Array<FeedItemType>,
    id: string,
  }> => {
    // fetchedData = DATA;
    if (fetchedData != null) {
      if (fetchedData.news_feed != null)
        this.currentNewFeed = fetchedData.news_feed.data;
      if (fetchedData.dashboard != null)
        this.currentDashboard = fetchedData.dashboard;
    }
    if (this.currentNewFeed.length > 0)
      return [
        {
          title: i18n.t('screens.home.feedTitle'),
          data: this.currentNewFeed,
          id: SECTIONS_ID[1],
        },
      ];
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

  onScroll = (event: SyntheticEvent<EventTarget>) => {
    if (this.fabRef.current != null) this.fabRef.current.onScroll(event);
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

  render(): React.Node {
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
            prefKey={AsyncStorageManager.PREFERENCES.homeShowBanner.key}
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
          navigation={props.navigation}
          visible={state.dialogVisible}
          onDismiss={this.hideDisconnectDialog}
        />
      </View>
    );
  }
}

export default withTheme(HomeScreen);
