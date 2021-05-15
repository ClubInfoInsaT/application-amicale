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

import React, { useCallback } from 'react';
import { useCollapsibleHeader } from 'react-navigation-collapsible';
import { TAB_BAR_HEIGHT } from '../Tabbar/CustomTabBar';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useCollapsible } from '../../context/CollapsibleContext';
import { useFocusEffect } from '@react-navigation/core';

export type CollapsibleComponentPropsType = {
  children?: React.ReactNode;
  hasTab?: boolean;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  paddedProps?: (paddingTop: number) => Record<string, any>;
  headerColors?: string;
};

type Props = CollapsibleComponentPropsType & {
  component: React.ComponentType<any>;
};

const styles = StyleSheet.create({
  main: {
    minHeight: '100%',
  },
});

function CollapsibleComponent(props: Props) {
  const { paddedProps, headerColors } = props;
  const Comp = props.component;
  const theme = useTheme();
  const { setCollapsible } = useCollapsible();

  const collapsible = useCollapsibleHeader({
    config: {
      collapsedColor: headerColors ? headerColors : theme.colors.surface,
      useNativeDriver: true,
    },
  });

  useFocusEffect(
    useCallback(() => {
      setCollapsible(collapsible);
    }, [collapsible, setCollapsible])
  );

  const {
    containerPaddingTop,
    scrollIndicatorInsetTop,
    onScrollWithListener,
  } = collapsible;

  const paddingBottom = props.hasTab ? TAB_BAR_HEIGHT : 0;

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (props.onScroll) {
      props.onScroll(event);
    }
  };

  const pprops =
    paddedProps !== undefined ? paddedProps(containerPaddingTop) : undefined;

  return (
    <Comp
      {...props}
      {...pprops}
      onScroll={onScrollWithListener(onScroll)}
      contentContainerStyle={{
        paddingTop: containerPaddingTop,
        paddingBottom: paddingBottom,
        ...styles.main,
      }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
    >
      {props.children}
    </Comp>
  );
}

export default CollapsibleComponent;
