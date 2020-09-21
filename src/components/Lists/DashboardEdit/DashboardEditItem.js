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
import {Image} from 'react-native';
import {List, withTheme} from 'react-native-paper';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {ServiceItemType} from '../../../managers/ServicesManager';
import type {ListIconPropsType} from '../../../constants/PaperStyles';

type PropsType = {
  item: ServiceItemType,
  isActive: boolean,
  height: number,
  onPress: () => void,
  theme: CustomThemeType,
};

class DashboardEditItem extends React.Component<PropsType> {
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {isActive} = this.props;
    return nextProps.isActive !== isActive;
  }

  render(): React.Node {
    const {item, onPress, height, isActive, theme} = this.props;
    return (
      <List.Item
        title={item.title}
        description={item.subtitle}
        onPress={isActive ? null : onPress}
        left={(): React.Node => (
          <Image
            source={{uri: item.image}}
            style={{
              width: 40,
              height: 40,
            }}
          />
        )}
        right={(props: ListIconPropsType): React.Node =>
          isActive ? (
            <List.Icon
              style={props.style}
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
}

export default withTheme(DashboardEditItem);
