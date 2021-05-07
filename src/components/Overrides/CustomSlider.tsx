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
import { Text } from 'react-native-paper';
import { View } from 'react-native-animatable';
import Slider, { SliderProps } from '@react-native-community/slider';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

type PropsType = {
  valueSuffix?: string;
} & SliderProps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    marginHorizontal: 10,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

/**
 * Abstraction layer for Modalize component, using custom configuration
 *
 * @param props Props to pass to the element. Must specify an onRef prop to get an Modalize ref.
 * @return {*}
 */
function CustomSlider(props: PropsType) {
  const [currentValue, setCurrentValue] = useState(props.value);

  const onValueChange = (value: number) => {
    setCurrentValue(value);
    if (props.onValueChange) {
      props.onValueChange(value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{currentValue}min</Text>
      <Slider {...props} ref={undefined} onValueChange={onValueChange} />
    </View>
  );
}

export default CustomSlider;
