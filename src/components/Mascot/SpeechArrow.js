// @flow

import * as React from 'react';
import {View} from 'react-native';
import type {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheet';

type PropsType = {
  style?: ViewStyle | null,
  size: number,
  color: string,
};

export default class SpeechArrow extends React.Component<PropsType> {
  static defaultProps = {
    style: null,
  };

  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {props} = this;
    return (
      <View style={props.style}>
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 0,
            borderRightWidth: props.size,
            borderBottomWidth: props.size,
            borderStyle: 'solid',
            backgroundColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: props.color,
          }}
        />
      </View>
    );
  }
}
