// @flow

import * as React from 'react';
import {View} from "react-native";
import type {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheet";

type Props = {
    style?: ViewStyle,
    size: number,
    color: string,
}

export default class SpeechArrow extends React.Component<Props> {

    render() {
        return (
            <View style={this.props.style}>
                <View style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: this.props.size,
                    borderBottomWidth: this.props.size,
                    borderStyle: 'solid',
                    backgroundColor: 'transparent',
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: this.props.color,
                }}/>
            </View>
        );
    }
}
