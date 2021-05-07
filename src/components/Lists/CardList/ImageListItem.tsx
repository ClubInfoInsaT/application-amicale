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
import { Text, TouchableRipple } from 'react-native-paper';
import { Image, StyleSheet, View } from 'react-native';
import type { ServiceItemType } from '../../../managers/ServicesManager';
import GENERAL_STYLES from '../../../constants/Styles';

type PropsType = {
  item: ServiceItemType;
  width: number;
};

const styles = StyleSheet.create({
  ripple: {
    margin: 5,
  },
  text: {
    ...GENERAL_STYLES.centerHorizontal,
    marginTop: 5,
    textAlign: 'center',
  },
});

function ImageListItem(props: PropsType) {
  const { item } = props;
  const source =
    typeof item.image === 'number' ? item.image : { uri: item.image };
  return (
    <TouchableRipple
      style={{
        width: props.width,
        height: props.width + 40,
        ...styles.ripple,
      }}
      onPress={item.onPress}
    >
      <View>
        <Image
          style={{
            width: props.width - 20,
            height: props.width - 20,
            ...GENERAL_STYLES.centerHorizontal,
          }}
          source={source}
        />
        <Text style={styles.text}>{item.title}</Text>
      </View>
    </TouchableRipple>
  );
}

export default React.memo(ImageListItem, () => true);
