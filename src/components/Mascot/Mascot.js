// @flow

import * as React from 'react';
import * as Animatable from "react-native-animatable";
import {Image, TouchableWithoutFeedback, View} from "react-native";

type Props = {
    size: number,
    emotion: number,
    animated: boolean,
    entryAnimation: Animatable.AnimatableProperties | null,
    loopAnimation: Animatable.AnimatableProperties | null,
    onPress?: (viewRef: AnimatableViewRef) => null,
    onLongPress?: (viewRef: AnimatableViewRef) => null,
}

type State = {
    currentEmotion: number,
}

export type AnimatableViewRef = {current: null | Animatable.View};

const MASCOT_IMAGE = require("../../../assets/mascot/mascot.png");
const MASCOT_EYES_NORMAL = require("../../../assets/mascot/mascot_eyes_normal.png");
const MASCOT_EYES_GIRLY = require("../../../assets/mascot/mascot_eyes_girly.png");
const MASCOT_EYES_CUTE = require("../../../assets/mascot/mascot_eyes_cute.png");
const MASCOT_EYES_WINK = require("../../../assets/mascot/mascot_eyes_wink.png");
const MASCOT_EYES_HEART = require("../../../assets/mascot/mascot_eyes_heart.png");
const MASCOT_EYES_ANGRY = require("../../../assets/mascot/mascot_eyes_angry.png");
const MASCOT_GLASSES = require("../../../assets/mascot/mascot_glasses.png");
const MASCOT_SUNGLASSES = require("../../../assets/mascot/mascot_sunglasses.png");

export const EYE_STYLE = {
    NORMAL: 0,
    GIRLY: 2,
    CUTE: 3,
    WINK: 4,
    HEART: 5,
    ANGRY: 6,
}

const GLASSES_STYLE = {
    NORMAL: 0,
    COOl: 1
}

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


class Mascot extends React.Component<Props, State> {

    static defaultProps = {
        animated: false,
        entryAnimation: {
            useNativeDriver: true,
            animation: "rubberBand",
            duration: 2000,
        },
        loopAnimation: {
            useNativeDriver: true,
            animation: "swing",
            duration: 2000,
            iterationDelay: 250,
            iterationCount: "infinite",
        },
        clickAnimation: {
            useNativeDriver: true,
            animation: "rubberBand",
            duration: 2000,
        },
    }

    viewRef: AnimatableViewRef;
    eyeList: { [key: number]: number | string };
    glassesList: { [key: number]: number | string };

    onPress: (viewRef: AnimatableViewRef) => null;
    onLongPress: (viewRef: AnimatableViewRef) => null;

    initialEmotion: number;

    constructor(props: Props) {
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

        this.initialEmotion = this.props.emotion;

        if (this.initialEmotion === MASCOT_STYLE.RANDOM)
            this.initialEmotion = Math.floor(Math.random() * MASCOT_STYLE.ANGRY) + 1;

        this.state = {
            currentEmotion: this.initialEmotion
        }

        if (this.props.onPress == null) {
            this.onPress = (viewRef: AnimatableViewRef) => {
                if (viewRef.current != null) {
                    this.setState({currentEmotion: MASCOT_STYLE.LOVE});
                    viewRef.current.rubberBand(1500).then(() => {
                        this.setState({currentEmotion: this.initialEmotion});
                    });

                }
                return null;
            }
        } else
            this.onPress = this.props.onPress;

        if (this.props.onLongPress == null) {
            this.onLongPress = (viewRef: AnimatableViewRef) => {
                if (viewRef.current != null) {
                    this.setState({currentEmotion: MASCOT_STYLE.ANGRY});
                    viewRef.current.tada(1000).then(() => {
                        this.setState({currentEmotion: this.initialEmotion});
                    });

                }
                return null;
            }
        } else
            this.onLongPress = this.props.onLongPress;

    }

    getGlasses(style: number) {
        const glasses = this.glassesList[style];
        return <Image
            key={"glasses"}
            source={glasses != null ? glasses : this.glassesList[GLASSES_STYLE.NORMAL]}
            style={{
                position: "absolute",
                top: "15%",
                left: 0,
                width: this.props.size,
                height: this.props.size,
            }}
        />
    }

    getEye(style: number, isRight: boolean, rotation: string="0deg") {
        const eye = this.eyeList[style];
        return <Image
            key={isRight ? "right" : "left"}
            source={eye != null ? eye : this.eyeList[EYE_STYLE.NORMAL]}
            style={{
                position: "absolute",
                top: "15%",
                left: isRight ? "-11%" : "11%",
                width: this.props.size,
                height: this.props.size,
                transform: [{rotateY: rotation}]
            }}
        />
    }

    getEyes(emotion: number) {
        let final = [];
        final.push(<View
            key={"container"}
            style={{
                position: "absolute",
                width: this.props.size,
                height: this.props.size,
            }}/>);
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
            final.push(this.getEye(EYE_STYLE.ANGRY, false, "180deg"));
        } else if (emotion === MASCOT_STYLE.COOL) {
            final.push(this.getGlasses(GLASSES_STYLE.COOl));
        } else {
            final.push(this.getEye(EYE_STYLE.NORMAL, true));
            final.push(this.getEye(EYE_STYLE.NORMAL, false));
        }

        if (emotion === MASCOT_STYLE.INTELLO) { // Needs to have normal eyes behind the glasses
            final.push(this.getGlasses(GLASSES_STYLE.NORMAL));
        }
        final.push(<View key={"container2"}/>);
        return final;
    }

    render() {
        const size = this.props.size;
        const entryAnimation = this.props.animated ? this.props.entryAnimation : null;
        const loopAnimation = this.props.animated ? this.props.loopAnimation : null;
        return (
            <Animatable.View
                style={{
                    width: size,
                    height: size,
                }}
                {...entryAnimation}
            >
                <TouchableWithoutFeedback
                    onPress={() => this.onPress(this.viewRef)}
                    onLongPress={() => this.onLongPress(this.viewRef)}
                >
                    <Animatable.View
                        ref={this.viewRef}
                    >
                        <Animatable.View
                            {...loopAnimation}
                        >
                            <Image
                                source={MASCOT_IMAGE}
                                style={{
                                    width: size,
                                    height: size,
                                }}
                            />
                            {this.getEyes(this.state.currentEmotion)}
                        </Animatable.View>
                    </Animatable.View>
                </TouchableWithoutFeedback>
            </Animatable.View>
        );
    }
}

export default Mascot;
