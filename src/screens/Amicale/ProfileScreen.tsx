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

import React, { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import LogoutDialog from '../../components/Amicale/LogoutDialog';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import GENERAL_STYLES from '../../constants/Styles';
import RequestScreen from '../../components/Screens/RequestScreen';
import ProfileWelcomeCard from '../../components/Amicale/Profile/ProfileWelcomeCard';
import ProfilePersonalCard from '../../components/Amicale/Profile/ProfilePersonalCard';
import ProfileClubCard from '../../components/Amicale/Profile/ProfileClubCard';
import ProfileMembershipCard from '../../components/Amicale/Profile/ProfileMembershipCard';
import ProfileSessionsCard from '../../components/Amicale/Profile/ProfileSessionsCard';
import { useNavigation } from '@react-navigation/core';
import { useAuthenticatedRequest } from '../../context/loginContext';
import { MainRoutes } from '../../navigation/MainNavigator';

export type ProfileClubType = {
  id: number;
  name: string;
  is_manager: boolean;
};

export enum COTISATION {
  NONE = 0,
  SEMESTER_1 = 1,
  SEMESTER_2 = 2,
  YEARLY = 3,
  PERMANENT = 4,
}

export enum VERIFIED {
  NONE = 0,
  EMAIL = 1,
  ACCOUNT = 2,
  ACCOUNT_AND_EMAIL = 3,
}

export type ProfileDataType = {
  firstName: string;
  lastName: string;
  email: string;
  cotisation: COTISATION;
  cotisationValid: boolean;
  verified: VERIFIED;
  minor: boolean;
  birthday: string;
  phone: string;
  groupInsa: string;
  clubs: Array<ProfileClubType>;
};

function ProfileScreen() {
  const navigation = useNavigation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [sessionsToLogout, setSessionsToLogout] = useState<string | undefined>(
    'current'
  );
  const request = useAuthenticatedRequest<ProfileDataType>('user/self');

  useLayoutEffect(() => {
    const getHeaderButton = () => (
      <MaterialHeaderButtons>
        <Item
          title={'logout'}
          iconName={'logout'}
          onPress={showDisconnectDialog}
        />
      </MaterialHeaderButtons>
    );
    navigation.setOptions({
      headerRight: getHeaderButton,
    });
  }, [navigation]);

  const getScreen = (data: ProfileDataType | undefined) => {
    if (data) {
      const flatListData: Array<{
        id: string;
        render: () => React.ReactElement;
      }> = [];
      flatListData.push({
        id: 'welcome',
        render: () => <ProfileWelcomeCard firstname={data?.firstName} />,
      });
      flatListData.push({
        id: 'personal',
        render: () => <ProfilePersonalCard profile={data} />,
      });
      if (data?.clubs)
        flatListData.push({
          id: 'clubs',
          render: () => <ProfileClubCard clubs={data?.clubs} />,
        });
      flatListData.push({
        id: 'cotisation',
        render: () => (
          <ProfileMembershipCard
            cotisation={data?.cotisation}
            valid={data?.cotisationValid}
          />
        ),
      });
      flatListData.push({
        id: 'sessions',
        render: () => <ProfileSessionsCard logout={showDisconnectDialog} />,
      });
      return (
        <View style={GENERAL_STYLES.flex}>
          <CollapsibleFlatList renderItem={getRenderItem} data={flatListData} />
          <LogoutDialog
            visible={dialogVisible}
            onDismiss={hideDisconnectDialog}
            sessions={sessionsToLogout}
          />
        </View>
      );
    } else {
      return <View />;
    }
  };

  const getRenderItem = ({
    item,
  }: {
    item: { id: string; render: () => React.ReactElement };
  }) => item.render();

  const showDisconnectDialog = (session?: string) => {
    setDialogVisible(true);
    if (session !== 'all' && session !== 'others') session = 'current';
    setSessionsToLogout(session);
  };

  const hideDisconnectDialog = (logout: boolean) => {
    setDialogVisible(false);
    if (logout) navigation.navigate(MainRoutes.Main);
  };

  return <RequestScreen request={request} render={getScreen} />;
}

export default ProfileScreen;
