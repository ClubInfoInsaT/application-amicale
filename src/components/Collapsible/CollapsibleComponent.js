// @flow

import * as React from 'react';
import {Collapsible} from 'react-navigation-collapsible';
import {withCollapsible} from '../../utils/withCollapsible';
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
