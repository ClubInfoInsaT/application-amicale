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
import { Linking, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Paragraph,
  useTheme,
} from 'react-native-paper';
import i18n from 'i18n-js';
import CustomHTML from '../../../components/Overrides/CustomHTML';
import { TAB_BAR_HEIGHT } from '../../../components/Tabbar/CustomTabBar';
import type { Club, ClubRespo } from './ClubListScreen';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import ImageGalleryButton from '../../../components/Media/ImageGalleryButton';
import RequestScreen from '../../../components/Screens/RequestScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuthenticatedRequest } from '../../../context/loginContext';
import { StackScreenProps } from '@react-navigation/stack';
import {
  MainRoutes,
  MainStackParamsList,
} from '../../../navigation/MainNavigator';

type Props = StackScreenProps<MainStackParamsList, MainRoutes.ClubInformation>;

const AMICALE_MAIL = 'clubs@amicale-insat.fr';

const styles = StyleSheet.create({
  category: {
    marginRight: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  card: {
    marginTop: 10,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  emailButton: {
    marginLeft: 'auto',
  },
  scroll: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  imageButton: {
    width: 300,
    height: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
});

type ResponseData = {
  isMember: boolean; // Whether the user is a member of this club, `false` if user is not logged in
  pendingIncomingInvitation: boolean; // Whether the user has been invited to join this club, `false` if user is not logged in, `false` if user is already a member
  pendingOutgoingRequest: boolean; // Whether the user has requested to join this club, `false` if user is not logged in, `false` if user is already a member
  canJoin: boolean; // Whether the user is able to join this club, `false` if joining is disabled or not yet implemented, `false` if user is not logged in, `false` if user is already a member
  isManager: boolean; // Whether the user can view member list, invite and remove members, `false` if user is not logged in
  role:
    | 'president'
    | 'vice-president'
    | 'treasurer'
    | 'secretary'
    | 'respo'
    | 'member'
    | 'none'; // User's role inside the club
  responsibility?: string; // If `role` is set to `respo`, this indicates the title taken by the member within the club
  club: Club; // Reference to Club type
};

/**
 * Class defining a club event information page.
 * If called with data and categories navigation parameters, will use those to display the data.
 * If called with clubId parameter, will fetch the information on the server
 */
function ClubDisplayScreen(props: Props) {
  const navigation = useNavigation();
  const theme = useTheme();

  const [displayData, setDisplayData] = useState<ResponseData | undefined>();
  const clubId =
    props.route.params.type === 'full'
      ? props.route.params.data.id
      : props.route.params.clubId;

  /**
   * Gets the view for rendering categories
   *
   * @param categories The categories to display (max 2)
   * @returns {null|*}
   */
  const getCategoriesRender = (categories: Array<string>) => {
    if (!categories) {
      return null;
    }

    const final: Array<React.ReactNode> = [];
    categories.forEach((category: string) => {
      final.push(
        <Chip style={styles.category} key={category}>
          {category}
        </Chip>
      );
    });
    return <View style={styles.categoryContainer}>{final}</View>;
  };

  /**
   * Gets the view for rendering club managers if any
   *
   * @param managers The list of manager names
   * @param email The club contact email
   * @returns {*}
   */
  const getManagersRender = (
    managers: Array<ClubRespo>,
    email: string | null
  ) => {
    const managersListView: Array<React.ReactNode> = [];
    managers.forEach((respo: ClubRespo) => {
      managersListView.push(
        <Paragraph
          key={respo.name}
        >{`${respo.name} (${respo.role})`}</Paragraph>
      );
    });
    const hasManagers = managers.length > 0;
    return (
      <Card
        style={{
          marginBottom: TAB_BAR_HEIGHT + 20,
          ...styles.card,
        }}
      >
        <Card.Title
          title={i18n.t('screens.clubs.managers')}
          subtitle={
            hasManagers
              ? i18n.t('screens.clubs.managersSubtitle')
              : i18n.t('screens.clubs.managersUnavailable')
          }
          left={(iconProps) => (
            <Avatar.Icon
              size={iconProps.size}
              style={styles.icon}
              color={hasManagers ? theme.colors.success : theme.colors.primary}
              icon="account-tie"
            />
          )}
        />
        <Card.Content>
          {managersListView}
          {getEmailButton(email, hasManagers)}
        </Card.Content>
      </Card>
    );
  };

  /**
   * Gets the email button to contact the club, or the amicale if the club does not have any managers
   *
   * @param email The club contact email
   * @param hasManagers True if the club has managers
   * @returns {*}
   */
  const getEmailButton = (email: string | null, hasManagers: boolean) => {
    const destinationEmail =
      email != null && hasManagers ? email : AMICALE_MAIL;
    const text =
      email != null && hasManagers
        ? i18n.t('screens.clubs.clubContact')
        : i18n.t('screens.clubs.amicaleContact');
    return (
      <Card.Actions>
        <Button
          icon="email"
          mode="contained"
          onPress={() => {
            Linking.openURL(`mailto:${destinationEmail}`);
          }}
          style={styles.emailButton}
        >
          {text}
        </Button>
      </Card.Actions>
    );
  };

  const getScreen = (response: ResponseData | undefined) => {
    const club = response?.club;

    if (club) {
      console.log(club);
      return (
        <CollapsibleScrollView style={styles.scroll} hasTab>
          {getCategoriesRender(club.categories)}
          {club.logo !== null ? (
            <ImageGalleryButton
              images={[{ url: club.logo }]}
              style={styles.imageButton}
            />
          ) : (
            <View />
          )}

          {club.description !== null ? (
            // Surround description with div to allow text styling if the description is not html
            <Card.Content>
              <CustomHTML html={club.description} />
            </Card.Content>
          ) : (
            <View />
          )}
          {getManagersRender(club.respo, club.mail)}
        </CollapsibleScrollView>
      );
    }
    return <View />;
  };

  useLayoutEffect(() => {
    if (displayData) {
      navigation.setOptions({ title: displayData.name });
    }
  }, [displayData, navigation]);

  const request = useAuthenticatedRequest<ResponseData>(
    'clubs/club?id=' + clubId,
    'GET'
  );

  return (
    <RequestScreen
      request={request}
      render={getScreen}
      cache={displayData}
      onCacheUpdate={setDisplayData}
    />
  );
}

export default ClubDisplayScreen;
