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
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

type Props = {
  isAbsolute?: boolean;
};

const styles = StyleSheet.create({
  container: {
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
});

/**
 * Component used to display a header button
 *
 * @param props Props to pass to the component
 * @return {*}
 */
export default function BasicLoadingScreen(props: Props) {
  const theme = useTheme();
  const { isAbsolute } = props;
  const position = isAbsolute ? 'absolute' : 'relative';
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        position: position,
        ...styles.container,
      }}
    >
      <ActivityIndicator animating size="large" color={theme.colors.primary} />
    </View>
  );
}
