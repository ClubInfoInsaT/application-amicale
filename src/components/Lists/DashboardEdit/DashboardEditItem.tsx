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
import {Image} from 'react-native';
import {List, useTheme} from 'react-native-paper';
import type {ServiceItemType} from '../../../managers/ServicesManager';

type PropsType = {
  item: ServiceItemType;
  isActive: boolean;
  height: number;
  onPress: () => void;
};

function DashboardEditItem(props: PropsType) {
  const theme = useTheme();
  const {item, onPress, height, isActive} = props;
  return (
    <List.Item
      title={item.title}
      description={item.subtitle}
      onPress={isActive ? undefined : onPress}
      left={() => (
        <Image
          source={
            typeof item.image === 'string' ? {uri: item.image} : item.image
          }
          style={{
            width: 40,
            height: 40,
          }}
        />
      )}
      right={(iconProps) =>
        isActive ? (
          <List.Icon
            style={iconProps.style}
            icon="check"
            color={theme.colors.success}
          />
        ) : null
      }
      style={{
        height,
        justifyContent: 'center',
        paddingLeft: 30,
        backgroundColor: isActive
          ? theme.colors.proxiwashFinishedColor
          : 'transparent',
      }}
    />
  );
}

const areEqual = (prevProps: PropsType, nextProps: PropsType): boolean => {
  return nextProps.isActive === prevProps.isActive;
};

export default React.memo(DashboardEditItem, areEqual);
