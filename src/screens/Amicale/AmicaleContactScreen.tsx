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
import {FlatList, Image, Linking, View} from 'react-native';
import {Avatar, Card, List, Text} from 'react-native-paper';
import i18n from 'i18n-js';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';

const AMICALE_LOGO = require('../../../assets/amicale.png');

type DatasetItemType = {
  name: string;
  email: string;
  icon: string;
};

/**
 * Class defining a planning event information page.
 */
class AmicaleContactScreen extends React.Component<{}> {
  // Dataset containing information about contacts
  CONTACT_DATASET: Array<DatasetItemType>;

  constructor() {
    super({});
    this.CONTACT_DATASET = [
      {
        name: i18n.t('screens.amicaleAbout.roles.interSchools'),
        email: 'inter.ecoles@amicale-insat.fr',
        icon: 'share-variant',
      },
      {
        name: i18n.t('screens.amicaleAbout.roles.culture'),
        email: 'culture@amicale-insat.fr',
        icon: 'book',
      },
      {
        name: i18n.t('screens.amicaleAbout.roles.animation'),
        email: 'animation@amicale-insat.fr',
        icon: 'emoticon',
      },
      {
        name: i18n.t('screens.amicaleAbout.roles.clubs'),
        email: 'clubs@amicale-insat.fr',
        icon: 'account-group',
      },
      {
        name: i18n.t('screens.amicaleAbout.roles.event'),
        email: 'evenements@amicale-insat.fr',
        icon: 'calendar-range',
      },
      {
        name: i18n.t('screens.amicaleAbout.roles.tech'),
        email: 'technique@amicale-insat.fr',
        icon: 'cog',
      },
      {
        name: i18n.t('screens.amicaleAbout.roles.communication'),
        email: 'amicale@amicale-insat.fr',
        icon: 'comment-account',
      },
      {
        name: i18n.t('screens.amicaleAbout.roles.intraSchools'),
        email: 'intra.ecoles@amicale-insat.fr',
        icon: 'school',
      },
      {
        name: i18n.t('screens.amicaleAbout.roles.publicRelations'),
        email: 'rp@amicale-insat.fr',
        icon: 'account-tie',
      },
    ];
  }

  keyExtractor = (item: DatasetItemType): string => item.email;

  getChevronIcon = (iconProps: {
    color: string;
    style?: {
      marginRight: number;
      marginVertical?: number;
    };
  }) => (
    <List.Icon
      color={iconProps.color}
      style={iconProps.style}
      icon="chevron-right"
    />
  );

  getRenderItem = ({item}: {item: DatasetItemType}) => {
    const onPress = () => {
      Linking.openURL(`mailto:${item.email}`);
    };
    return (
      <List.Item
        title={item.name}
        description={item.email}
        left={(iconProps) => (
          <List.Icon
            color={iconProps.color}
            style={iconProps.style}
            icon={item.icon}
          />
        )}
        right={this.getChevronIcon}
        onPress={onPress}
      />
    );
  };

  getScreen = () => {
    return (
      <View>
        <View
          style={{
            width: '100%',
            height: 100,
            marginTop: 20,
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={AMICALE_LOGO}
            style={{flex: 1, resizeMode: 'contain'}}
            resizeMode="contain"
          />
        </View>
        <Card style={{margin: 5}}>
          <Card.Title
            title={i18n.t('screens.amicaleAbout.title')}
            subtitle={i18n.t('screens.amicaleAbout.subtitle')}
            left={(iconProps) => (
              <Avatar.Icon size={iconProps.size} icon="information" />
            )}
          />
          <Card.Content>
            <Text>{i18n.t('screens.amicaleAbout.message')}</Text>
            <FlatList
              data={this.CONTACT_DATASET}
              keyExtractor={this.keyExtractor}
              renderItem={this.getRenderItem}
            />
          </Card.Content>
        </Card>
      </View>
    );
  };

  render() {
    return (
      <CollapsibleFlatList
        data={[{key: '1'}]}
        renderItem={this.getScreen}
        hasTab
      />
    );
  }
}

export default AmicaleContactScreen;
