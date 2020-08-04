// @flow

import * as React from 'react';
import {Image, Platform, View} from 'react-native';
import {FAB, TouchableRipple, withTheme} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import FOCUSED_ICON from '../../../assets/tab-icon.png';
import UNFOCUSED_ICON from '../../../assets/tab-icon-outline.png';
import type {CustomTheme} from '../../managers/ThemeManager';

type PropsType = {
  focused: boolean,
  onPress: () => void,
  onLongPress: () => void,
  theme: CustomTheme,
  tabBarHeight: number,
};

const AnimatedFAB = Animatable.createAnimatableComponent(FAB);

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class TabHomeIcon extends React.Component<PropsType> {
  constructor(props: PropsType) {
    super(props);
    Animatable.initializeRegistryWithDefinitions({
      fabFocusIn: {
        '0': {
          scale: 1,
          translateY: 0,
        },
        '0.9': {
          scale: 1.2,
          translateY: -9,
        },
        '1': {
          scale: 1.1,
          translateY: -7,
        },
      },
      fabFocusOut: {
        '0': {
          scale: 1.1,
          translateY: -6,
        },
        '1': {
          scale: 1,
          translateY: 0,
        },
      },
    });
  }

  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {focused} = this.props;
    return nextProps.focused !== focused;
  }

  getIconRender = ({
    size,
    color,
  }: {
    size: number,
    color: string,
  }): React.Node => {
    const {focused} = this.props;
    if (focused)
      return (
        <Image
          source={FOCUSED_ICON}
          style={{
            width: size,
            height: size,
            tintColor: color,
          }}
        />
      );
    return (
      <Image
        source={UNFOCUSED_ICON}
        style={{
          width: size,
          height: size,
          tintColor: color,
        }}
      />
    );
  };

  render(): React.Node {
    const {props} = this;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <TouchableRipple
          onPress={props.onPress}
          onLongPress={props.onLongPress}
          borderless
          rippleColor={
            Platform.OS === 'android'
              ? props.theme.colors.primary
              : 'transparent'
          }
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: props.tabBarHeight + 30,
            marginBottom: -15,
          }}>
          <AnimatedFAB
            duration={200}
            easing="ease-out"
            animation={props.focused ? 'fabFocusIn' : 'fabFocusOut'}
            icon={this.getIconRender}
            style={{
              marginTop: 15,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        </TouchableRipple>
      </View>
    );
  }
}

export default withTheme(TabHomeIcon);
