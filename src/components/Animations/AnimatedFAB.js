// @flow

import * as React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import AutoHideHandler from '../../utils/AutoHideHandler';
import CustomTabBar from '../Tabbar/CustomTabBar';

type PropsType = {
  icon: string,
  onPress: () => void,
};

const AnimatedFab = Animatable.createAnimatableComponent(FAB);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
});

export default class AnimatedFAB extends React.Component<PropsType> {
  ref: {current: null | Animatable.View};

  hideHandler: AutoHideHandler;

  constructor() {
    super();
    this.ref = React.createRef();
    this.hideHandler = new AutoHideHandler(false);
    this.hideHandler.addListener(this.onHideChange);
  }

  onScroll = (event: SyntheticEvent<EventTarget>) => {
    this.hideHandler.onScroll(event);
  };

  onHideChange = (shouldHide: boolean) => {
    if (this.ref.current != null) {
      if (shouldHide) this.ref.current.bounceOutDown(1000);
      else this.ref.current.bounceInUp(1000);
    }
  };

  render(): React.Node {
    const {props} = this;
    return (
      <AnimatedFab
        ref={this.ref}
        useNativeDriver
        icon={props.icon}
        onPress={props.onPress}
        style={{
          ...styles.fab,
          bottom: CustomTabBar.TAB_BAR_HEIGHT,
        }}
      />
    );
  }
}
