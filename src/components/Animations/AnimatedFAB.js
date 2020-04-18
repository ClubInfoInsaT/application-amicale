// @flow

import * as React from 'react';
import {StyleSheet} from "react-native";
import {FAB} from "react-native-paper";
import AutoHideHandler from "../../utils/AutoHideHandler";
import * as Animatable from 'react-native-animatable';
import CustomTabBar from "../Tabbar/CustomTabBar";

type Props = {
    navigation: Object,
    icon: string,
    onPress: Function,
}

const AnimatedFab = Animatable.createAnimatableComponent(FAB);

export default class AnimatedFAB extends React.Component<Props> {

    ref: Object;
    hideHandler: AutoHideHandler;

    constructor() {
        super();
        this.ref = React.createRef();
        this.hideHandler = new AutoHideHandler(false);
        this.hideHandler.addListener(this.onHideChange);
    }

    onScroll = (event: Object) => {
        this.hideHandler.onScroll(event);
    };

    onHideChange = (shouldHide: boolean) => {
        if (this.ref.current) {
            if (shouldHide)
                this.ref.current.bounceOutDown(1000);
            else
                this.ref.current.bounceInUp(1000);
        }
    }

    render() {
        return (
            <AnimatedFab
                ref={this.ref}
                useNativeDriver
                icon={this.props.icon}
                onPress={this.props.onPress}
                style={{
                    ...styles.fab,
                    bottom: CustomTabBar.TAB_BAR_HEIGHT
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
    },
});
