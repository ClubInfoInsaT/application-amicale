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
import {Animated} from 'react-native';
import {withTheme} from 'react-native-paper';
import {Collapsible} from 'react-navigation-collapsible';
import {StackNavigationProp} from '@react-navigation/stack';
import TabIcon from './TabIcon';
import TabHomeIcon from './TabHomeIcon';
import type {CustomThemeType} from '../../managers/ThemeManager';

type RouteType = {
  name: string,
  key: string,
  params: {collapsible: Collapsible},
  state: {
    index: number,
    routes: Array<RouteType>,
  },
};

type PropsType = {
  state: {
    index: number,
    routes: Array<RouteType>,
  },
  descriptors: {
    [key: string]: {
      options: {
        tabBarLabel: string,
        title: string,
      },
    },
  },
  navigation: StackNavigationProp,
  theme: CustomThemeType,
};

type StateType = {
  // eslint-disable-next-line flowtype/no-weak-types
  translateY: any,
};

const TAB_ICONS = {
  proxiwash: 'tshirt-crew',
  services: 'account-circle',
  planning: 'calendar-range',
  planex: 'clock',
};

class CustomTabBar extends React.Component<PropsType, StateType> {
  static TAB_BAR_HEIGHT = 48;

  constructor() {
    super();
    this.state = {
      translateY: new Animated.Value(0),
    };
  }

  /**
   * Navigates to the given route if it is different from the current one
   *
   * @param route Destination route
   * @param currentIndex The current route index
   * @param destIndex The destination route index
   */
  onItemPress(route: RouteType, currentIndex: number, destIndex: number) {
    const {navigation} = this.props;
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (currentIndex !== destIndex && !event.defaultPrevented)
      navigation.navigate(route.name);
  }

  /**
   * Navigates to tetris screen on home button long press
   *
   * @param route
   */
  onItemLongPress(route: RouteType) {
    const {navigation} = this.props;
    const event = navigation.emit({
      type: 'tabLongPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (route.name === 'home' && !event.defaultPrevented)
      navigation.navigate('game-start');
  }

  /**
   * Finds the active route and syncs the tab bar animation with the header bar
   */
  onRouteChange = () => {
    const {props} = this;
    props.state.routes.map(this.syncTabBar);
  };

  /**
   * Gets an icon for the given route if it is not the home one as it uses a custom button
   *
   * @param route
   * @param focused
   * @returns {null}
   */
  getTabBarIcon = (route: RouteType, focused: boolean): React.Node => {
    let icon = TAB_ICONS[route.name];
    icon = focused ? icon : `${icon}-outline`;
    if (route.name !== 'home') return icon;
    return null;
  };

  /**
   * Gets a tab icon render.
   * If the given route is focused, it syncs the tab bar and header bar animations together
   *
   * @param route The route for the icon
   * @param index The index of the current route
   * @returns {*}
   */
  getRenderIcon = (route: RouteType, index: number): React.Node => {
    const {props} = this;
    const {state} = props;
    const {options} = props.descriptors[route.key];
    let label;
    if (options.tabBarLabel != null) label = options.tabBarLabel;
    else if (options.title != null) label = options.title;
    else label = route.name;

    const onPress = () => {
      this.onItemPress(route, state.index, index);
    };
    const onLongPress = () => {
      this.onItemLongPress(route);
    };
    const isFocused = state.index === index;

    const color = isFocused
      ? props.theme.colors.primary
      : props.theme.colors.tabIcon;
    if (route.name !== 'home') {
      return (
        <TabIcon
          onPress={onPress}
          onLongPress={onLongPress}
          icon={this.getTabBarIcon(route, isFocused)}
          color={color}
          label={label}
          focused={isFocused}
          extraData={state.index > index}
          key={route.key}
        />
      );
    }
    return (
      <TabHomeIcon
        onPress={onPress}
        onLongPress={onLongPress}
        focused={isFocused}
        key={route.key}
        tabBarHeight={CustomTabBar.TAB_BAR_HEIGHT}
      />
    );
  };

  getIcons(): React.Node {
    const {props} = this;
    return props.state.routes.map(this.getRenderIcon);
  }

  syncTabBar = (route: RouteType, index: number) => {
    const {state} = this.props;
    const isFocused = state.index === index;
    if (isFocused) {
      const stackState = route.state;
      const stackRoute =
        stackState != null ? stackState.routes[stackState.index] : null;
      const params: {collapsible: Collapsible} | null =
        stackRoute != null ? stackRoute.params : null;
      const collapsible = params != null ? params.collapsible : null;
      if (collapsible != null) {
        this.setState({
          translateY: Animated.multiply(-1.5, collapsible.translateY), // Hide tab bar faster than header bar
        });
      }
    }
  };

  render(): React.Node {
    const {props, state} = this;
    props.navigation.addListener('state', this.onRouteChange);
    const icons = this.getIcons();
    return (
      // $FlowFixMe
      <Animated.View
        useNativeDriver
        style={{
          flexDirection: 'row',
          height: CustomTabBar.TAB_BAR_HEIGHT,
          width: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: props.theme.colors.surface,
          transform: [{translateY: state.translateY}],
        }}>
        {icons}
      </Animated.View>
    );
  }
}

export default withTheme(CustomTabBar);
