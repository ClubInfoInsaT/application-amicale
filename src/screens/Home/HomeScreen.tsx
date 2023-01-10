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

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionListData,
  StyleSheet,
} from 'react-native';
import i18n from 'i18n-js';
import { Headline, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import { View } from 'react-native-animatable';
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
import LogoutDialog from '../../components/Amicale/LogoutDialog';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import { getDisplayEvent, getFutureEvents } from '../../utils/Home';
import type { PlanningEventType } from '../../utils/Planning';
import GENERAL_STYLES from '../../constants/Styles';
import Urls from '../../constants/Urls';
import { readData } from '../../utils/WebData';
import { TabRoutes, TabStackParamsList } from '../../navigation/TabNavigator';
import { ServiceItemType } from '../../utils/Services';
import { useCurrentDashboard } from '../../context/preferencesContext';
import { MainRoutes } from '../../navigation/MainNavigator';
import { useLoginState } from '../../context/loginContext';
import { getPreferenceNumber, PreferenceKeys } from '../../utils/asyncStorage';
import { useNotificationPreferences } from '../../context/preferencesContext';
import PushNotification from 'react-native-push-notification';

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
  today_menu: Array<{ [key: string]: object }>;
  proximo_articles: number;
  available_dryers: number;
  available_washers: number;
  today_events: Array<PlanningEventType>;
  available_tutorials: number;
  latest_notification: number;
};

type RawNewsFeedType = { [key: string]: Array<FeedItemType> };

type RawDashboardType = {
  news_feed: RawNewsFeedType;
  dashboard: FullDashboardType;
};

type Props = StackScreenProps<TabStackParamsList, TabRoutes.Home>;

const styles = StyleSheet.create({
  dashboardRow: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  sectionHeaderEmpty: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  activityIndicator: {
    marginTop: 10,
  },
  content: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

const sortFeedTime = (a: FeedItemType, b: FeedItemType): number =>
  b.time - a.time;

const generateNewsFeed = (rawFeed: RawNewsFeedType): Array<FeedItemType> => {
  const finalFeed: Array<FeedItemType> = [];
  Object.keys(rawFeed).forEach((key: string) => {
    const category: Array<FeedItemType> | null = rawFeed[key];
    if (category != null && category.length > 0) {
      finalFeed.push(...category);
    }
  });
  finalFeed.sort(sortFeedTime);
  return finalFeed;
};

function HomeScreen(props: Props) {
  const theme = useTheme();
  const navigation = useNavigation();

  const [dialogVisible, setDialogVisible] = useState(false);
  const fabRef = useRef<AnimatedFAB>(null);
  const pageLoaded = useRef(false);

  const isLoggedIn = useLoginState();
  const { currentDashboard } = useCurrentDashboard();
  const { preferences, updatePreferences } = useNotificationPreferences();

  let homeDashboard: FullDashboardType | null = null;

  function onRegister({ token }: { token: string }) {
    console.log('TOKEN:', token);
    PushNotification.subscribeToTopic('amicale');
    // Store token
    updatePreferences(PreferenceKeys.firebaseToken, token);
  }

  /* Listen for new token and save it
  // @ts-ignore */
  PushNotification.onRegister = onRegister;

  useLayoutEffect(() => {
    const getHeaderButton = () => {
      let onPressLog = () =>
        navigation.navigate(MainRoutes.Login, { nextScreen: 'profile' });
      // let onPressBell = () => navigation.navigate(MainRoutes.Notifications);
      let logIcon = 'login';
      let logColor = theme.colors.primary;
      if (isLoggedIn) {
        onPressLog = () => showDisconnectDialog();
        logIcon = 'logout';
        logColor = theme.colors.text;
      }
      // let lastSeenNotification = getPreferenceNumber(
      //   PreferenceKeys.latestNotification,
      //   preferences
      // ); // Id of the most recent notification seen in the Notification Screen
      // let newNotification = // Whether the latest notification is more recent
      //   homeDashboard !== null &&
      //   homeDashboard.latest_notification !== undefined &&
      //   (homeDashboard.latest_notification > Number(lastSeenNotification) ||
      //     lastSeenNotification === undefined);

      return (
        <MaterialHeaderButtons>
          <Item
            title={'log'}
            iconName={logIcon}
            color={logColor}
            onPress={onPressLog}
          />
          <Item
            title={'notifications'}
            // iconName={newNotification ? 'bell-ring' : 'bell-outline'}
            // color={newNotification ? theme.colors.primary : theme.colors.text}
            // onPress={onPressBell}
            iconName={'bell-outline'}
            color={theme.colors.disabled}
          />
          <Item
            title={i18n.t('screens.settings.title')}
            iconName={'cog'}
            onPress={() => navigation.navigate(MainRoutes.Settings)}
          />
        </MaterialHeaderButtons>
      );
    };
    navigation.setOptions({
      headerRight: getHeaderButton,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, isLoggedIn]);

  useEffect(() => {
    if (!pageLoaded.current) {
      const { route } = props;
      if (route.params != null) {
        if (route.params.route != null) {
          pageLoaded.current = true;
          navigation.navigate(route.params.route, route.params.data);
          // reset params to prevent infinite loop
          navigation.setParams({ route: null, data: null });
        }
      }
    }
  }, [navigation, props, pageLoaded]);

  /**
   * Gets the event dashboard render item.
   * If a preview is available, it will be rendered inside
   *
   * @param content
   * @return {*}
   */
  const getDashboardEvent = (content: Array<PlanningEventType>) => {
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
        clickAction={onEventContainerClick}
      >
        <PreviewEventDashboardItem
          event={displayEvent}
          clickAction={onEventContainerClick}
        />
      </DashboardItem>
    );
  };

  /**
   * Gets a dashboard item with a row of shortcut buttons.
   *
   * @param content
   * @return {*}
   */
  const getDashboardRow = (content: Array<ServiceItemType | undefined>) => {
    return (
      <FlatList
        data={content}
        renderItem={getDashboardRowRenderItem}
        horizontal
        contentContainerStyle={styles.dashboardRow}
      />
    );
  };

  /**
   * Gets a dashboard shortcut item
   *
   * @param item
   * @returns {*}
   */
  const getDashboardRowRenderItem = ({
    item,
  }: {
    item: ServiceItemType | undefined;
  }) => {
    if (item != null) {
      return (
        <SmallDashboardItem
          image={item.image}
          onPress={item.onPress}
          badgeCount={
            homeDashboard != null && item.badgeFunction != null
              ? item.badgeFunction(homeDashboard)
              : undefined
          }
        />
      );
    }
    return <SmallDashboardItem />;
  };

  const getRenderItem = ({ item }: { item: FeedItemType }) => (
    <FeedItem item={item} height={FEED_ITEM_HEIGHT} />
  );

  const getRenderSectionHeader = (data: {
    section: SectionListData<FeedItemType>;
  }) => {
    const icon = data.section.icon;
    if (data.section.data.length > 0) {
      return (
        <Headline style={styles.sectionHeader}>{data.section.title}</Headline>
      );
    }
    return (
      <View>
        <Headline
          style={{
            ...styles.sectionHeaderEmpty,
            color: theme.colors.textDisabled,
          }}
        >
          {data.section.title}
        </Headline>
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={100}
            color={theme.colors.textDisabled}
            style={GENERAL_STYLES.center}
          />
        ) : null}
      </View>
    );
  };

  const getListHeader = (fetchedData: RawDashboardType | undefined) => {
    let dashboard = null;
    if (fetchedData != null) {
      dashboard = fetchedData.dashboard;
    }
    return (
      <Animatable.View animation="fadeInDown" duration={500} useNativeDriver>
        <ActionsDashBoardItem />
        {getDashboardRow(currentDashboard)}
        {getDashboardEvent(dashboard == null ? [] : dashboard.today_events)}
      </Animatable.View>
    );
  };

  const showDisconnectDialog = () => setDialogVisible(true);

  const hideDisconnectDialog = () => setDialogVisible(false);

  const openScanner = () => navigation.navigate(MainRoutes.Scanner);

  /**
   * Creates the dataset to be used in the FlatList
   *
   * @param fetchedData
   * @param isLoading
   * @return {*}
   */
  const createDataset = (
    fetchedData: RawDashboardType | undefined,
    isLoading: boolean
  ): Array<{
    title: string;
    data: [] | Array<FeedItemType>;
    icon?: string;
    id: string;
  }> => {
    let currentNewFeed: Array<FeedItemType> = [];
    if (fetchedData) {
      if (fetchedData.news_feed) {
        currentNewFeed = generateNewsFeed(fetchedData.news_feed);
      }
      if (fetchedData.dashboard) {
        homeDashboard = fetchedData.dashboard;
      }
    }
    if (currentNewFeed.length > 0) {
      return [
        {
          title: i18n.t('screens.home.feedTitle'),
          data: currentNewFeed,
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
        icon: isLoading ? undefined : 'access-point-network-off',
        id: SECTIONS_ID[1],
      },
    ];
  };

  const onEventContainerClick = () => navigation.navigate(TabRoutes.Planning);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (fabRef.current) {
      fabRef.current.onScroll(event);
    }
  };

  /**
   * Callback when pressing the login button on the banner.
   * This hides the banner and takes the user to the login page.
   */
  const onLogin = () =>
    navigation.navigate(MainRoutes.Login, {
      nextScreen: 'profile',
    });

  return (
    <View style={GENERAL_STYLES.flex}>
      <View style={styles.content}>
        <WebSectionList
          request={() => readData<RawDashboardType>(Urls.app.dashboard)}
          createDataset={createDataset}
          autoRefreshTime={REFRESH_TIME}
          refreshOnFocus={true}
          renderItem={getRenderItem}
          itemHeight={FEED_ITEM_HEIGHT}
          onScroll={onScroll}
          renderSectionHeader={getRenderSectionHeader}
          renderListHeaderComponent={getListHeader}
        />
      </View>
      {!isLoggedIn ? (
        <MascotPopup
          title={i18n.t('screens.home.mascotDialog.title')}
          message={i18n.t('screens.home.mascotDialog.message')}
          icon="human-greeting"
          buttons={{
            action: {
              message: i18n.t('screens.home.mascotDialog.login'),
              icon: 'login',
              onPress: onLogin,
            },
            cancel: {
              message: i18n.t('screens.home.mascotDialog.later'),
              icon: 'close',
              color: theme.colors.warning,
            },
          }}
          emotion={MASCOT_STYLE.CUTE}
        />
      ) : null}
      <AnimatedFAB ref={fabRef} icon="qrcode-scan" onPress={openScanner} />
      <LogoutDialog visible={dialogVisible} onDismiss={hideDisconnectDialog} />
    </View>
  );
}

export default HomeScreen;
