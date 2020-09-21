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
import {Image, Platform, View} from 'react-native';
import {FAB, TouchableRipple, withTheme} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import FOCUSED_ICON from '../../../assets/tab-icon.png';
import UNFOCUSED_ICON from '../../../assets/tab-icon-outline.png';
import type {CustomThemeType} from '../../managers/ThemeManager';

type PropsType = {
  focused: boolean,
  onPress: () => void,
  onLongPress: () => void,
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
    return (
      <Image
        source={focused ? FOCUSED_ICON : UNFOCUSED_ICON}
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
        <View
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
            onPress={props.onPress}
            onLongPress={props.onLongPress}
            style={{
              marginTop: 15,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        </View>
      </View>
    );
  }
}

export default TabHomeIcon;
