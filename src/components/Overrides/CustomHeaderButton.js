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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {HeaderButton, HeaderButtons} from 'react-navigation-header-buttons';
import {withTheme} from 'react-native-paper';
import type {CustomThemeType} from '../../managers/ThemeManager';

const MaterialHeaderButton = (props: {
  theme: CustomThemeType,
  color: string,
}): React.Node => {
  const {color, theme} = props;
  return (
    // $FlowFixMe
    <HeaderButton
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      IconComponent={MaterialCommunityIcons}
      iconSize={26}
      color={color != null ? color : theme.colors.text}
    />
  );
};

const MaterialHeaderButtons = (props: {...}): React.Node => {
  return (
    // $FlowFixMe
    <HeaderButtons
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      HeaderButtonComponent={withTheme(MaterialHeaderButton)}
    />
  );
};

export default MaterialHeaderButtons;

export {Item} from 'react-navigation-header-buttons';
