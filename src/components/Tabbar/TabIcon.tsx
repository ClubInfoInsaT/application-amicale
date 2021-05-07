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
import { StyleSheet, View } from 'react-native';
import { TouchableRipple, withTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import GENERAL_STYLES from '../../constants/Styles';

type PropsType = {
  focused: boolean;
  color: string;
  label: string;
  icon: string;
  onPress: () => void;
  onLongPress: () => void;
  theme: ReactNativePaper.Theme;
  extraData: null | boolean | number | string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
  },
  text: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 10,
  },
});

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
          // @ts-ignore
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
          // @ts-ignore
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
    const { props } = this;
    return (
      nextProps.focused !== props.focused ||
      nextProps.theme.dark !== props.theme.dark ||
      nextProps.extraData !== props.extraData
    );
  }

  render() {
    const { props } = this;
    return (
      <TouchableRipple
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        rippleColor={props.theme.colors.primary}
        borderless={true}
        style={styles.container}
      >
        <View>
          <Animatable.View
            duration={200}
            easing="ease-out"
            animation={props.focused ? 'focusIn' : 'focusOut'}
            useNativeDriver
          >
            <MaterialCommunityIcons
              name={props.icon}
              color={props.color}
              size={26}
              style={GENERAL_STYLES.centerHorizontal}
            />
          </Animatable.View>
          <Animatable.Text
            animation={props.focused ? 'fadeOutDown' : 'fadeIn'}
            useNativeDriver
            style={{
              color: props.color,
              ...styles.text,
            }}
          >
            {props.label}
          </Animatable.Text>
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(TabIcon);
