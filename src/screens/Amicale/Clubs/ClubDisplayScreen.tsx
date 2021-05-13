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
import { Linking, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Paragraph,
  withTheme,
} from 'react-native-paper';
import i18n from 'i18n-js';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomHTML from '../../../components/Overrides/CustomHTML';
import { TAB_BAR_HEIGHT } from '../../../components/Tabbar/CustomTabBar';
import type { ClubCategoryType, ClubType } from './ClubListScreen';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import ImageGalleryButton from '../../../components/Media/ImageGalleryButton';
import RequestScreen from '../../../components/Screens/RequestScreen';
import ConnectionManager from '../../../managers/ConnectionManager';

type PropsType = {
  navigation: StackNavigationProp<any>;
  route: {
    params?: {
      data?: ClubType;
      categories?: Array<ClubCategoryType>;
      clubId?: number;
    };
  };
  theme: ReactNativePaper.Theme;
};

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
class ClubDisplayScreen extends React.Component<PropsType> {
  displayData: ClubType | undefined;

  categories: Array<ClubCategoryType> | null;

  clubId: number;

  shouldFetchData: boolean;

  constructor(props: PropsType) {
    super(props);
    this.displayData = undefined;
    this.categories = null;
    this.clubId = props.route.params?.clubId ? props.route.params.clubId : 0;
    this.shouldFetchData = true;

    if (
      props.route.params &&
      props.route.params.data &&
      props.route.params.categories
    ) {
      this.displayData = props.route.params.data;
      this.categories = props.route.params.categories;
      this.clubId = props.route.params.data.id;
      this.shouldFetchData = false;
    }
  }

  /**
   * Gets the name of the category with the given ID
   *
   * @param id The category's ID
   * @returns {string|*}
   */
  getCategoryName(id: number): string {
    let categoryName = '';
    if (this.categories !== null) {
      this.categories.forEach((item: ClubCategoryType) => {
        if (id === item.id) {
          categoryName = item.name;
        }
      });
    }
    return categoryName;
  }

  /**
   * Gets the view for rendering categories
   *
   * @param categories The categories to display (max 2)
   * @returns {null|*}
   */
  getCategoriesRender(categories: Array<number | null>) {
    if (this.categories == null) {
      return null;
    }

    const final: Array<React.ReactNode> = [];
    categories.forEach((cat: number | null) => {
      if (cat != null) {
        final.push(
          <Chip style={styles.category} key={cat}>
            {this.getCategoryName(cat)}
          </Chip>
        );
      }
    });
    return <View style={styles.categoryContainer}>{final}</View>;
  }

  /**
   * Gets the view for rendering club managers if any
   *
   * @param managers The list of manager names
   * @param email The club contact email
   * @returns {*}
   */
  getManagersRender(managers: Array<string>, email: string | null) {
    const { props } = this;
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
              color={
                hasManagers
                  ? props.theme.colors.success
                  : props.theme.colors.primary
              }
              icon="account-tie"
            />
          )}
        />
        <Card.Content>
          {managersListView}
          {ClubDisplayScreen.getEmailButton(email, hasManagers)}
        </Card.Content>
      </Card>
    );
  }

  /**
   * Gets the email button to contact the club, or the amicale if the club does not have any managers
   *
   * @param email The club contact email
   * @param hasManagers True if the club has managers
   * @returns {*}
   */
  static getEmailButton(email: string | null, hasManagers: boolean) {
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
  }

  getScreen = (data: ResponseType | undefined) => {
    if (data) {
      this.updateHeaderTitle(data);
      return (
        <CollapsibleScrollView style={styles.scroll} hasTab>
          {this.getCategoriesRender(data.category)}
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
          {this.getManagersRender(data.responsibles, data.email)}
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
  updateHeaderTitle(data: ClubType) {
    const { props } = this;
    props.navigation.setOptions({ title: data.name });
  }

  render() {
    if (this.shouldFetchData) {
      return (
        <RequestScreen
          request={() =>
            ConnectionManager.getInstance().authenticatedRequest<ResponseType>(
              'clubs/info',
              { id: this.clubId }
            )
          }
          render={this.getScreen}
        />
      );
    }
    return this.getScreen(this.displayData);
  }
}

export default withTheme(ClubDisplayScreen);
