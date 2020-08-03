// @flow

import * as React from 'react';
import {Text, TouchableRipple} from 'react-native-paper';
import {Image, View} from 'react-native';
import type {ServiceItemType} from '../../../managers/ServicesManager';

type PropsType = {
  item: ServiceItemType,
  width: number,
};

export default class ImageListItem extends React.Component<PropsType> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {props} = this;
    const {item} = props;
    const source =
      typeof item.image === 'number' ? item.image : {uri: item.image};
    return (
      <TouchableRipple
        style={{
          width: props.width,
          height: props.width + 40,
          margin: 5,
        }}
        onPress={item.onPress}>
        <View>
          <Image
            style={{
              width: props.width - 20,
              height: props.width - 20,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            source={source}
          />
          <Text
            style={{
              marginTop: 5,
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'center',
            }}>
            {item.title}
          </Text>
        </View>
      </TouchableRipple>
    );
  }
}
