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
import {Linking, View} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Paragraph,
  withTheme,
} from 'react-native-paper';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import AuthenticatedScreen from '../../../components/Amicale/AuthenticatedScreen';
import CustomHTML from '../../../components/Overrides/CustomHTML';
import CustomTabBar from '../../../components/Tabbar/CustomTabBar';
import type {ClubCategoryType, ClubType} from './ClubListScreen';
import {ERROR_TYPE} from '../../../utils/WebData';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import ImageGalleryButton from '../../../components/Media/ImageGalleryButton';

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

const AMICALE_MAIL = 'clubs@amicale-insat.fr';

/**
 * Class defining a club event information page.
 * If called with data and categories navigation parameters, will use those to display the data.
 * If called with clubId parameter, will fetch the information on the server
 */
class ClubDisplayScreen extends React.Component<PropsType> {
  displayData: ClubType | null;

  categories: Array<ClubCategoryType> | null;

  clubId: number;

  shouldFetchData: boolean;

  constructor(props: PropsType) {
    super(props);
    this.displayData = null;
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
          <Chip style={{marginRight: 5}} key={cat}>
            {this.getCategoryName(cat)}
          </Chip>,
        );
      }
    });
    return <View style={{flexDirection: 'row', marginTop: 5}}>{final}</View>;
  }

  /**
   * Gets the view for rendering club managers if any
   *
   * @param managers The list of manager names
   * @param email The club contact email
   * @returns {*}
   */
  getManagersRender(managers: Array<string>, email: string | null) {
    const {props} = this;
    const managersListView: Array<React.ReactNode> = [];
    managers.forEach((item: string) => {
      managersListView.push(<Paragraph key={item}>{item}</Paragraph>);
    });
    const hasManagers = managers.length > 0;
    return (
      <Card
        style={{marginTop: 10, marginBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
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
              style={{backgroundColor: 'transparent'}}
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
          style={{marginLeft: 'auto'}}>
          {text}
        </Button>
      </Card.Actions>
    );
  }

  getScreen = (response: Array<ClubType | null>) => {
    let data: ClubType | null = response[0];
    if (data != null) {
      this.updateHeaderTitle(data);
      return (
        <CollapsibleScrollView style={{paddingLeft: 5, paddingRight: 5}} hasTab>
          {this.getCategoriesRender(data.category)}
          {data.logo !== null ? (
            <ImageGalleryButton
              images={[{url: data.logo}]}
              style={{
                width: 300,
                height: 300,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
                marginBottom: 10,
              }}
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
    return null;
  };

  /**
   * Updates the header title to match the given club
   *
   * @param data The club data
   */
  updateHeaderTitle(data: ClubType) {
    const {props} = this;
    props.navigation.setOptions({title: data.name});
  }

  render() {
    const {props} = this;
    if (this.shouldFetchData) {
      return (
        <AuthenticatedScreen
          navigation={props.navigation}
          requests={[
            {
              link: 'clubs/info',
              params: {id: this.clubId},
              mandatory: true,
            },
          ]}
          renderFunction={this.getScreen}
          errorViewOverride={[
            {
              errorCode: ERROR_TYPE.BAD_INPUT,
              message: i18n.t('screens.clubs.invalidClub'),
              icon: 'account-question',
              showRetryButton: false,
            },
          ]}
        />
      );
    }
    return this.getScreen([this.displayData]);
  }
}

export default withTheme(ClubDisplayScreen);
