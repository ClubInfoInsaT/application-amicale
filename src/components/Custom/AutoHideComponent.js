// @flow

import * as React from 'react';
import {Animated} from 'react-native'
import {AnimatedValue} from "react-native-reanimated";

type Props = {
    children: React.Node,
    style: Object,
}

type State = {
    fabPosition: AnimatedValue
}

export default class AutoHideComponent extends React.Component<Props, State> {

    isAnimationDownPlaying: boolean;
    isAnimationUpPlaying: boolean;

    downAnimation;
    upAnimation;

    lastOffset: number;

    state = {
        fabPosition: new Animated.Value(0),
    };

    constructor() {
        super();
    }

    onScroll({nativeEvent}: Object) {
        const speed = nativeEvent.contentOffset.y < 0 ? 0 : this.lastOffset - nativeEvent.contentOffset.y;
        if (speed < -5) { // Go down
            if (!this.isAnimationDownPlaying) {
                this.isAnimationDownPlaying = true;
                if (this.isAnimationUpPlaying)
                    this.upAnimation.stop();
                this.downAnimation = Animated.spring(this.state.fabPosition, {
                    toValue: 100,
                    duration: 50,
                    useNativeDriver: true,
                });
                this.downAnimation.start(() => {
                    this.isAnimationDownPlaying = false
                });
            }
        } else if (speed > 5) { // Go up
            if (!this.isAnimationUpPlaying) {
                this.isAnimationUpPlaying = true;
                if (this.isAnimationDownPlaying)
                    this.downAnimation.stop();
                this.upAnimation = Animated.spring(this.state.fabPosition, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true,
                });
                this.upAnimation.start(() => {
                    this.isAnimationUpPlaying = false
                });
            }
        }
        this.lastOffset = nativeEvent.contentOffset.y;
    }

    render() {
        return (
            <Animated.View style={{
                ...this.props.style,
                transform: [{translateY: this.state.fabPosition}]
            }}>
                {this.props.children}
            </Animated.View>
        );
    }
}