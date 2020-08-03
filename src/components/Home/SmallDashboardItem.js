// @flow

import * as React from 'react';
import {Badge, TouchableRipple, withTheme} from 'react-native-paper';
import {Dimensions, Image, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import type {CustomTheme} from '../../managers/ThemeManager';

type PropsType = {
  image: string | null,
  onPress: () => void | null,
  badgeCount: number | null,
  theme: CustomTheme,
};

const AnimatableBadge = Animatable.createAnimatableComponent(Badge);

/**
 * Component used to render a small dashboard item
 */
class SmallDashboardItem extends React.Component<PropsType> {
  itemSize: number;

  constructor(props: PropsType) {
    super(props);
    this.itemSize = Dimensions.get('window').width / 8;
  }

  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return (
      nextProps.theme.dark !== props.theme.dark ||
      nextProps.badgeCount !== props.badgeCount
    );
  }

  render(): React.Node {
    const {props} = this;
    return (
      <TouchableRipple
        onPress={props.onPress}
        borderless
        style={{
          marginLeft: this.itemSize / 6,
          marginRight: this.itemSize / 6,
        }}>
        <View
          style={{
            width: this.itemSize,
            height: this.itemSize,
          }}>
          <Image
            source={{uri: props.image}}
            style={{
              width: '80%',
              height: '80%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          />
          {props.badgeCount != null && props.badgeCount > 0 ? (
            <AnimatableBadge
              animation="zoomIn"
              duration={300}
              useNativeDriver
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: props.theme.colors.primary,
                borderColor: props.theme.colors.background,
                borderWidth: 2,
              }}>
              {props.badgeCount}
            </AnimatableBadge>
          ) : null}
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(SmallDashboardItem);
