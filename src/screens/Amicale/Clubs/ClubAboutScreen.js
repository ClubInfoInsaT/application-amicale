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
import {Card, Avatar, Text, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import Autolink from 'react-native-autolink';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import AMICALE_ICON from '../../../../assets/amicale.png';
import type {CardTitleIconPropsType} from '../../../constants/PaperStyles';

const CONTACT_LINK = 'clubs@amicale-insat.fr';

// eslint-disable-next-line react/prefer-stateless-function
class ClubAboutScreen extends React.Component<null> {
  render(): React.Node {
    return (
      <CollapsibleScrollView style={{padding: 5}}>
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
            source={AMICALE_ICON}
            style={{flex: 1, resizeMode: 'contain'}}
            resizeMode="contain"
          />
        </View>
        <Text>{i18n.t('screens.clubs.about.text')}</Text>
        <Card style={{margin: 5}}>
          <Card.Title
            title={i18n.t('screens.clubs.about.title')}
            subtitle={i18n.t('screens.clubs.about.subtitle')}
            left={(iconProps: CardTitleIconPropsType): React.Node => (
              <Avatar.Icon size={iconProps.size} icon="information" />
            )}
          />
          <Card.Content>
            <Text>{i18n.t('screens.clubs.about.message')}</Text>
            <Autolink text={CONTACT_LINK} component={Text} />
          </Card.Content>
        </Card>
      </CollapsibleScrollView>
    );
  }
}

export default withTheme(ClubAboutScreen);
