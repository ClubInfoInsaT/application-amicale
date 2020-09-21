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
import {Image, View} from 'react-native';
import {
  Avatar,
  Card,
  Divider,
  List,
  TouchableRipple,
  withTheme,
} from 'react-native-paper';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import CardList from '../../components/Lists/CardList/CardList';
import type {CustomThemeType} from '../../managers/ThemeManager';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import ServicesManager, {
  SERVICES_CATEGORIES_KEY,
} from '../../managers/ServicesManager';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import type {ServiceCategoryType} from '../../managers/ServicesManager';

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomThemeType,
};

class ServicesScreen extends React.Component<PropsType> {
  finalDataset: Array<ServiceCategoryType>;

  constructor(props: PropsType) {
    super(props);
    const services = new ServicesManager(props.navigation);
    this.finalDataset = services.getCategories([
      SERVICES_CATEGORIES_KEY.SPECIAL,
    ]);
  }

  componentDidMount() {
    const {props} = this;
    props.navigation.setOptions({
      headerRight: this.getAboutButton,
    });
  }

  getAboutButton = (): React.Node => (
    <MaterialHeaderButtons>
      <Item
        title="information"
        iconName="information"
        onPress={this.onAboutPress}
      />
    </MaterialHeaderButtons>
  );

  onAboutPress = () => {
    const {props} = this;
    props.navigation.navigate('amicale-contact');
  };

  /**
   * Gets the list title image for the list.
   *
   * If the source is a string, we are using an icon.
   * If the source is a number, we are using an internal image.
   *
   * @param source The source image to display. Can be a string for icons or a number for local images
   * @returns {*}
   */
  getListTitleImage(source: string | number): React.Node {
    const {props} = this;
    if (typeof source === 'number')
      return (
        <Image
          size={48}
          source={source}
          style={{
            width: 48,
            height: 48,
          }}
        />
      );
    return (
      <Avatar.Icon
        size={48}
        icon={source}
        color={props.theme.colors.primary}
        style={{backgroundColor: 'transparent'}}
      />
    );
  }

  /**
   * A list item showing a list of available services for the current category
   *
   * @param item
   * @returns {*}
   */
  getRenderItem = ({item}: {item: ServiceCategoryType}): React.Node => {
    const {props} = this;
    return (
      <TouchableRipple
        style={{
          margin: 5,
          marginBottom: 20,
        }}
        onPress={() => {
          props.navigation.navigate('services-section', {data: item});
        }}>
        <View>
          <Card.Title
            title={item.title}
            subtitle={item.subtitle}
            left={(): React.Node => this.getListTitleImage(item.image)}
            right={(): React.Node => <List.Icon icon="chevron-right" />}
          />
          <CardList dataset={item.content} isHorizontal />
        </View>
      </TouchableRipple>
    );
  };

  keyExtractor = (item: ServiceCategoryType): string => item.title;

  render(): React.Node {
    return (
      <View>
        <CollapsibleFlatList
          data={this.finalDataset}
          renderItem={this.getRenderItem}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={(): React.Node => <Divider />}
          hasTab
        />
        <MascotPopup
          prefKey={AsyncStorageManager.PREFERENCES.servicesShowMascot.key}
          title={i18n.t('screens.services.mascotDialog.title')}
          message={i18n.t('screens.services.mascotDialog.message')}
          icon="cloud-question"
          buttons={{
            action: null,
            cancel: {
              message: i18n.t('screens.services.mascotDialog.button'),
              icon: 'check',
            },
          }}
          emotion={MASCOT_STYLE.WINK}
        />
      </View>
    );
  }
}

export default withTheme(ServicesScreen);
