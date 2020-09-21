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
import {Collapsible} from 'react-navigation-collapsible';
import withCollapsible from '../../utils/withCollapsible';
import CustomTabBar from '../Tabbar/CustomTabBar';

export type CollapsibleComponentPropsType = {
  children?: React.Node,
  hasTab?: boolean,
  onScroll?: (event: SyntheticEvent<EventTarget>) => void,
};

type PropsType = {
  ...CollapsibleComponentPropsType,
  collapsibleStack: Collapsible,
  // eslint-disable-next-line flowtype/no-weak-types
  component: any,
};

class CollapsibleComponent extends React.Component<PropsType> {
  static defaultProps = {
    children: null,
    hasTab: false,
    onScroll: null,
  };

  onScroll = (event: SyntheticEvent<EventTarget>) => {
    const {props} = this;
    if (props.onScroll) props.onScroll(event);
  };

  render(): React.Node {
    const {props} = this;
    const Comp = props.component;
    const {
      containerPaddingTop,
      scrollIndicatorInsetTop,
      onScrollWithListener,
    } = props.collapsibleStack;

    return (
      <Comp
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        onScroll={onScrollWithListener(this.onScroll)}
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
}

export default withCollapsible(CollapsibleComponent);
