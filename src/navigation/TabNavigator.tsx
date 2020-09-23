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
  CreateScreenCollapsibleStack,
  getWebsiteStack,
} from '../utils/CollapsibleUtils';
import Mascot, {MASCOT_STYLE} from '../components/Mascot/Mascot';

const modalTransition =
  Platform.OS === 'ios'
    ? TransitionPresets.ModalPresentationIOS
    : TransitionPresets.ModalTransition;

const defaultScreenOptions = {
  gestureEnabled: true,
  cardOverlayEnabled: true,
  ...modalTransition,
};

const ServicesStack = createStackNavigator();

function ServicesStackComponent() {
  return (
    <ServicesStack.Navigator
      initialRouteName="index"
      headerMode="screen"
      screenOptions={defaultScreenOptions}>
      {CreateScreenCollapsibleStack(
        'index',
        ServicesStack,
        WebsitesHomeScreen,
        i18n.t('screens.services.title'),
      )}
      {CreateScreenCollapsibleStack(
        'services-section',
        ServicesStack,
        ServicesSectionScreen,
        'SECTION',
      )}
      {CreateScreenCollapsibleStack(
        'amicale-contact',
        ServicesStack,
        AmicaleContactScreen,
        i18n.t('screens.amicaleAbout.title'),
      )}
    </ServicesStack.Navigator>
  );
}

const ProxiwashStack = createStackNavigator();

function ProxiwashStackComponent() {
  return (
    <ProxiwashStack.Navigator
      initialRouteName="index"
      headerMode="screen"
      screenOptions={defaultScreenOptions}>
      {CreateScreenCollapsibleStack(
        'index',
        ProxiwashStack,
        ProxiwashScreen,
        i18n.t('screens.proxiwash.title'),
      )}
      {CreateScreenCollapsibleStack(
        'proxiwash-about',
        ProxiwashStack,
        ProxiwashAboutScreen,
        i18n.t('screens.proxiwash.title'),
      )}
    </ProxiwashStack.Navigator>
  );
}

const PlanningStack = createStackNavigator();

function PlanningStackComponent() {
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
      {CreateScreenCollapsibleStack(
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
) {
  let params;
  if (initialRoute) {
    params = {data: defaultData, nextScreen: initialRoute, shouldOpen: true};
  }
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
            headerTitle: () => (
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

      {CreateScreenCollapsibleStack(
        'club-information',
        HomeStack,
        ClubDisplayScreen,
        i18n.t('screens.clubs.details'),
      )}
      {CreateScreenCollapsibleStack(
        'feed-information',
        HomeStack,
        FeedItemScreen,
        i18n.t('screens.home.feed'),
      )}
      {CreateScreenCollapsibleStack(
        'planning-information',
        HomeStack,
        PlanningDisplayScreen,
        i18n.t('screens.planning.eventDetails'),
      )}
    </HomeStack.Navigator>
  );
}

const PlanexStack = createStackNavigator();

function PlanexStackComponent() {
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
      {CreateScreenCollapsibleStack(
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
  defaultHomeRoute: string | null;
  defaultHomeData: {[key: string]: string};
};

export default class TabNavigator extends React.Component<PropsType> {
  defaultRoute: string;
  createHomeStackComponent: () => any;

  constructor(props: PropsType) {
    super(props);
    this.defaultRoute = 'home';
    if (!props.defaultHomeRoute) {
      this.defaultRoute = AsyncStorageManager.getString(
        AsyncStorageManager.PREFERENCES.defaultStartScreen.key,
      ).toLowerCase();
    }
    this.createHomeStackComponent = () =>
      HomeStackComponent(props.defaultHomeRoute, props.defaultHomeData);
  }

  render() {
    return (
      <Tab.Navigator
        initialRouteName={this.defaultRoute}
        tabBar={(tabProps) => <CustomTabBar {...tabProps} />}>
        <Tab.Screen
          name="services"
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
