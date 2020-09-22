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
import {TouchableRipple, useTheme} from 'react-native-paper';
import {Dimensions, Image, View} from 'react-native';

type PropsType = {
  image?: string | number;
  isActive: boolean;
  onPress: () => void;
};

/**
 * Component used to render a small dashboard item
 */
function DashboardEditPreviewItem(props: PropsType) {
  const theme = useTheme();
  const itemSize = Dimensions.get('window').width / 8;

  return (
    <TouchableRipple
      onPress={props.onPress}
      borderless
      style={{
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: props.isActive
          ? theme.colors.textDisabled
          : 'transparent',
        borderRadius: 5,
      }}>
      <View
        style={{
          width: itemSize,
          height: itemSize,
        }}>
        {props.image ? (
          <Image
            source={
              typeof props.image === 'string' ? {uri: props.image} : props.image
            }
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        ) : null}
      </View>
    </TouchableRipple>
  );
}

export default DashboardEditPreviewItem;
