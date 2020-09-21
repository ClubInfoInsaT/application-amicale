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
import {Text, TouchableRipple} from 'react-native-paper';
import {Image, View} from 'react-native';
import type {ServiceItemType} from '../../../managers/ServicesManager';

type PropsType = {
  item: ServiceItemType,
  width: number,
};

export default class ImageListItem extends React.Component<PropsType> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {props} = this;
    const {item} = props;
    const source =
      typeof item.image === 'number' ? item.image : {uri: item.image};
    return (
      <TouchableRipple
        style={{
          width: props.width,
          height: props.width + 40,
          margin: 5,
        }}
        onPress={item.onPress}>
        <View>
          <Image
            style={{
              width: props.width - 20,
              height: props.width - 20,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            source={source}
          />
          <Text
            style={{
              marginTop: 5,
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'center',
            }}>
            {item.title}
          </Text>
        </View>
      </TouchableRipple>
    );
  }
}
