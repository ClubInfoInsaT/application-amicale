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

// @flow

import * as React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import i18n from 'i18n-js';
import {Platform} from 'react-native';
import SettingsScreen from '../screens/Other/Settings/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import DebugScreen from '../screens/About/DebugScreen';
import TabNavigator from './TabNavigator';
import GameMainScreen from '../screens/Game/screens/GameMainScreen';
import VoteScreen from '../screens/Amicale/VoteScreen';
import LoginScreen from '../screens/Amicale/LoginScreen';
import SelfMenuScreen from '../screens/Services/SelfMenuScreen';
import ProximoMainScreen from '../screens/Services/Proximo/ProximoMainScreen';
import ProximoListScreen from '../screens/Services/Proximo/ProximoListScreen';
import ProximoAboutScreen from '../screens/Services/Proximo/ProximoAboutScreen';
import ProfileScreen from '../screens/Amicale/ProfileScreen';
import ClubListScreen from '../screens/Amicale/Clubs/ClubListScreen';
import ClubAboutScreen from '../screens/Amicale/Clubs/ClubAboutScreen';
import ClubDisplayScreen from '../screens/Amicale/Clubs/ClubDisplayScreen';
import {
  createScreenCollapsibleStack,
  getWebsiteStack,
} from '../utils/CollapsibleUtils';
import BugReportScreen from '../screens/Other/FeedbackScreen';
import WebsiteScreen from '../screens/Services/WebsiteScreen';
import EquipmentScreen from '../screens/Amicale/Equipment/EquipmentListScreen';
import EquipmentLendScreen from '../screens/Amicale/Equipment/EquipmentRentScreen';
import EquipmentConfirmScreen from '../screens/Amicale/Equipment/EquipmentConfirmScreen';
import DashboardEditScreen from '../screens/Other/Settings/DashboardEditScreen';
import GameStartScreen from '../screens/Game/screens/GameStartScreen';
import ImageGalleryScreen from '../screens/Media/ImageGalleryScreen';

const modalTransition =
  Platform.OS === 'ios'
    ? TransitionPresets.ModalPresentationIOS
    : TransitionPresets.ModalTransition;

const defaultScreenOptions = {
  gestureEnabled: true,
  cardOverlayEnabled: true,
  ...TransitionPresets.SlideFromRightIOS,
};

const MainStack = createStackNavigator();

function MainStackComponent(props: {
  createTabNavigator: () => React.Node,
}): React.Node {
  const {createTabNavigator} = props;
  return (
    <MainStack.Navigator
      initialRouteName="main"
      headerMode="screen"
      screenOptions={defaultScreenOptions}>
      <MainStack.Screen
        name="main"
        component={createTabNavigator}
        options={{
          headerShown: false,
          title: i18n.t('screens.home.title'),
        }}
      />
      <MainStack.Screen
        name="gallery"
        component={ImageGalleryScreen}
        options={{
          headerShown: false,
          ...modalTransition,
        }}
      />
      {createScreenCollapsibleStack(
        'settings',
        MainStack,
        SettingsScreen,
        i18n.t('screens.settings.title'),
      )}
      {createScreenCollapsibleStack(
        'dashboard-edit',
        MainStack,
        DashboardEditScreen,
        i18n.t('screens.settings.dashboardEdit.title'),
      )}
      {createScreenCollapsibleStack(
        'about',
        MainStack,
        AboutScreen,
        i18n.t('screens.about.title'),
      )}
      {createScreenCollapsibleStack(
        'dependencies',
        MainStack,
        AboutDependenciesScreen,
        i18n.t('screens.about.libs'),
      )}
      {createScreenCollapsibleStack(
        'debug',
        MainStack,
        DebugScreen,
        i18n.t('screens.about.debug'),
      )}

      {createScreenCollapsibleStack(
        'game-start',
        MainStack,
        GameStartScreen,
        i18n.t('screens.game.title'),
        true,
        null,
        'transparent',
      )}
      <MainStack.Screen
        name="game-main"
        component={GameMainScreen}
        options={{
          title: i18n.t('screens.game.title'),
        }}
      />
      {createScreenCollapsibleStack(
        'login',
        MainStack,
        LoginScreen,
        i18n.t('screens.login.title'),
        true,
        {headerTintColor: '#fff'},
        'transparent',
      )}
      {getWebsiteStack('website', MainStack, WebsiteScreen, '')}

      {createScreenCollapsibleStack(
        'self-menu',
        MainStack,
        SelfMenuScreen,
        i18n.t('screens.menu.title'),
      )}
      {createScreenCollapsibleStack(
        'proximo',
        MainStack,
        ProximoMainScreen,
        i18n.t('screens.proximo.title'),
      )}
      {createScreenCollapsibleStack(
        'proximo-list',
        MainStack,
        ProximoListScreen,
        i18n.t('screens.proximo.articleList'),
      )}
      {createScreenCollapsibleStack(
        'proximo-about',
        MainStack,
        ProximoAboutScreen,
        i18n.t('screens.proximo.title'),
        true,
        {...modalTransition},
      )}

      {createScreenCollapsibleStack(
        'profile',
        MainStack,
        ProfileScreen,
        i18n.t('screens.profile.title'),
      )}
      {createScreenCollapsibleStack(
        'club-list',
        MainStack,
        ClubListScreen,
        i18n.t('screens.clubs.title'),
      )}
      {createScreenCollapsibleStack(
        'club-information',
        MainStack,
        ClubDisplayScreen,
        i18n.t('screens.clubs.details'),
        true,
        {...modalTransition},
      )}
      {createScreenCollapsibleStack(
        'club-about',
        MainStack,
        ClubAboutScreen,
        i18n.t('screens.clubs.title'),
        true,
        {...modalTransition},
      )}
      {createScreenCollapsibleStack(
        'equipment-list',
        MainStack,
        EquipmentScreen,
        i18n.t('screens.equipment.title'),
      )}
      {createScreenCollapsibleStack(
        'equipment-rent',
        MainStack,
        EquipmentLendScreen,
        i18n.t('screens.equipment.book'),
      )}
      {createScreenCollapsibleStack(
        'equipment-confirm',
        MainStack,
        EquipmentConfirmScreen,
        i18n.t('screens.equipment.confirm'),
      )}
      {createScreenCollapsibleStack(
        'vote',
        MainStack,
        VoteScreen,
        i18n.t('screens.vote.title'),
      )}
      {createScreenCollapsibleStack(
        'feedback',
        MainStack,
        BugReportScreen,
        i18n.t('screens.feedback.title'),
      )}
    </MainStack.Navigator>
  );
}

type PropsType = {
  defaultHomeRoute: string | null,
  // eslint-disable-next-line flowtype/no-weak-types
  defaultHomeData: {[key: string]: string},
};

export default class MainNavigator extends React.Component<PropsType> {
  createTabNavigator: () => React.Node;

  constructor(props: PropsType) {
    super(props);
    this.createTabNavigator = (): React.Node => (
      <TabNavigator
        defaultHomeRoute={props.defaultHomeRoute}
        defaultHomeData={props.defaultHomeData}
      />
    );
  }

  render(): React.Node {
    return <MainStackComponent createTabNavigator={this.createTabNavigator} />;
  }
}
