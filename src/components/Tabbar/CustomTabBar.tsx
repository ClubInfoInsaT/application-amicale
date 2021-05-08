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

import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Animated, StyleSheet } from 'react-native';
import TabIcon from './TabIcon';
import { useTheme } from 'react-native-paper';
import { useCollapsible } from '../../utils/CollapsibleContext';

export const TAB_BAR_HEIGHT = 50;

function CustomTabBar(
  props: BottomTabBarProps<any> & {
    icons: {
      [key: string]: {
        normal: string;
        focused: string;
      };
    };
    labels: {
      [key: string]: string;
    };
  }
) {
  const state = props.state;
  const theme = useTheme();

  const { collapsible } = useCollapsible();
  let translateY: number | Animated.AnimatedInterpolation = 0;
  if (collapsible) {
    translateY = Animated.multiply(-1.5, collapsible.translateY);
  }

  return (
    <Animated.View
      style={{
        ...styles.bar,
        backgroundColor: theme.colors.surface,
        transform: [{ translateY: translateY }],
      }}
    >
      {state.routes.map(
        (
          route: {
            key: string;
            name: string;
            params?: object | undefined;
          },
          index: number
        ) => {
          const iconData = props.icons[route.name];
          return (
            <TabIcon
              isMiddle={index === 2}
              onPress={() => props.navigation.navigate(route.name)}
              icon={iconData.normal}
              focusedIcon={iconData.focused}
              label={props.labels[route.name]}
              focused={state.index === index}
              key={route.key}
            />
          );
        }
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

function areEqual(
  prevProps: BottomTabBarProps<any>,
  nextProps: BottomTabBarProps<any>
) {
  return prevProps.state.index === nextProps.state.index;
}

export default React.memo(CustomTabBar, areEqual);
