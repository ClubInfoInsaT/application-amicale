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
