// @flow

import * as React from 'react';
import {View} from "react-native";
import {FAB, withTheme} from 'react-native-paper';
import * as Animatable from "react-native-animatable";

type Props = {
    focused: boolean,
    onPress: Function,
    onLongPress: Function,
    theme: Object,
}

const AnimatedFAB = Animatable.createAnimatableComponent(FAB);

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class TabHomeIcon extends React.Component<Props> {

    focusedIcon = require('../../../assets/tab-icon.png');
    unFocusedIcon = require('../../../assets/tab-icon-outline.png');

    constructor(props) {
        super(props);
        Animatable.initializeRegistryWithDefinitions({
            fabFocusIn: {
                "0": {
                    scale: 1, translateY: 0
                },
                "0.9": {
                    scale: 1.4, translateY: -6
                },
                "1": {
                    scale: 1.3, translateY: -5
                },
            },
            fabFocusOut: {
                "0": {
                    scale: 1.3, translateY: -5
                },
                "1": {
                    scale: 1, translateY: 0
                },
            }
        });
    }

    shouldComponentUpdate(nextProps: Props): boolean {
        return (nextProps.focused !== this.props.focused);
    }

    render(): React$Node {
        const props = this.props;
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
            }}>
                <AnimatedFAB
                    duration={200}
                    easing={"ease-out"}
                    animation={props.focused ? "fabFocusIn" : "fabFocusOut"}
                    useNativeDriver
                    onPress={props.onPress}
                    onLongPress={props.onLongPress}
                    icon={this.focusedIcon}
                    style={{
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}/>
            </View>
        );
    }

}

export default withTheme(TabHomeIcon);