// @flow

import * as React from 'react';
import {View} from "react-native";
import {TouchableRipple, withTheme} from 'react-native-paper';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

type Props = {
    focused: boolean,
    color: string,
    label: string,
    icon: string,
    onPress: Function,
    onLongPress: Function,
    theme: Object,
    extraData: any,
}

const AnimatedIcon = Animatable.createAnimatableComponent(MaterialCommunityIcons);


/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class TabIcon extends React.Component<Props> {

    firstRender: boolean;

    constructor(props) {
        super(props);
        Animatable.initializeRegistryWithDefinitions({
            focusIn: {
                "0": {
                    scale: 1, translateY: 0
                },
                "0.9": {
                    scale: 1.3, translateY: 7
                },
                "1": {
                    scale: 1.2, translateY: 6
                },
            },
            focusOut: {
                "0": {
                    scale: 1.2, translateY: 6
                },
                "1": {
                    scale: 1, translateY: 0
                },
            }
        });
        this.firstRender = true;
    }

    componentDidMount() {
        this.firstRender = false;
    }

    shouldComponentUpdate(nextProps: Props): boolean {
        return (nextProps.focused !== this.props.focused)
            || (nextProps.theme.dark !== this.props.theme.dark)
            || (nextProps.extraData !== this.props.extraData);
    }

    render(): React$Node {
        const props = this.props;
        return (
            <TouchableRipple
                onPress={props.onPress}
                onLongPress={props.onLongPress}
                borderless={true}
                rippleColor={this.props.theme.colors.primary}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItem: 'center',
                }}
            >
                <View>
                    <Animatable.View
                        duration={200}
                        easing={"ease-out"}
                        animation={props.focused ? "focusIn" : "focusOut"}
                        useNativeDriver
                    >
                        <AnimatedIcon
                            name={props.icon}
                            color={props.color}
                            size={26}
                            style={{
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        />
                    </Animatable.View>
                    <Animatable.Text
                        animation={props.focused ? "fadeOutDown" : "fadeIn"}
                        useNativeDriver

                        style={{
                            color: props.color,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: 10,
                        }}
                    >
                        {props.label}
                    </Animatable.Text>
                </View>
            </TouchableRipple>
        );
    }
}

export default withTheme(TabIcon);