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
import { StyleSheet, View, ViewStyle } from 'react-native';

type PropsType = {
  style?: ViewStyle;
  size: number;
  color: string;
};

const styles = StyleSheet.create({
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

export default function SpeechArrow(props: PropsType) {
  return (
    <View style={props.style}>
      <View
        style={{
          ...styles.arrow,
          borderRightWidth: props.size,
          borderBottomWidth: props.size,
          borderBottomColor: props.color,
        }}
      />
    </View>
  );
}
