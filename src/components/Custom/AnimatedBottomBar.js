// @flow

import * as React from 'react';
import {StyleSheet} from "react-native";
import {IconButton, withTheme} from "react-native-paper";
import {AnimatedValue} from "react-native-reanimated";
import AutoHideComponent from "./AutoHideComponent";

type Props = {
    theme: Object,
}

type State = {
    fabPosition: AnimatedValue
}

class AnimatedBottomBar extends React.Component<Props, State> {

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
                style={{
                    ...styles.bottom,
                    backgroundColor: this.props.theme.colors.surface,
                }}>
                <IconButton
                    icon="chevron-left"
                    size={40}
                    onPress={() => console.log('previous')}/>
                <IconButton
                    icon="chevron-right"
                    size={40}
                    onPress={() => console.log('next')}/>
            </AutoHideComponent>
        );
    }
}

const styles = StyleSheet.create({
    bottom: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 100,
    },
});

export default withTheme(AnimatedBottomBar);
