// @flow

import * as React from 'react';
import {Badge, IconButton, withTheme} from 'react-native-paper';
import {View} from "react-native";
import type {CustomTheme} from "../../managers/ThemeManager";
import * as Animatable from "react-native-animatable";

type Props = {
    color: string,
    icon: string,
    clickAction: () => void,
    isAvailable: boolean,
    badgeNumber: number,
    theme: CustomTheme,
};

const AnimatableBadge = Animatable.createAnimatableComponent(Badge);

/**
 * Component used to render a small dashboard item
 */
class SmallDashboardItem extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Props) {
        return (nextProps.theme.dark !== this.props.theme.dark)
            || (nextProps.isAvailable !== this.props.isAvailable)
            || (nextProps.badgeNumber !== this.props.badgeNumber);
    }

    render() {
        const props = this.props;
        const colors = props.theme.colors;
        return (
            <View>
                <IconButton
                    icon={props.icon}
                    color={
                        props.isAvailable
                            ? props.color
                            : colors.textDisabled
                    }
                    size={35}
                    onPress={props.clickAction}
                />
                {
                    props.badgeNumber > 0 ?
                        <AnimatableBadge
                            animation={"zoomIn"}
                            duration={300}
                            useNativeDriver
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 5
                            }}>
                            {props.badgeNumber}
                        </AnimatableBadge> : null
                }
            </View>
        );
    }

}

export default withTheme(SmallDashboardItem);
