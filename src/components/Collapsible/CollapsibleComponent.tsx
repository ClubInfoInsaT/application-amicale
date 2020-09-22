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
import {useCollapsibleStack} from 'react-navigation-collapsible';
import CustomTabBar from '../Tabbar/CustomTabBar';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

export interface CollapsibleComponentPropsType {
  children?: React.ReactNode;
  hasTab?: boolean;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

interface PropsType extends CollapsibleComponentPropsType {
  component: React.ComponentType<any>;
}

function CollapsibleComponent(props: PropsType) {
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (props.onScroll) {
      props.onScroll(event);
    }
  };
  const Comp = props.component;
  const {
    containerPaddingTop,
    scrollIndicatorInsetTop,
    onScrollWithListener,
  } = useCollapsibleStack();

  return (
    <Comp
      {...props}
      onScroll={onScrollWithListener(onScroll)}
      contentContainerStyle={{
        paddingTop: containerPaddingTop,
        paddingBottom: props.hasTab ? CustomTabBar.TAB_BAR_HEIGHT : 0,
        minHeight: '100%',
      }}
      scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}>
      {props.children}
    </Comp>
  );
}

export default CollapsibleComponent;
