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
import { TouchableRipple } from 'react-native-paper';
import { Image } from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, ViewStyle } from 'react-native';
import { MainRoutes } from '../../navigation/MainNavigator';

type PropsType = {
  images: Array<{ url: string }>;
  style: ViewStyle;
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

function ImageGalleryButton(props: PropsType) {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(MainRoutes.Gallery, { images: props.images });
  };

  return (
    <TouchableRipple onPress={onPress} style={props.style}>
      <Image
        resizeMode="contain"
        source={{ uri: props.images[0].url }}
        style={styles.image}
      />
    </TouchableRipple>
  );
}

export default ImageGalleryButton;
