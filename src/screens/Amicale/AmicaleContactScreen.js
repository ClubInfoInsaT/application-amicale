// @flow

import * as React from 'react';
import {FlatList, Image, Linking, View} from 'react-native';
import {Card, List, Text, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import type {MaterialCommunityIconsGlyphs} from 'react-native-vector-icons/MaterialCommunityIcons';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import AMICALE_LOGO from '../../../assets/amicale.png';

type DatasetItemType = {
  name: string,
  email: string,
  icon: MaterialCommunityIconsGlyphs,
};

/**
 * Class defining a planning event information page.
 */
class AmicaleContactScreen extends React.Component<null> {
  // Dataset containing information about contacts
  CONTACT_DATASET: Array<DatasetItemType>;

  constructor() {
    super();
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

  getChevronIcon = ({
    size,
    color,
  }: {
    size: number,
    color: string,
  }): React.Node => (
    <List.Icon size={size} color={color} icon="chevron-right" />
  );

  getRenderItem = ({item}: {item: DatasetItemType}): React.Node => {
    const onPress = () => {
      Linking.openURL(`mailto:${item.email}`);
    };
    return (
      <List.Item
        title={item.name}
        description={item.email}
        left={({size, color}: {size: number, color: string}): React.Node => (
          <List.Icon size={size} color={color} icon={item.icon} />
        )}
        right={this.getChevronIcon}
        onPress={onPress}
      />
    );
  };

  getScreen = (): React.Node => {
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
            left={({
              size,
              color,
            }: {
              size: number,
              color: string,
            }): React.Node => (
              <List.Icon size={size} color={color} icon="information" />
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

  render(): React.Node {
    return (
      <CollapsibleFlatList
        data={[{key: '1'}]}
        renderItem={this.getScreen}
        hasTab
      />
    );
  }
}

export default withTheme(AmicaleContactScreen);
