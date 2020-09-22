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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  HeaderButton,
  HeaderButtonProps,
  HeaderButtons,
  HeaderButtonsProps,
} from 'react-navigation-header-buttons';
import {useTheme} from 'react-native-paper';

const MaterialHeaderButton = (props: HeaderButtonProps) => {
  const theme = useTheme();
  return (
    <HeaderButton
      {...props}
      IconComponent={MaterialCommunityIcons}
      iconSize={26}
      color={props.color ? props.color : theme.colors.text}
    />
  );
};

const MaterialHeaderButtons = (props: HeaderButtonsProps) => {
  return (
    <HeaderButtons {...props} HeaderButtonComponent={MaterialHeaderButton} />
  );
};

export default MaterialHeaderButtons;

export {Item} from 'react-navigation-header-buttons';
