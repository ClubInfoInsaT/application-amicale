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
import i18n from 'i18n-js';
import SettingsScreen from '../screens/Other/Settings/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import DebugScreen from '../screens/About/DebugScreen';
import TabNavigator, { TabRoutes } from './TabNavigator';
import GameMainScreen from '../screens/Game/screens/GameMainScreen';
import VoteScreen from '../screens/Amicale/VoteScreen';
import LoginScreen from '../screens/Amicale/LoginScreen';
import SelfMenuScreen from '../screens/Services/SelfMenuScreen';
import ProximoMainScreen from '../screens/Services/Proximo/ProximoMainScreen';
import ProximoListScreen from '../screens/Services/Proximo/ProximoListScreen';
import ProximoAboutScreen from '../screens/Services/Proximo/ProximoAboutScreen';
import ProfileScreen from '../screens/Amicale/ProfileScreen';
import ClubListScreen, {
  ClubCategoryType,
  ClubType,
} from '../screens/Amicale/Clubs/ClubListScreen';
import ClubAboutScreen from '../screens/Amicale/Clubs/ClubAboutScreen';
import ClubDisplayScreen from '../screens/Amicale/Clubs/ClubDisplayScreen';
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
import { usePreferences } from '../context/preferencesContext';
import {
  getPreferenceBool,
  GeneralPreferenceKeys,
} from '../utils/asyncStorage';
import IntroScreen from '../screens/Intro/IntroScreen';
import { useLoginState } from '../context/loginContext';
import ProxiwashAboutScreen from '../screens/Proxiwash/ProxiwashAboutScreen';
import PlanningDisplayScreen from '../screens/Planning/PlanningDisplayScreen';
import ScannerScreen from '../screens/Home/ScannerScreen';
import FeedItemScreen from '../screens/Home/FeedItemScreen';
import GroupSelectionScreen from '../screens/Planex/GroupSelectionScreen';
import ServicesSectionScreen from '../screens/Services/ServicesSectionScreen';
import AmicaleContactScreen from '../screens/Amicale/AmicaleContactScreen';
import { FeedItemType } from '../screens/Home/HomeScreen';
import { PlanningEventType } from '../utils/Planning';
import { ServiceCategoryType } from '../utils/Services';
import { ParsedUrlDataType } from '../utils/URLHandler';

export enum MainRoutes {
  Main = 'main',
  Intro = 'Intro',
  Gallery = 'gallery',
  Settings = 'settings',
  DashboardEdit = 'dashboard-edit',
  About = 'about',
  Dependencies = 'dependencies',
  Debug = 'debug',
  GameStart = 'game',
  GameMain = 'game-main',
  Login = 'login',
  SelfMenu = 'self-menu',
  Proximo = 'proximo',
  ProximoList = 'proximo-list',
  ProximoAbout = 'proximo-about',
  ProxiwashAbout = 'proxiwash-about',
  Profile = 'profile',
  ClubList = 'club-list',
  ClubInformation = 'club-information',
  ClubAbout = 'club-about',
  EquipmentList = 'equipment',
  EquipmentRent = 'equipment-rent',
  EquipmentConfirm = 'equipment-confirm',
  Vote = 'vote',
  Feedback = 'feedback',
  Website = 'website',
  PlanningInformation = 'planning-information',
  Scanner = 'scanner',
  FeedInformation = 'feed-information',
  GroupSelect = 'group-select',
  ServicesSection = 'services-section',
  AmicaleContact = 'amicale-contact',
}

type DefaultParams = { [key in MainRoutes]: object | undefined } & {
  [key in TabRoutes]: object | undefined;
};

export type MainStackParamsList = DefaultParams & {
  [MainRoutes.Login]: { nextScreen: string };
  [MainRoutes.EquipmentConfirm]: {
    item?: DeviceType;
    dates: [string, string];
  };
  [MainRoutes.EquipmentRent]: { item?: DeviceType };
  [MainRoutes.Gallery]: { images: Array<{ url: string }> };
  [MainRoutes.ProximoList]: {
    shouldFocusSearchBar: boolean;
    category: number;
  };
  [MainRoutes.ClubInformation]: ClubInformationScreenParams;
  [MainRoutes.Website]: {
    host: string;
    path?: string;
    title: string;
  };
  [MainRoutes.FeedInformation]: {
    data: FeedItemType;
    date: string;
  };
  [MainRoutes.PlanningInformation]: PlanningInformationScreenParams;
  [MainRoutes.ServicesSection]: {
    data: ServiceCategoryType;
  };
};

export type ClubInformationScreenParams =
  | {
      type: 'full';
      data: ClubType;
      categories: Array<ClubCategoryType>;
    }
  | {
      type: 'id';
      clubId: number;
    };

export type PlanningInformationScreenParams =
  | {
      type: 'full';
      data: PlanningEventType;
    }
  | {
      type: 'id';
      eventId: number;
    };

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamsList {}
  }
}

const MainStack = createStackNavigator<MainStackParamsList>();

function getIntroScreens() {
  return (
    <>
      <MainStack.Screen
        name={MainRoutes.Intro}
        component={IntroScreen}
        options={{
          headerShown: false,
        }}
      />
    </>
  );
}

function getAmicaleScreens() {
  return (
    <>
      <MainStack.Screen
        name={MainRoutes.Profile}
        component={ProfileScreen}
        options={{
          title: i18n.t('screens.profile.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ClubList}
        component={ClubListScreen}
        options={{
          title: i18n.t('screens.clubs.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ClubInformation}
        component={ClubDisplayScreen}
        options={{
          title: i18n.t('screens.clubs.details'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ClubAbout}
        component={ClubAboutScreen}
        options={{
          title: i18n.t('screens.clubs.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.EquipmentList}
        component={EquipmentScreen}
        options={{
          title: i18n.t('screens.equipment.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.EquipmentRent}
        component={EquipmentLendScreen}
        options={{
          title: i18n.t('screens.equipment.book'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.EquipmentConfirm}
        component={EquipmentConfirmScreen}
        options={{
          title: i18n.t('screens.equipment.confirm'),
        }}
      />
    </>
  );
}

function getRegularScreens(createTabNavigator: () => React.ReactElement) {
  return (
    <>
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
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Settings}
        component={SettingsScreen}
        options={{
          title: i18n.t('screens.settings.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.DashboardEdit}
        component={DashboardEditScreen}
        options={{
          title: i18n.t('screens.settings.dashboardEdit.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.About}
        component={AboutScreen}
        options={{
          title: i18n.t('screens.about.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Dependencies}
        component={AboutDependenciesScreen}
        options={{
          title: i18n.t('screens.about.libs'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Debug}
        component={DebugScreen}
        options={{
          title: i18n.t('screens.about.debug'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.GameStart}
        component={GameStartScreen}
        options={{
          title: i18n.t('screens.game.title'),
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <MainStack.Screen
        name={MainRoutes.GameMain}
        component={GameMainScreen}
        options={{
          title: i18n.t('screens.game.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Login}
        component={LoginScreen}
        options={{
          title: i18n.t('screens.login.title'),
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Website}
        component={WebsiteScreen}
        options={{
          title: '',
        }}
      />
      <MainStack.Screen
        name={MainRoutes.SelfMenu}
        component={SelfMenuScreen}
        options={{
          title: i18n.t('screens.menu.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Proximo}
        component={ProximoMainScreen}
        options={{
          title: i18n.t('screens.proximo.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ProximoList}
        component={ProximoListScreen}
        options={{
          title: i18n.t('screens.proximo.articleList'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ProximoAbout}
        component={ProximoAboutScreen}
        options={{
          title: i18n.t('screens.proximo.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Vote}
        component={VoteScreen}
        options={{
          title: i18n.t('screens.vote.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.Feedback}
        component={BugReportScreen}
        options={{
          title: i18n.t('screens.feedback.title'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ProxiwashAbout}
        component={ProxiwashAboutScreen}
        options={{ title: i18n.t('screens.proxiwash.title') }}
      />
      <MainStack.Screen
        name={MainRoutes.PlanningInformation}
        component={PlanningDisplayScreen}
        options={{ title: i18n.t('screens.planning.eventDetails') }}
      />
      <MainStack.Screen
        name={MainRoutes.Scanner}
        component={ScannerScreen}
        options={{ title: i18n.t('screens.scanner.title') }}
      />
      <MainStack.Screen
        name={MainRoutes.FeedInformation}
        component={FeedItemScreen}
        options={{
          title: i18n.t('screens.home.feed'),
        }}
      />
      <MainStack.Screen
        name={MainRoutes.GroupSelect}
        component={GroupSelectionScreen}
        options={{
          title: '',
        }}
      />
      <MainStack.Screen
        name={MainRoutes.ServicesSection}
        component={ServicesSectionScreen}
        options={{ title: 'SECTION' }}
      />
      <MainStack.Screen
        name={MainRoutes.AmicaleContact}
        component={AmicaleContactScreen}
        options={{ title: i18n.t('screens.amicaleAbout.title') }}
      />
    </>
  );
}

function MainStackComponent(props: {
  showIntro: boolean;
  isloggedIn: boolean;
  createTabNavigator: () => React.ReactElement;
}) {
  const { showIntro, isloggedIn, createTabNavigator } = props;
  return (
    <MainStack.Navigator
      initialRouteName={showIntro ? MainRoutes.Intro : MainRoutes.Main}
      screenOptions={{
        headerMode: 'float',
      }}
    >
      {showIntro ? getIntroScreens() : getRegularScreens(createTabNavigator)}
      {isloggedIn ? getAmicaleScreens() : null}
    </MainStack.Navigator>
  );
}

type PropsType = {
  defaultData?: ParsedUrlDataType;
};

function MainNavigator(props: PropsType) {
  const { preferences } = usePreferences();
  const isloggedIn = useLoginState();
  const showIntro = getPreferenceBool(
    GeneralPreferenceKeys.showIntro,
    preferences
  );
  const createTabNavigator = () => <TabNavigator {...props} />;
  return (
    <MainStackComponent
      showIntro={showIntro !== false}
      isloggedIn={isloggedIn}
      createTabNavigator={createTabNavigator}
    />
  );
}

export default React.memo(
  MainNavigator,
  (pp: PropsType, np: PropsType) => pp.defaultData === np.defaultData
);
