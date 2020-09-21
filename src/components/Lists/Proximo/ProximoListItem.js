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
import {Avatar, List, Text, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import type {ProximoArticleType} from '../../../screens/Services/Proximo/ProximoMainScreen';

type PropsType = {
  onPress: () => void,
  color: string,
  item: ProximoArticleType,
  height: number,
};

class ProximoListItem extends React.Component<PropsType> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {props} = this;
    return (
      <List.Item
        title={props.item.name}
        description={`${props.item.quantity} ${i18n.t(
          'screens.proximo.inStock',
        )}`}
        descriptionStyle={{color: props.color}}
        onPress={props.onPress}
        left={(): React.Node => (
          <Avatar.Image
            style={{backgroundColor: 'transparent'}}
            size={64}
            source={{uri: props.item.image}}
          />
        )}
        right={(): React.Node => (
          <Text style={{fontWeight: 'bold'}}>{props.item.price}€</Text>
        )}
        style={{
          height: props.height,
          justifyContent: 'center',
        }}
      />
    );
  }
}

export default withTheme(ProximoListItem);
