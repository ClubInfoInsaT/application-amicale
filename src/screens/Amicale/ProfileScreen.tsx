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
import { useNavigation } from '@react-navigation/core';
import { useAuthenticatedRequest } from '../../context/loginContext';

export type ProfileClubType = {
  id: number;
  name: string;
  is_manager: boolean;
};

export type ProfileDataType = {
  first_name: string;
  last_name: string;
  email: string;
  birthday: string;
  phone: string;
  branch: string;
  link: string;
  validity: boolean;
  clubs: Array<ProfileClubType>;
};

function ProfileScreen() {
  const navigation = useNavigation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const request = useAuthenticatedRequest<ProfileDataType>('user/profile');

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
      for (let i = 0; i < 4; i++) {
        switch (i) {
          case 0:
            flatListData.push({
              id: i.toString(),
              render: () => <ProfileWelcomeCard firstname={data?.first_name} />,
            });
            break;
          case 1:
            flatListData.push({
              id: i.toString(),
              render: () => <ProfilePersonalCard profile={data} />,
            });
            break;
          case 2:
            flatListData.push({
              id: i.toString(),
              render: () => <ProfileClubCard clubs={data?.clubs} />,
            });
            break;
          default:
            flatListData.push({
              id: i.toString(),
              render: () => <ProfileMembershipCard valid={data?.validity} />,
            });
        }
      }
      return (
        <View style={GENERAL_STYLES.flex}>
          <CollapsibleFlatList renderItem={getRenderItem} data={flatListData} />
          <LogoutDialog
            visible={dialogVisible}
            onDismiss={hideDisconnectDialog}
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

  const showDisconnectDialog = () => setDialogVisible(true);

  const hideDisconnectDialog = () => setDialogVisible(false);

  return <RequestScreen request={request} render={getScreen} />;
}

export default ProfileScreen;
