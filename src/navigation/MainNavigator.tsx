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
  CreateScreenCollapsibleStack,
  getWebsiteStack,
} from '../utils/CollapsibleUtils';
import BugReportScreen from '../screens/Other/FeedbackScreen';
import WebsiteScreen from '../screens/Services/WebsiteScreen';
import EquipmentScreen, {
  DeviceType,
} from '../screens/Amicale/Equipment/EquipmentListScreen';
import EquipmentLendScreen from '../screens/Amicale/Equipment/EquipmentRentScreen';
import EquipmentConfirmScreen from '../screens/Amicale/Equipment/EquipmentConfirmScreen';
import DashboardEditScreen from '../screens/Other/Settings/DashboardEditScreen';
import GameStartScreen from '../screens/Game/screens/GameStartScreen';
import ImageGalleryScreen from '../screens/Media/ImageGalleryScreen';

export enum MainRoutes {
  Main = 'main',
  Gallery = 'gallery',
  Settings = 'settings',
  DashboardEdit = 'dashboard-edit',
  About = 'about',
  Dependencies = 'dependencies',
  Debug = 'debug',
  GameStart = 'game-start',
  GameMain = 'game-main',
  Login = 'login',
  SelfMenu = 'self-menu',
  Proximo = 'proximo',
  ProximoList = 'proximo-list',
  ProximoAbout = 'proximo-about',
  Profile = 'profile',
  ClubList = 'club-list',
  ClubInformation = 'club-information',
  ClubAbout = 'club-about',
  EquipmentList = 'equipment-list',
  EquipmentRent = 'equipment-rent',
  EquipmentConfirm = 'equipment-confirm',
  Vote = 'vote',
  Feedback = 'feedback',
}

type DefaultParams = {[key in MainRoutes]: object | undefined};

export interface FullParamsList extends DefaultParams {
  login: {nextScreen: string};
  'equipment-confirm': {
    item?: DeviceType;
    dates: [string, string];
  };
  'equipment-rent': {item?: DeviceType};
  gallery: {images: Array<{url: string}>};
}

// Don't know why but TS is complaining without this
// See: https://stackoverflow.com/questions/63652687/interface-does-not-satisfy-the-constraint-recordstring-object-undefined
export type MainStackParamsList = FullParamsList &
  Record<string, object | undefined>;

const modalTransition =
  Platform.OS === 'ios'
    ? TransitionPresets.ModalPresentationIOS
    : TransitionPresets.ModalTransition;

const defaultScreenOptions = {
  gestureEnabled: true,
  cardOverlayEnabled: true,
  ...TransitionPresets.SlideFromRightIOS,
};

const MainStack = createStackNavigator<MainStackParamsList>();

function MainStackComponent(props: {createTabNavigator: () => JSX.Element}) {
  const {createTabNavigator} = props;
  return (
    <MainStack.Navigator
      initialRouteName={MainRoutes.Main}
      headerMode="screen"
      screenOptions={defaultScreenOptions}>
      <MainStack.Screen
        name={MainRoutes.Main}
        component={createTabNavigator}
        options={{
          headerShown: false,
          title: i18n.t('screens.home.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Gallery}
        component={ImageGalleryScreen}
        options={{
          headerShown: false,
          ...modalTransition,
        }}
      />
      {CreateScreenCollapsibleStack(
        MainRoutes.Settings,
        MainStack,
        SettingsScreen,
        i18n.t('screens.settings.title'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.DashboardEdit,
        MainStack,
        DashboardEditScreen,
        i18n.t('screens.settings.dashboardEdit.title'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.About,
        MainStack,
        AboutScreen,
        i18n.t('screens.about.title'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.Dependencies,
        MainStack,
        AboutDependenciesScreen,
        i18n.t('screens.about.libs'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.Debug,
        MainStack,
        DebugScreen,
        i18n.t('screens.about.debug'),
      )}

      {CreateScreenCollapsibleStack(
        MainRoutes.GameStart,
        MainStack,
        GameStartScreen,
        i18n.t('screens.game.title'),
        true,
        undefined,
        'transparent',
      )}
      <MainStack.Screen
        name={MainRoutes.GameMain}
        component={GameMainScreen}
        options={{
          title: i18n.t('screens.game.title'),
        }}
      />
      {CreateScreenCollapsibleStack(
        MainRoutes.Login,
        MainStack,
        LoginScreen,
        i18n.t('screens.login.title'),
        true,
        {headerTintColor: '#fff'},
        'transparent',
      )}
      {getWebsiteStack('website', MainStack, WebsiteScreen, '')}

      {CreateScreenCollapsibleStack(
        MainRoutes.SelfMenu,
        MainStack,
        SelfMenuScreen,
        i18n.t('screens.menu.title'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.Proximo,
        MainStack,
        ProximoMainScreen,
        i18n.t('screens.proximo.title'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.ProximoList,
        MainStack,
        ProximoListScreen,
        i18n.t('screens.proximo.articleList'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.ProximoAbout,
        MainStack,
        ProximoAboutScreen,
        i18n.t('screens.proximo.title'),
        true,
        {...modalTransition},
      )}

      {CreateScreenCollapsibleStack(
        MainRoutes.Profile,
        MainStack,
        ProfileScreen,
        i18n.t('screens.profile.title'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.ClubList,
        MainStack,
        ClubListScreen,
        i18n.t('screens.clubs.title'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.ClubInformation,
        MainStack,
        ClubDisplayScreen,
        i18n.t('screens.clubs.details'),
        true,
        {...modalTransition},
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.ClubAbout,
        MainStack,
        ClubAboutScreen,
        i18n.t('screens.clubs.title'),
        true,
        {...modalTransition},
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.EquipmentList,
        MainStack,
        EquipmentScreen,
        i18n.t('screens.equipment.title'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.EquipmentRent,
        MainStack,
        EquipmentLendScreen,
        i18n.t('screens.equipment.book'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.EquipmentConfirm,
        MainStack,
        EquipmentConfirmScreen,
        i18n.t('screens.equipment.confirm'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.Vote,
        MainStack,
        VoteScreen,
        i18n.t('screens.vote.title'),
      )}
      {CreateScreenCollapsibleStack(
        MainRoutes.Feedback,
        MainStack,
        BugReportScreen,
        i18n.t('screens.feedback.title'),
      )}
    </MainStack.Navigator>
  );
}

type PropsType = {
  defaultHomeRoute: string | null;
  defaultHomeData: {[key: string]: string};
};

export default function MainNavigator(props: PropsType) {
  return (
    <MainStackComponent
      createTabNavigator={() => <TabNavigator {...props} />}
    />
  );
}
