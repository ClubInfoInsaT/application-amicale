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
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Title, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import i18n from 'i18n-js';
import { View } from 'react-native-animatable';
import HomeScreen from '../screens/Home/HomeScreen';
import PlanningScreen from '../screens/Planning/PlanningScreen';
import PlanningDisplayScreen from '../screens/Planning/PlanningDisplayScreen';
import ProxiwashScreen from '../screens/Proxiwash/ProxiwashScreen';
import ProxiwashAboutScreen from '../screens/Proxiwash/ProxiwashAboutScreen';
import PlanexScreen from '../screens/Planex/PlanexScreen';
import ClubDisplayScreen from '../screens/Amicale/Clubs/ClubDisplayScreen';
import ScannerScreen from '../screens/Home/ScannerScreen';
import FeedItemScreen from '../screens/Home/FeedItemScreen';
import GroupSelectionScreen from '../screens/Planex/GroupSelectionScreen';
import CustomTabBar from '../components/Tabbar/CustomTabBar';
import WebsitesHomeScreen from '../screens/Services/ServicesScreen';
import ServicesSectionScreen from '../screens/Services/ServicesSectionScreen';
import AmicaleContactScreen from '../screens/Amicale/AmicaleContactScreen';
import Mascot, { MASCOT_STYLE } from '../components/Mascot/Mascot';
import { usePreferences } from '../context/preferencesContext';
import {
  getPreferenceString,
  GeneralPreferenceKeys,
} from '../utils/asyncStorage';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
  mascot: {
    width: 50,
  },
  title: {
    marginLeft: 10,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

type DefaultParams = { [key in TabRoutes]: object | undefined };

export type FullParamsList = DefaultParams & {
  [TabRoutes.Home]: {
    nextScreen: string;
    data: Record<string, object | undefined>;
  };
};

// Don't know why but TS is complaining without this
// See: https://stackoverflow.com/questions/63652687/interface-does-not-satisfy-the-constraint-recordstring-object-undefined
export type TabStackParamsList = FullParamsList &
  Record<string, object | undefined>;

const ServicesStack = createStackNavigator();

function ServicesStackComponent() {
  return (
    <ServicesStack.Navigator
      initialRouteName={'services'}
      headerMode={'screen'}
    >
      <ServicesStack.Screen
        name={'services'}
        component={WebsitesHomeScreen}
        options={{ title: i18n.t('screens.services.title') }}
      />
      <ServicesStack.Screen
        name={'services-section'}
        component={ServicesSectionScreen}
        options={{ title: 'SECTION' }}
      />
      <ServicesStack.Screen
        name={'amicale-contact'}
        component={AmicaleContactScreen}
        options={{ title: i18n.t('screens.amicaleAbout.title') }}
      />
    </ServicesStack.Navigator>
  );
}

const ProxiwashStack = createStackNavigator();

function ProxiwashStackComponent() {
  return (
    <ProxiwashStack.Navigator
      initialRouteName={'proxiwash'}
      headerMode={'screen'}
    >
      <ProxiwashStack.Screen
        name={'proxiwash'}
        component={ProxiwashScreen}
        options={{ title: i18n.t('screens.proxiwash.title') }}
      />
      <ProxiwashStack.Screen
        name={'proxiwash-about'}
        component={ProxiwashAboutScreen}
        options={{ title: i18n.t('screens.proxiwash.title') }}
      />
    </ProxiwashStack.Navigator>
  );
}

const PlanningStack = createStackNavigator();

function PlanningStackComponent() {
  return (
    <PlanningStack.Navigator initialRouteName={'events'} headerMode={'screen'}>
      <PlanningStack.Screen
        name={'events'}
        component={PlanningScreen}
        options={{ title: i18n.t('screens.planning.title') }}
      />
      <PlanningStack.Screen
        name={'planning-information'}
        component={PlanningDisplayScreen}
        options={{ title: i18n.t('screens.planning.eventDetails') }}
      />
    </PlanningStack.Navigator>
  );
}

const HomeStack = createStackNavigator();

function HomeStackComponent(
  initialRoute?: string,
  defaultData?: { [key: string]: string }
) {
  let params;
  if (initialRoute) {
    params = { data: defaultData, nextScreen: initialRoute, shouldOpen: true };
  }
  const { colors } = useTheme();
  return (
    <HomeStack.Navigator initialRouteName={'home'} headerMode={'screen'}>
      <HomeStack.Screen
        name={'home'}
        component={HomeScreen}
        options={{
          title: i18n.t('screens.home.title'),
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTitle: (headerProps) => (
            <View style={styles.header}>
              <Mascot
                style={styles.mascot}
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
              <Title style={styles.title}>{headerProps.children}</Title>
            </View>
          ),
        }}
        initialParams={params}
      />
      <HomeStack.Screen
        name={'scanner'}
        component={ScannerScreen}
        options={{ title: i18n.t('screens.scanner.title') }}
      />
      <HomeStack.Screen
        name={'club-information'}
        component={ClubDisplayScreen}
        options={{
          title: i18n.t('screens.clubs.details'),
        }}
      />
      <HomeStack.Screen
        name={'feed-information'}
        component={FeedItemScreen}
        options={{
          title: i18n.t('screens.home.feed'),
        }}
      />
      <HomeStack.Screen
        name={'planning-information'}
        component={PlanningDisplayScreen}
        options={{
          title: i18n.t('screens.planning.eventDetails'),
        }}
      />
    </HomeStack.Navigator>
  );
}

const PlanexStack = createStackNavigator();

function PlanexStackComponent() {
  return (
    <PlanexStack.Navigator initialRouteName={'planex'} headerMode={'screen'}>
      <PlanexStack.Screen
        name={'planex'}
        component={PlanexScreen}
        options={{
          title: i18n.t('screens.planex.title'),
        }}
      />
      <PlanexStack.Screen
        name={'group-select'}
        component={GroupSelectionScreen}
        options={{
          title: '',
        }}
      />
    </PlanexStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<TabStackParamsList>();

type PropsType = {
  defaultHomeRoute?: string;
  defaultHomeData?: { [key: string]: string };
};

const ICONS: {
  [key: string]: {
    normal: string;
    focused: string;
  };
} = {
  services: {
    normal: 'account-circle-outline',
    focused: 'account-circle',
  },
  proxiwash: {
    normal: 'tshirt-crew-outline',
    focused: 'tshirt-crew',
  },
  home: {
    normal: '',
    focused: '',
  },
  events: {
    normal: 'calendar-range-outline',
    focused: 'calendar-range',
  },
  planex: {
    normal: 'clock-outline',
    focused: 'clock',
  },
};

function TabNavigator(props: PropsType) {
  const { preferences } = usePreferences();
  let defaultRoute = getPreferenceString(
    GeneralPreferenceKeys.defaultStartScreen,
    preferences
  );
  if (!defaultRoute) {
    defaultRoute = 'home';
  } else {
    defaultRoute = defaultRoute.toLowerCase();
  }

  const createHomeStackComponent = () =>
    HomeStackComponent(props.defaultHomeRoute, props.defaultHomeData);

  const LABELS: {
    [key: string]: string;
  } = {
    services: i18n.t('screens.services.title'),
    proxiwash: i18n.t('screens.proxiwash.title'),
    home: i18n.t('screens.home.title'),
    events: i18n.t('screens.planning.title'),
    planex: i18n.t('screens.planex.title'),
  };
  return (
    <Tab.Navigator
      initialRouteName={defaultRoute}
      tabBar={(tabProps) => (
        <CustomTabBar {...tabProps} labels={LABELS} icons={ICONS} />
      )}
    >
      <Tab.Screen
        name={'services'}
        component={ServicesStackComponent}
        options={{ title: i18n.t('screens.services.title') }}
      />
      <Tab.Screen
        name={'proxiwash'}
        component={ProxiwashStackComponent}
        options={{ title: i18n.t('screens.proxiwash.title') }}
      />
      <Tab.Screen
        name={'home'}
        component={createHomeStackComponent}
        options={{ title: i18n.t('screens.home.title') }}
      />
      <Tab.Screen
        name={'events'}
        component={PlanningStackComponent}
        options={{ title: i18n.t('screens.planning.title') }}
      />
      <Tab.Screen
        name={'planex'}
        component={PlanexStackComponent}
        options={{ title: i18n.t('screens.planex.title') }}
      />
    </Tab.Navigator>
  );
}

export default React.memo(
  TabNavigator,
  (pp: PropsType, np: PropsType) =>
    pp.defaultHomeRoute === np.defaultHomeRoute &&
    pp.defaultHomeData === np.defaultHomeData
);

export enum TabRoutes {
  Services = 'services',
  Proxiwash = 'proxiwash',
  Home = 'home',
  Planning = 'events',
  Planex = 'planex',
}
