// @flow

import * as React from 'react';
import {Image, View} from "react-native";
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
                    scale: 1.2, translateY: -9
                },
                "1": {
                    scale: 1.1, translateY: -7
                },
            },
            fabFocusOut: {
                "0": {
                    scale: 1.1, translateY: -6
                },
                "1": {
                    scale: 1, translateY: 0
                },
            }
        });
    }

    iconRender = ({size, color}) =>
        this.props.focused
            ? <Image
                source={this.focusedIcon}
                style={{width: size, height: size, tintColor: color}}
            />
            : <Image
                source={this.unFocusedIcon}
                style={{width: size, height: size, tintColor: color}}
            />;

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
                    icon={this.iconRender}
                    style={{
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}/>
            </View>
        );
    }

}

export default withTheme(TabHomeIcon);