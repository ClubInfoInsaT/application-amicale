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
import { Animated, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';
import { Collapsible } from 'react-navigation-collapsible';
import TabIcon from './TabIcon';
import TabHomeIcon from './TabHomeIcon';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavigationState } from '@react-navigation/native';
import {
  PartialState,
  Route,
} from '@react-navigation/routers/lib/typescript/src/types';

type RouteType = Route<string> & {
  state?: NavigationState | PartialState<NavigationState>;
};

interface PropsType extends BottomTabBarProps {
  theme: ReactNativePaper.Theme;
}

type StateType = {
  translateY: any;
};

type validRoutes = 'proxiwash' | 'services' | 'planning' | 'planex';

const TAB_ICONS = {
  proxiwash: 'tshirt-crew',
  services: 'account-circle',
  planning: 'calendar-range',
  planex: 'clock',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

class CustomTabBar extends React.Component<PropsType, StateType> {
  static TAB_BAR_HEIGHT = 48;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      translateY: new Animated.Value(0),
    };
    // @ts-ignore
    props.navigation.addListener('state', this.onRouteChange);
  }

  /**
   * Navigates to the given route if it is different from the current one
   *
   * @param route Destination route
   * @param currentIndex The current route index
   * @param destIndex The destination route index
   */
  onItemPress(route: RouteType, currentIndex: number, destIndex: number) {
    const { navigation } = this.props;
    if (currentIndex !== destIndex) {
      navigation.navigate(route.name);
    }
  }

  /**
   * Navigates to tetris screen on home button long press
   *
   * @param route
   */
  onItemLongPress(route: RouteType) {
    const { navigation } = this.props;
    if (route.name === 'home') {
      navigation.navigate('game-start');
    }
  }

  /**
   * Finds the active route and syncs the tab bar animation with the header bar
   */
  onRouteChange = () => {
    const { props } = this;
    props.state.routes.map(this.syncTabBar);
  };

  /**
   * Gets an icon for the given route if it is not the home one as it uses a custom button
   *
   * @param route
   * @param focused
   * @returns {null}
   */
  getTabBarIcon = (route: RouteType, focused: boolean) => {
    let icon = TAB_ICONS[route.name as validRoutes];
    icon = focused ? icon : `${icon}-outline`;
    if (route.name !== 'home') {
      return icon;
    }
    return '';
  };

  /**
   * Gets a tab icon render.
   * If the given route is focused, it syncs the tab bar and header bar animations together
   *
   * @param route The route for the icon
   * @param index The index of the current route
   * @returns {*}
   */
  getRenderIcon = (route: RouteType, index: number) => {
    const { props } = this;
    const { state } = props;
    const { options } = props.descriptors[route.key];
    let label;
    if (options.tabBarLabel != null) {
      label = options.tabBarLabel;
    } else if (options.title != null) {
      label = options.title;
    } else {
      label = route.name;
    }

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
          label={label as string}
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

  getIcons() {
    const { props } = this;
    return props.state.routes.map(this.getRenderIcon);
  }

  syncTabBar = (route: RouteType, index: number) => {
    const { state } = this.props;
    const isFocused = state.index === index;
    if (isFocused) {
      const stackState = route.state;
      const stackRoute =
        stackState && stackState.index != null
          ? stackState.routes[stackState.index]
          : null;
      const params: { collapsible: Collapsible } | null | undefined = stackRoute
        ? (stackRoute.params as { collapsible: Collapsible })
        : null;
      const collapsible = params != null ? params.collapsible : null;
      if (collapsible != null) {
        this.setState({
          translateY: Animated.multiply(-1.5, collapsible.translateY), // Hide tab bar faster than header bar
        });
      }
    }
  };

  render() {
    const { props, state } = this;
    const icons = this.getIcons();
    return (
      <Animated.View
        style={{
          height: CustomTabBar.TAB_BAR_HEIGHT,
          backgroundColor: props.theme.colors.surface,
          transform: [{ translateY: state.translateY }],
          ...styles.container,
        }}
      >
        {icons}
      </Animated.View>
    );
  }
}

export default withTheme(CustomTabBar);
