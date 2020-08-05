// @flow

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
import ImageModal from 'react-native-image-modal';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import AuthenticatedScreen from '../../../components/Amicale/AuthenticatedScreen';
import CustomHTML from '../../../components/Overrides/CustomHTML';
import CustomTabBar from '../../../components/Tabbar/CustomTabBar';
import type {ClubCategoryType, ClubType} from './ClubListScreen';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import {ERROR_TYPE} from '../../../utils/WebData';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import type {ApiGenericDataType} from '../../../utils/WebData';

type PropsType = {
  navigation: StackNavigationProp,
  route: {
    params?: {
      data?: ClubType,
      categories?: Array<ClubCategoryType>,
      clubId?: number,
    },
    ...
  },
  theme: CustomThemeType,
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
    if (props.route.params != null) {
      if (
        props.route.params.data != null &&
        props.route.params.categories != null
      ) {
        this.displayData = props.route.params.data;
        this.categories = props.route.params.categories;
        this.clubId = props.route.params.data.id;
        this.shouldFetchData = false;
      } else if (props.route.params.clubId != null) {
        this.displayData = null;
        this.categories = null;
        this.clubId = props.route.params.clubId;
        this.shouldFetchData = true;
      }
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
        if (id === item.id) categoryName = item.name;
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
  getCategoriesRender(categories: Array<number | null>): React.Node {
    if (this.categories == null) return null;

    const final = [];
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
  getManagersRender(managers: Array<string>, email: string | null): React.Node {
    const {props} = this;
    const managersListView = [];
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
          left={({size}: {size: number}): React.Node => (
            <Avatar.Icon
              size={size}
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
  static getEmailButton(
    email: string | null,
    hasManagers: boolean,
  ): React.Node {
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

  getScreen = (response: Array<ApiGenericDataType | null>): React.Node => {
    const {props} = this;
    let data: ClubType | null = null;
    if (response[0] != null) {
      [data] = response;
      this.updateHeaderTitle(data);
    }
    if (data != null) {
      return (
        <CollapsibleScrollView style={{paddingLeft: 5, paddingRight: 5}} hasTab>
          {this.getCategoriesRender(data.category)}
          {data.logo !== null ? (
            <View
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <ImageModal
                resizeMode="contain"
                imageBackgroundColor={props.theme.colors.background}
                style={{
                  width: 300,
                  height: 300,
                }}
                source={{
                  uri: data.logo,
                }}
              />
            </View>
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

  render(): React.Node {
    const {props} = this;
    if (this.shouldFetchData)
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
    return this.getScreen([this.displayData]);
  }
}

export default withTheme(ClubDisplayScreen);
