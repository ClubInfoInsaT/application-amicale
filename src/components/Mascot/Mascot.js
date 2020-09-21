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
import * as Animatable from 'react-native-animatable';
import {Image, TouchableWithoutFeedback, View} from 'react-native';
import type {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheet';

export type AnimatableViewRefType = {current: null | Animatable.View};

type PropsType = {
  emotion?: number,
  animated?: boolean,
  style?: ViewStyle | null,
  entryAnimation?: Animatable.AnimatableProperties | null,
  loopAnimation?: Animatable.AnimatableProperties | null,
  onPress?: null | ((viewRef: AnimatableViewRefType) => void),
  onLongPress?: null | ((viewRef: AnimatableViewRefType) => void),
};

type StateType = {
  currentEmotion: number,
};

const MASCOT_IMAGE = require('../../../assets/mascot/mascot.png');
const MASCOT_EYES_NORMAL = require('../../../assets/mascot/mascot_eyes_normal.png');
const MASCOT_EYES_GIRLY = require('../../../assets/mascot/mascot_eyes_girly.png');
const MASCOT_EYES_CUTE = require('../../../assets/mascot/mascot_eyes_cute.png');
const MASCOT_EYES_WINK = require('../../../assets/mascot/mascot_eyes_wink.png');
const MASCOT_EYES_HEART = require('../../../assets/mascot/mascot_eyes_heart.png');
const MASCOT_EYES_ANGRY = require('../../../assets/mascot/mascot_eyes_angry.png');
const MASCOT_GLASSES = require('../../../assets/mascot/mascot_glasses.png');
const MASCOT_SUNGLASSES = require('../../../assets/mascot/mascot_sunglasses.png');

export const EYE_STYLE = {
  NORMAL: 0,
  GIRLY: 2,
  CUTE: 3,
  WINK: 4,
  HEART: 5,
  ANGRY: 6,
};

const GLASSES_STYLE = {
  NORMAL: 0,
  COOl: 1,
};

export const MASCOT_STYLE = {
  NORMAL: 0,
  HAPPY: 1,
  GIRLY: 2,
  WINK: 3,
  CUTE: 4,
  INTELLO: 5,
  LOVE: 6,
  COOL: 7,
  ANGRY: 8,
  RANDOM: 999,
};

class Mascot extends React.Component<PropsType, StateType> {
  static defaultProps = {
    emotion: MASCOT_STYLE.NORMAL,
    animated: false,
    style: null,
    entryAnimation: {
      useNativeDriver: true,
      animation: 'rubberBand',
      duration: 2000,
    },
    loopAnimation: {
      useNativeDriver: true,
      animation: 'swing',
      duration: 2000,
      iterationDelay: 250,
      iterationCount: 'infinite',
    },
    onPress: null,
    onLongPress: null,
  };

  viewRef: AnimatableViewRefType;

  eyeList: {[key: number]: number | string};

  glassesList: {[key: number]: number | string};

  onPress: (viewRef: AnimatableViewRefType) => void;

  onLongPress: (viewRef: AnimatableViewRefType) => void;

  initialEmotion: number;

  constructor(props: PropsType) {
    super(props);
    this.viewRef = React.createRef();
    this.eyeList = {};
    this.glassesList = {};
    this.eyeList[EYE_STYLE.NORMAL] = MASCOT_EYES_NORMAL;
    this.eyeList[EYE_STYLE.GIRLY] = MASCOT_EYES_GIRLY;
    this.eyeList[EYE_STYLE.CUTE] = MASCOT_EYES_CUTE;
    this.eyeList[EYE_STYLE.WINK] = MASCOT_EYES_WINK;
    this.eyeList[EYE_STYLE.HEART] = MASCOT_EYES_HEART;
    this.eyeList[EYE_STYLE.ANGRY] = MASCOT_EYES_ANGRY;

    this.glassesList[GLASSES_STYLE.NORMAL] = MASCOT_GLASSES;
    this.glassesList[GLASSES_STYLE.COOl] = MASCOT_SUNGLASSES;

    this.initialEmotion =
      props.emotion != null ? props.emotion : Mascot.defaultProps.emotion;

    if (this.initialEmotion === MASCOT_STYLE.RANDOM)
      this.initialEmotion = Math.floor(Math.random() * MASCOT_STYLE.ANGRY) + 1;

    this.state = {
      currentEmotion: this.initialEmotion,
    };

    if (props.onPress == null) {
      this.onPress = (viewRef: AnimatableViewRefType) => {
        const ref = viewRef.current;
        if (ref != null) {
          this.setState({currentEmotion: MASCOT_STYLE.LOVE});
          ref.rubberBand(1500).then(() => {
            this.setState({currentEmotion: this.initialEmotion});
          });
        }
      };
    } else this.onPress = props.onPress;

    if (props.onLongPress == null) {
      this.onLongPress = (viewRef: AnimatableViewRefType) => {
        const ref = viewRef.current;
        if (ref != null) {
          this.setState({currentEmotion: MASCOT_STYLE.ANGRY});
          ref.tada(1000).then(() => {
            this.setState({currentEmotion: this.initialEmotion});
          });
        }
      };
    } else this.onLongPress = props.onLongPress;
  }

  getGlasses(style: number): React.Node {
    const glasses = this.glassesList[style];
    return (
      <Image
        key="glasses"
        source={
          glasses != null ? glasses : this.glassesList[GLASSES_STYLE.NORMAL]
        }
        style={{
          position: 'absolute',
          top: '15%',
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    );
  }

  getEye(
    style: number,
    isRight: boolean,
    rotation: string = '0deg',
  ): React.Node {
    const eye = this.eyeList[style];
    return (
      <Image
        key={isRight ? 'right' : 'left'}
        source={eye != null ? eye : this.eyeList[EYE_STYLE.NORMAL]}
        style={{
          position: 'absolute',
          top: '15%',
          left: isRight ? '-11%' : '11%',
          width: '100%',
          height: '100%',
          transform: [{rotateY: rotation}],
        }}
      />
    );
  }

  getEyes(emotion: number): React.Node {
    const final = [];
    final.push(
      <View
        key="container"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />,
    );
    if (emotion === MASCOT_STYLE.CUTE) {
      final.push(this.getEye(EYE_STYLE.CUTE, true));
      final.push(this.getEye(EYE_STYLE.CUTE, false));
    } else if (emotion === MASCOT_STYLE.GIRLY) {
      final.push(this.getEye(EYE_STYLE.GIRLY, true));
      final.push(this.getEye(EYE_STYLE.GIRLY, false));
    } else if (emotion === MASCOT_STYLE.HAPPY) {
      final.push(this.getEye(EYE_STYLE.WINK, true));
      final.push(this.getEye(EYE_STYLE.WINK, false));
    } else if (emotion === MASCOT_STYLE.WINK) {
      final.push(this.getEye(EYE_STYLE.WINK, true));
      final.push(this.getEye(EYE_STYLE.NORMAL, false));
    } else if (emotion === MASCOT_STYLE.LOVE) {
      final.push(this.getEye(EYE_STYLE.HEART, true));
      final.push(this.getEye(EYE_STYLE.HEART, false));
    } else if (emotion === MASCOT_STYLE.ANGRY) {
      final.push(this.getEye(EYE_STYLE.ANGRY, true));
      final.push(this.getEye(EYE_STYLE.ANGRY, false, '180deg'));
    } else if (emotion === MASCOT_STYLE.COOL) {
      final.push(this.getGlasses(GLASSES_STYLE.COOl));
    } else {
      final.push(this.getEye(EYE_STYLE.NORMAL, true));
      final.push(this.getEye(EYE_STYLE.NORMAL, false));
    }

    if (emotion === MASCOT_STYLE.INTELLO) {
      // Needs to have normal eyes behind the glasses
      final.push(this.getGlasses(GLASSES_STYLE.NORMAL));
    }
    final.push(<View key="container2" />);
    return final;
  }

  render(): React.Node {
    const {props, state} = this;
    const entryAnimation = props.animated ? props.entryAnimation : null;
    const loopAnimation = props.animated ? props.loopAnimation : null;
    return (
      <Animatable.View
        style={{
          aspectRatio: 1,
          ...props.style,
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...entryAnimation}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.onPress(this.viewRef);
          }}
          onLongPress={() => {
            this.onLongPress(this.viewRef);
          }}>
          <Animatable.View ref={this.viewRef}>
            <Animatable.View
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...loopAnimation}>
              <Image
                source={MASCOT_IMAGE}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
              {this.getEyes(state.currentEmotion)}
            </Animatable.View>
          </Animatable.View>
        </TouchableWithoutFeedback>
      </Animatable.View>
    );
  }
}

export default Mascot;
