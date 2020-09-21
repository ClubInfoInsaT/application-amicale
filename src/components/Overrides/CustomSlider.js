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
import {Text, withTheme} from 'react-native-paper';
import {View} from 'react-native-animatable';
import Slider, {SliderProps} from '@react-native-community/slider';
import type {CustomThemeType} from '../../managers/ThemeManager';

type PropsType = {
  theme: CustomThemeType,
  valueSuffix?: string,
  ...SliderProps,
};

type StateType = {
  currentValue: number,
};

/**
 * Abstraction layer for Modalize component, using custom configuration
 *
 * @param props Props to pass to the element. Must specify an onRef prop to get an Modalize ref.
 * @return {*}
 */
class CustomSlider extends React.Component<PropsType, StateType> {
  static defaultProps = {
    valueSuffix: '',
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      currentValue: props.value,
    };
  }

  onValueChange = (value: number) => {
    const {props} = this;
    this.setState({currentValue: value});
    if (props.onValueChange != null) props.onValueChange(value);
  };

  render(): React.Node {
    const {props, state} = this;
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text
          style={{
            marginHorizontal: 10,
            marginTop: 'auto',
            marginBottom: 'auto',
          }}>
          {state.currentValue}min
        </Text>
        <Slider
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          onValueChange={this.onValueChange}
        />
      </View>
    );
  }
}

export default withTheme(CustomSlider);
