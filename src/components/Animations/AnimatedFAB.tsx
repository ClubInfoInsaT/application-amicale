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
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { FAB } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import AutoHideHandler from '../../utils/AutoHideHandler';
import CustomTabBar from '../Tabbar/CustomTabBar';

type PropsType = {
  icon: string;
  onPress: () => void;
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
});

export default class AnimatedFAB extends React.Component<PropsType> {
  ref: { current: null | (Animatable.View & View) };

  hideHandler: AutoHideHandler;

  constructor(props: PropsType) {
    super(props);
    this.ref = React.createRef();
    this.hideHandler = new AutoHideHandler(false);
    this.hideHandler.addListener(this.onHideChange);
  }

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.hideHandler.onScroll(event);
  };

  onHideChange = (shouldHide: boolean) => {
    const ref = this.ref;
    if (
      ref &&
      ref.current &&
      ref.current.bounceOutDown &&
      ref.current.bounceInUp
    ) {
      if (shouldHide) {
        ref.current.bounceOutDown(1000);
      } else {
        ref.current.bounceInUp(1000);
      }
    }
  };

  render() {
    const { props } = this;
    return (
      <Animatable.View
        ref={this.ref}
        useNativeDriver={true}
        style={{
          ...styles.fab,
          bottom: CustomTabBar.TAB_BAR_HEIGHT,
        }}
      >
        <FAB icon={props.icon} onPress={props.onPress} />
      </Animatable.View>
    );
  }
}
