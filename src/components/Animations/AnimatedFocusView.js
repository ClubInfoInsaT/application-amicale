// @flow

import * as React from 'react';
import * as Animatable from "react-native-animatable";
import {CommonActions} from "@react-navigation/native";

type Props = {
    navigation: Object,
    route: Object,
    children: React$Node
}

export default class AnimatedFocusView extends React.Component<Props> {

    ref: Object;

    constructor() {
        super();
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', this.onScreenFocus);
    }

    onScreenFocus = () => {
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.animationDir && this.ref.current) {
                if (this.props.route.params.animationDir === "right")
                    this.ref.current.fadeInRight(300);
                else
                    this.ref.current.fadeInLeft(300);
                // reset params to prevent infinite loop
                this.props.navigation.dispatch(CommonActions.setParams({animationDir: null}));
            }
        }

    };

    render() {
        return (
            <Animatable.View
                ref={this.ref}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                useNativeDriver
            >
                {this.props.children}
            </Animatable.View>
        );
    }
}
