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
import {View} from 'react-native';
import {TouchableRipple, withTheme} from 'react-native-paper';
import type {MaterialCommunityIconsGlyphs} from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import type {CustomThemeType} from '../../managers/ThemeManager';

type PropsType = {
  focused: boolean,
  color: string,
  label: string,
  icon: MaterialCommunityIconsGlyphs,
  onPress: () => void,
  onLongPress: () => void,
  theme: CustomThemeType,
  extraData: null | boolean | number | string,
};

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class TabIcon extends React.Component<PropsType> {
  firstRender: boolean;

  constructor(props: PropsType) {
    super(props);
    Animatable.initializeRegistryWithDefinitions({
      focusIn: {
        '0': {
          scale: 1,
          translateY: 0,
        },
        '0.9': {
          scale: 1.3,
          translateY: 7,
        },
        '1': {
          scale: 1.2,
          translateY: 6,
        },
      },
      focusOut: {
        '0': {
          scale: 1.2,
          translateY: 6,
        },
        '1': {
          scale: 1,
          translateY: 0,
        },
      },
    });
    this.firstRender = true;
  }

  componentDidMount() {
    this.firstRender = false;
  }

  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return (
      nextProps.focused !== props.focused ||
      nextProps.theme.dark !== props.theme.dark ||
      nextProps.extraData !== props.extraData
    );
  }

  render(): React.Node {
    const {props} = this;
    return (
      <TouchableRipple
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        borderless
        rippleColor={props.theme.colors.primary}
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <View>
          <Animatable.View
            duration={200}
            easing="ease-out"
            animation={props.focused ? 'focusIn' : 'focusOut'}
            useNativeDriver>
            <MaterialCommunityIcons
              name={props.icon}
              color={props.color}
              size={26}
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </Animatable.View>
          <Animatable.Text
            animation={props.focused ? 'fadeOutDown' : 'fadeIn'}
            useNativeDriver
            style={{
              color: props.color,
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: 10,
            }}>
            {props.label}
          </Animatable.Text>
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(TabIcon);
