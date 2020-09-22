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
import {useTheme} from 'react-native-paper';
import {createCollapsibleStack} from 'react-navigation-collapsible';
import StackNavigator, {StackNavigationOptions} from '@react-navigation/stack';
import {StackNavigationState, TypedNavigator} from '@react-navigation/native';
import {StackNavigationEventMap} from '@react-navigation/stack/lib/typescript/src/types';

type StackNavigatorType = import('@react-navigation/native').TypedNavigator<
  Record<string, object | undefined>,
  StackNavigationState,
  StackNavigationOptions,
  StackNavigationEventMap,
  typeof StackNavigator
>;

/**
 * Creates a navigation stack with the collapsible library, allowing the header to collapse on scroll.
 *
 * Please use the getWebsiteStack function if your screen uses a webview as their main component as it needs special parameters.
 *
 * @param name The screen name in the navigation stack
 * @param Stack The stack component
 * @param component The screen component
 * @param title The screen title shown in the header (needs to be translated)
 * @param useNativeDriver Whether to use the native driver for animations.
 * Set to false if the screen uses a webview as this component does not support native driver.
 * In all other cases, set it to true for increase performance.
 * @param options Screen options to use, or null if no options are necessary.
 * @param headerColor The color of the header. Uses default color if not specified
 * @returns {JSX.Element}
 */
export function CreateScreenCollapsibleStack(
  name: string,
  Stack: TypedNavigator<any, any, any, any, any>,
  component: React.ComponentType<any>,
  title: string,
  useNativeDriver: boolean = true,
  options: StackNavigationOptions = {},
  headerColor?: string,
) {
  const {colors} = useTheme();
  return createCollapsibleStack(
    <Stack.Screen
      name={name}
      component={component}
      options={{
        title,
        headerStyle: {
          backgroundColor: headerColor != null ? headerColor : colors.surface,
        },
        ...options,
      }}
    />,
    {
      collapsedColor: headerColor != null ? headerColor : colors.surface,
      useNativeDriver: useNativeDriver, // native driver does not work with webview
    },
  );
}

/**
 * Creates a navigation stack with the collapsible library, allowing the header to collapse on scroll.
 *
 * This is a preset for screens using a webview as their main component, as it uses special parameters to work.
 * (aka a dirty workaround)
 *
 * @param name
 * @param Stack
 * @param component
 * @param title
 * @returns {JSX.Element}
 */
export function getWebsiteStack(
  name: string,
  Stack: TypedNavigator<any, any, any, any, any>,
  component: React.ComponentType<any>,
  title: string,
) {
  return CreateScreenCollapsibleStack(name, Stack, component, title, false);
}
