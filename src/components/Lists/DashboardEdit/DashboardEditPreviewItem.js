// @flow

import * as React from 'react';
import {TouchableRipple, withTheme} from 'react-native-paper';
import {Dimensions, Image, View} from 'react-native';
import type {CustomTheme} from '../../../managers/ThemeManager';

type PropsType = {
  image: string,
  isActive: boolean,
  onPress: () => void,
  theme: CustomTheme,
};

/**
 * Component used to render a small dashboard item
 */
class DashboardEditPreviewItem extends React.Component<PropsType> {
  itemSize: number;

  constructor(props: PropsType) {
    super(props);
    this.itemSize = Dimensions.get('window').width / 8;
  }

  render(): React.Node {
    const {props} = this;
    return (
      <TouchableRipple
        onPress={props.onPress}
        borderless
        style={{
          marginLeft: 5,
          marginRight: 5,
          backgroundColor: props.isActive
            ? props.theme.colors.textDisabled
            : 'transparent',
          borderRadius: 5,
        }}>
        <View
          style={{
            width: this.itemSize,
            height: this.itemSize,
          }}>
          <Image
            source={{uri: props.image}}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(DashboardEditPreviewItem);
