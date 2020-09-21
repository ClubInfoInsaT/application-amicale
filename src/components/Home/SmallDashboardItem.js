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
import {Badge, TouchableRipple, withTheme} from 'react-native-paper';
import {Dimensions, Image, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import type {CustomThemeType} from '../../managers/ThemeManager';

type PropsType = {
  image: string | null,
  onPress: () => void | null,
  badgeCount: number | null,
  theme: CustomThemeType,
};

/**
 * Component used to render a small dashboard item
 */
class SmallDashboardItem extends React.Component<PropsType> {
  itemSize: number;

  constructor(props: PropsType) {
    super(props);
    this.itemSize = Dimensions.get('window').width / 8;
  }

  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return (
      nextProps.theme.dark !== props.theme.dark ||
      nextProps.badgeCount !== props.badgeCount
    );
  }

  render(): React.Node {
    const {props} = this;
    return (
      <TouchableRipple
        onPress={props.onPress}
        borderless
        style={{
          marginLeft: this.itemSize / 6,
          marginRight: this.itemSize / 6,
        }}>
        <View
          style={{
            width: this.itemSize,
            height: this.itemSize,
          }}>
          <Image
            source={{uri: props.image}}
            style={{
              width: '80%',
              height: '80%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          />
          {props.badgeCount != null && props.badgeCount > 0 ? (
            <Animatable.View
              animation="zoomIn"
              duration={300}
              useNativeDriver
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
              }}>
              <Badge
                style={{
                  backgroundColor: props.theme.colors.primary,
                  borderColor: props.theme.colors.background,
                  borderWidth: 2,
                }}>
                {props.badgeCount}
              </Badge>
            </Animatable.View>
          ) : null}
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(SmallDashboardItem);
