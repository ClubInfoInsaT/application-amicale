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
import {Badge, TouchableRipple, useTheme} from 'react-native-paper';
import {Dimensions, Image, View} from 'react-native';
import * as Animatable from 'react-native-animatable';

type PropsType = {
  image?: string | number;
  onPress?: () => void;
  badgeCount?: number;
};

/**
 * Component used to render a small dashboard item
 */
function SmallDashboardItem(props: PropsType) {
  const itemSize = Dimensions.get('window').width / 8;
  const theme = useTheme();
  const {image} = props;
  return (
    <TouchableRipple
      onPress={props.onPress}
      borderless
      style={{
        marginLeft: itemSize / 6,
        marginRight: itemSize / 6,
      }}>
      <View
        style={{
          width: itemSize,
          height: itemSize,
        }}>
        {image ? (
          <Image
            source={typeof image === 'string' ? {uri: image} : image}
            style={{
              width: '80%',
              height: '80%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          />
        ) : null}
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
              visible={true}
              style={{
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.background,
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

const areEqual = (prevProps: PropsType, nextProps: PropsType): boolean => {
  return nextProps.badgeCount !== prevProps.badgeCount;
};

export default React.memo(SmallDashboardItem, areEqual);
