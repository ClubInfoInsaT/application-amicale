// @flow

import * as React from 'react';
import * as Animatable from "react-native-animatable";
import {Image, View} from "react-native-animatable";

type Props = {
    size: number,
    emotion: number,
    animated: boolean,
}

const MASCOT_IMAGE = require("../../../assets/mascot/mascot.png");
const MASCOT_EYES_NORMAL = require("../../../assets/mascot/mascot_eyes_normal.png");
const MASCOT_EYES_GIRLY = require("../../../assets/mascot/mascot_eyes_girly.png");
const MASCOT_EYES_CUTE = require("../../../assets/mascot/mascot_eyes_cute.png");
const MASCOT_EYES_WINK = require("../../../assets/mascot/mascot_eyes_wink.png");
const MASCOT_GLASSES = require("../../../assets/mascot/mascot_glasses.png");

export const EYE_STYLE = {
    NORMAL: 0,
    GIRLY: 2,
    CUTE: 3,
    WINK: 4,
}

export const MASCOT_STYLE = {
    NORMAL: 0,
    HAPPY: 1,
    GIRLY: 2,
    WINK: 3,
    CUTE: 4,
    INTELLO: 5,
};


class Mascot extends React.Component<Props> {

    static defaultProps = {
        animated: false
    }

    eyeList: { [key: number]: number | string }

    constructor(props: Props) {
        super(props);
        this.eyeList = {};
        this.eyeList[EYE_STYLE.NORMAL] = MASCOT_EYES_NORMAL;
        this.eyeList[EYE_STYLE.GIRLY] = MASCOT_EYES_GIRLY;
        this.eyeList[EYE_STYLE.CUTE] = MASCOT_EYES_CUTE;
        this.eyeList[EYE_STYLE.WINK] = MASCOT_EYES_WINK;
    }

    getGlasses() {
        return <Image
            key={"glasses"}
            source={MASCOT_GLASSES}
            style={{
                position: "absolute",
                top: "15%",
                left: 0,
                width: this.props.size,
                height: this.props.size,
            }}
        />
    }

    getEye(style: number, isRight: boolean) {
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
        } else {
            final.push(this.getEye(EYE_STYLE.NORMAL, true));
            final.push(this.getEye(EYE_STYLE.NORMAL, false));
        }

        if (emotion === MASCOT_STYLE.INTELLO) {
            final.push(this.getGlasses())
        }
        final.push(<View key={"container2"}/>);
        return final;
    }

    render() {
        const size = this.props.size;
        return (
            <Animatable.View
                style={{
                    width: size,
                    height: size,
                }}
                useNativeDriver={true}
                animation={this.props.animated ? "rubberBand" : null}
                duration={2000}
            >
                <View
                    useNativeDriver={true}
                    animation={this.props.animated ? "swing" : null}
                    duration={2000}
                    iterationCount={"infinite"}
                >
                    <Image
                        source={MASCOT_IMAGE}
                        style={{
                            width: size,
                            height: size,
                        }}
                    />
                    {this.getEyes(this.props.emotion)}
                </View>
            </Animatable.View>
        );
    }
}

export default Mascot;
