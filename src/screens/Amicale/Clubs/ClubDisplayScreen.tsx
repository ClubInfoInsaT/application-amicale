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

import React, { useState } from 'react';
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
import type { ClubCategoryType, ClubType } from './ClubListScreen';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import ImageGalleryButton from '../../../components/Media/ImageGalleryButton';
import RequestScreen from '../../../components/Screens/RequestScreen';
import { useFocusEffect } from '@react-navigation/core';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuthenticatedRequest } from '../../../context/loginContext';
import { StackScreenProps } from '@react-navigation/stack';
import {
  MainRoutes,
  MainStackParamsList,
} from '../../../navigation/MainNavigator';

type Props = StackScreenProps<MainStackParamsList, MainRoutes.ClubInformation>;

type ResponseType = ClubType;

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

/**
 * Class defining a club event information page.
 * If called with data and categories navigation parameters, will use those to display the data.
 * If called with clubId parameter, will fetch the information on the server
 */
function ClubDisplayScreen(props: Props) {
  const navigation = useNavigation();
  const theme = useTheme();

  const [displayData, setDisplayData] = useState<ClubType | undefined>();
  const [categories, setCategories] = useState<
    Array<ClubCategoryType> | undefined
  >();
  const [clubId, setClubId] = useState<number | undefined>();

  useFocusEffect(
    useCallback(() => {
      if (props.route.params.type === 'full') {
        setDisplayData(props.route.params.data);
        setCategories(props.route.params.categories);
        setClubId(props.route.params.data.id);
      } else {
        const id = props.route.params.clubId;
        setClubId(id ? id : 0);
      }
    }, [props.route.params])
  );

  /**
   * Gets the name of the category with the given ID
   *
   * @param id The category's ID
   * @returns {string|*}
   */
  const getCategoryName = (id: number): string => {
    let categoryName = '';
    if (categories) {
      categories.forEach((item: ClubCategoryType) => {
        if (id === item.id) {
          categoryName = item.name;
        }
      });
    }
    return categoryName;
  };

  /**
   * Gets the view for rendering categories
   *
   * @param categories The categories to display (max 2)
   * @returns {null|*}
   */
  const getCategoriesRender = (c: Array<number | null>) => {
    if (!categories) {
      return null;
    }

    const final: Array<React.ReactNode> = [];
    c.forEach((cat: number | null) => {
      if (cat != null) {
        final.push(
          <Chip style={styles.category} key={cat}>
            {getCategoryName(cat)}
          </Chip>
        );
      }
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
  const getManagersRender = (managers: Array<string>, email: string | null) => {
    const managersListView: Array<React.ReactNode> = [];
    managers.forEach((item: string) => {
      managersListView.push(<Paragraph key={item}>{item}</Paragraph>);
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

  const getScreen = (data: ResponseType | undefined) => {
    if (data) {
      updateHeaderTitle(data);
      return (
        <CollapsibleScrollView style={styles.scroll} hasTab>
          {getCategoriesRender(data.category)}
          {data.logo !== null ? (
            <ImageGalleryButton
              images={[{ url: data.logo }]}
              style={styles.imageButton}
            />
          ) : (
            <View />
          )}

          {data.description !== null ? (
            // Surround description with div to allow text styling if the description is not html
            <Card.Content>
              <CustomHTML html={data.description} />
            </Card.Content>
          ) : (
            <View />
          )}
          {getManagersRender(data.responsibles, data.email)}
        </CollapsibleScrollView>
      );
    }
    return <View />;
  };

  /**
   * Updates the header title to match the given club
   *
   * @param data The club data
   */
  const updateHeaderTitle = (data: ClubType) => {
    navigation.setOptions({ title: data.name });
  };

  const request = useAuthenticatedRequest<ClubType>('clubs/info', {
    id: clubId,
  });

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
