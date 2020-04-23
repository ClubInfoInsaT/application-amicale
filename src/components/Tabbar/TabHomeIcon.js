// @flow

import * as React from 'react';
import {Image, View} from "react-native";
import {FAB, withTheme} from 'react-native-paper';
import * as Animatable from "react-native-animatable";
import TouchableRipple from "react-native-paper/src/components/TouchableRipple/index";
import CustomTabBar from "./CustomTabBar";

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
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                }}>
                <TouchableRipple
                    onPress={props.onPress}
                    onLongPress={props.onLongPress}
                    borderless={true}
                    rippleColor={this.props.theme.colors.primary}
                    underlayColor={this.props.theme.colors.primary}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: CustomTabBar.TAB_BAR_HEIGHT + 30,
                        marginBottom: -15,
                    }}
                >
                    <AnimatedFAB
                        duration={200}
                        easing={"ease-out"}
                        animation={props.focused ? "fabFocusIn" : "fabFocusOut"}
                        icon={this.iconRender}
                        style={{
                            marginTop: 15,
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}/>
                </TouchableRipple>
            </View>

        );
    }

}

export default withTheme(TabHomeIcon);