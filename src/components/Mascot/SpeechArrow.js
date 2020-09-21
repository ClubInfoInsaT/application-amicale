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
import {View} from 'react-native';
import type {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheet';

type PropsType = {
  style?: ViewStyle | null,
  size: number,
  color: string,
};

export default class SpeechArrow extends React.Component<PropsType> {
  static defaultProps = {
    style: null,
  };

  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {props} = this;
    return (
      <View style={props.style}>
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 0,
            borderRightWidth: props.size,
            borderBottomWidth: props.size,
            borderStyle: 'solid',
            backgroundColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: props.color,
          }}
        />
      </View>
    );
  }
}
