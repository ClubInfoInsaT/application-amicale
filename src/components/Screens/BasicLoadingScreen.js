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
import {ActivityIndicator, withTheme} from 'react-native-paper';
import type {CustomThemeType} from '../../managers/ThemeManager';

/**
 * Component used to display a header button
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function BasicLoadingScreen(props: {
  theme: CustomThemeType,
  isAbsolute: boolean,
}): React.Node {
  const {theme, isAbsolute} = props;
  const {colors} = theme;
  let position;
  if (isAbsolute != null && isAbsolute) position = 'absolute';

  return (
    <View
      style={{
        backgroundColor: colors.background,
        position,
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}>
      <ActivityIndicator animating size="large" color={colors.primary} />
    </View>
  );
}

export default withTheme(BasicLoadingScreen);
