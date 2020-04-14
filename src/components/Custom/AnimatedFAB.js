// @flow

import * as React from 'react';
import {StyleSheet} from "react-native";
import {FAB} from "react-native-paper";
import {AnimatedValue} from "react-native-reanimated";
import AutoHideComponent from "./AutoHideComponent";

type Props = {
    icon: string,
    onPress: Function,
}

type State = {
    fabPosition: AnimatedValue
}

export default class AnimatedFAB extends React.Component<Props, State> {

    ref: Object;

    constructor() {
        super();
        this.ref = React.createRef();
    }

    onScroll = (event: Object) => {
        this.ref.current.onScroll(event);
    };

    render() {
        return (
            <AutoHideComponent
                ref={this.ref}
                style={styles.fab}>
                <FAB
                    icon={this.props.icon}
                    onPress={this.props.onPress}
                />
            </AutoHideComponent>
           );
    }
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
