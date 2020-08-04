// @flow

import * as React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Title, useTheme} from 'react-native-paper';
import {Platform} from 'react-native';
import i18n from 'i18n-js';
import {createCollapsibleStack} from 'react-navigation-collapsible';
import {View} from 'react-native-animatable';
import HomeScreen from '../screens/Home/HomeScreen';
import PlanningScreen from '../screens/Planning/PlanningScreen';
import PlanningDisplayScreen from '../screens/Planning/PlanningDisplayScreen';
import ProxiwashScreen from '../screens/Proxiwash/ProxiwashScreen';
import ProxiwashAboutScreen from '../screens/Proxiwash/ProxiwashAboutScreen';
import PlanexScreen from '../screens/Planex/PlanexScreen';
import AsyncStorageManager from '../managers/AsyncStorageManager';
import ClubDisplayScreen from '../screens/Amicale/Clubs/ClubDisplayScreen';
import ScannerScreen from '../screens/Home/ScannerScreen';
import FeedItemScreen from '../screens/Home/FeedItemScreen';
import GroupSelectionScreen from '../screens/Planex/GroupSelectionScreen';
import CustomTabBar from '../components/Tabbar/CustomTabBar';
import WebsitesHomeScreen from '../screens/Services/ServicesScreen';
import ServicesSectionScreen from '../screens/Services/ServicesSectionScreen';
import AmicaleContactScreen from '../screens/Amicale/AmicaleContactScreen';
import {
  createScreenCollapsibleStack,
  getWebsiteStack,
} from '../utils/CollapsibleUtils';
import Mascot, {MASCOT_STYLE} from '../components/Mascot/Mascot';

const modalTransition =
  Platform.OS === 'ios'
    ? TransitionPresets.ModalPresentationIOS
    : TransitionPresets.ModalSlideFromBottomIOS;

const defaultScreenOptions = {
  gestureEnabled: true,
  cardOverlayEnabled: true,
  ...modalTransition,
};

const ServicesStack = createStackNavigator();

function ServicesStackComponent(): React.Node {
  return (
    <ServicesStack.Navigator
      initialRouteName="index"
      headerMode="screen"
      screenOptions={defaultScreenOptions}>
      {createScreenCollapsibleStack(
        'index',
        ServicesStack,
        WebsitesHomeScreen,
        i18n.t('screens.services.title'),
      )}
      {createScreenCollapsibleStack(
        'services-section',
        ServicesStack,
        ServicesSectionScreen,
        'SECTION',
      )}
      {createScreenCollapsibleStack(
        'amicale-contact',
        ServicesStack,
        AmicaleContactScreen,
        i18n.t('screens.amicaleAbout.title'),
      )}
    </ServicesStack.Navigator>
  );
}

const ProxiwashStack = createStackNavigator();

function ProxiwashStackComponent(): React.Node {
  return (
    <ProxiwashStack.Navigator
      initialRouteName="index"
      headerMode="screen"
      screenOptions={defaultScreenOptions}>
      {createScreenCollapsibleStack(
        'index',
        ProxiwashStack,
        ProxiwashScreen,
        i18n.t('screens.proxiwash.title'),
      )}
      {createScreenCollapsibleStack(
        'proxiwash-about',
        ProxiwashStack,
        ProxiwashAboutScreen,
        i18n.t('screens.proxiwash.title'),
      )}
    </ProxiwashStack.Navigator>
  );
}

const PlanningStack = createStackNavigator();

function PlanningStackComponent(): React.Node {
  return (
    <PlanningStack.Navigator
      initialRouteName="index"
      headerMode="screen"
      screenOptions={defaultScreenOptions}>
      <PlanningStack.Screen
        name="index"
        component={PlanningScreen}
        options={{title: i18n.t('screens.planning.title')}}
      />
      {createScreenCollapsibleStack(
        'planning-information',
        PlanningStack,
        PlanningDisplayScreen,
        i18n.t('screens.planning.eventDetails'),
      )}
    </PlanningStack.Navigator>
  );
}

const HomeStack = createStackNavigator();

function HomeStackComponent(
  initialRoute: string | null,
  defaultData: {[key: string]: string},
): React.Node {
  let params;
  if (initialRoute != null)
    params = {data: defaultData, nextScreen: initialRoute, shouldOpen: true};
  const {colors} = useTheme();
  return (
    <HomeStack.Navigator
      initialRouteName="index"
      headerMode="screen"
      screenOptions={defaultScreenOptions}>
      {createCollapsibleStack(
        <HomeStack.Screen
          name="index"
          component={HomeScreen}
          options={{
            title: i18n.t('screens.home.title'),
            headerStyle: {
              backgroundColor: colors.surface,
            },
            headerTitle: (): React.Node => (
              <View style={{flexDirection: 'row'}}>
                <Mascot
                  style={{
                    width: 50,
                  }}
                  emotion={MASCOT_STYLE.RANDOM}
                  animated
                  entryAnimation={{
                    animation: 'bounceIn',
                    duration: 1000,
                  }}
                  loopAnimation={{
                    animation: 'pulse',
                    duration: 2000,
                    iterationCount: 'infinite',
                  }}
                />
                <Title
                  style={{
                    marginLeft: 10,
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}>
                  {i18n.t('screens.home.title')}
                </Title>
              </View>
            ),
          }}
          initialParams={params}
        />,
        {
          collapsedColor: colors.surface,
          useNativeDriver: true,
        },
      )}
      <HomeStack.Screen
        name="scanner"
        component={ScannerScreen}
        options={{title: i18n.t('screens.scanner.title')}}
      />

      {createScreenCollapsibleStack(
        'club-information',
        HomeStack,
        ClubDisplayScreen,
        i18n.t('screens.clubs.details'),
      )}
      {createScreenCollapsibleStack(
        'feed-information',
        HomeStack,
        FeedItemScreen,
        i18n.t('screens.home.feed'),
      )}
      {createScreenCollapsibleStack(
        'planning-information',
        HomeStack,
        PlanningDisplayScreen,
        i18n.t('screens.planning.eventDetails'),
      )}
    </HomeStack.Navigator>
  );
}

const PlanexStack = createStackNavigator();

function PlanexStackComponent(): React.Node {
  return (
    <PlanexStack.Navigator
      initialRouteName="index"
      headerMode="screen"
      screenOptions={defaultScreenOptions}>
      {getWebsiteStack(
        'index',
        PlanexStack,
        PlanexScreen,
        i18n.t('screens.planex.title'),
      )}
      {createScreenCollapsibleStack(
        'group-select',
        PlanexStack,
        GroupSelectionScreen,
        '',
      )}
    </PlanexStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

type PropsType = {
  defaultHomeRoute: string | null,
  defaultHomeData: {[key: string]: string},
};

export default class TabNavigator extends React.Component<PropsType> {
  createHomeStackComponent: () => React.Node;

  defaultRoute: string;

  constructor(props: PropsType) {
    super(props);
    if (props.defaultHomeRoute != null) this.defaultRoute = 'home';
    else
      this.defaultRoute = AsyncStorageManager.getString(
        AsyncStorageManager.PREFERENCES.defaultStartScreen.key,
      ).toLowerCase();
    this.createHomeStackComponent = (): React.Node =>
      HomeStackComponent(props.defaultHomeRoute, props.defaultHomeData);
  }

  render(): React.Node {
    return (
      <Tab.Navigator
        initialRouteName={this.defaultRoute}
        // eslint-disable-next-line react/jsx-props-no-spreading
        tabBar={(props: {...}): React.Node => <CustomTabBar {...props} />}>
        <Tab.Screen
          name="services"
          option
          component={ServicesStackComponent}
          options={{title: i18n.t('screens.services.title')}}
        />
        <Tab.Screen
          name="proxiwash"
          component={ProxiwashStackComponent}
          options={{title: i18n.t('screens.proxiwash.title')}}
        />
        <Tab.Screen
          name="home"
          component={this.createHomeStackComponent}
          options={{title: i18n.t('screens.home.title')}}
        />
        <Tab.Screen
          name="planning"
          component={PlanningStackComponent}
          options={{title: i18n.t('screens.planning.title')}}
        />

        <Tab.Screen
          name="planex"
          component={PlanexStackComponent}
          options={{title: i18n.t('screens.planex.title')}}
        />
      </Tab.Navigator>
    );
  }
}
