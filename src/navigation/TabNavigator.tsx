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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Title, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import i18n from 'i18n-js';
import { View } from 'react-native-animatable';
import HomeScreen from '../screens/Home/HomeScreen';
import PlanningScreen from '../screens/Planning/PlanningScreen';
import ProxiwashScreen from '../screens/Proxiwash/ProxiwashScreen';
import PlanexScreen from '../screens/Planex/PlanexScreen';
import CustomTabBar from '../components/Tabbar/CustomTabBar';
import WebsitesHomeScreen from '../screens/Services/ServicesScreen';
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

  let params;
  if (props.defaultHomeRoute) {
    params = {
      data: props.defaultHomeData,
      nextScreen: props.defaultHomeRoute,
      shouldOpen: true,
    };
  }
  const { colors } = useTheme();

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
        component={WebsitesHomeScreen}
        options={{ title: i18n.t('screens.services.title') }}
      />
      <Tab.Screen
        name={'proxiwash'}
        component={ProxiwashScreen}
        options={{ title: i18n.t('screens.proxiwash.title') }}
      />
      <Tab.Screen
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
      <Tab.Screen
        name={'events'}
        component={PlanningScreen}
        options={{ title: i18n.t('screens.planning.title') }}
      />
      <Tab.Screen
        name={'planex'}
        component={PlanexScreen}
        options={{
          title: i18n.t('screens.planex.title'),
        }}
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
