// @flow

import * as React from 'react';
import {Badge, TouchableRipple, withTheme} from 'react-native-paper';
import {Dimensions, Image, View} from "react-native";
import type {CustomTheme} from "../../managers/ThemeManager";
import * as Animatable from "react-native-animatable";

type Props = {
    image: string,
    onPress: () => void,
    badgeCount: number | null,
    theme: CustomTheme,
};

const AnimatableBadge = Animatable.createAnimatableComponent(Badge);

/**
 * Component used to render a small dashboard item
 */
class SmallDashboardItem extends React.Component<Props> {

    itemSize: number;

    constructor(props: Props) {
        super(props);
        this.itemSize = Dimensions.get('window').width / 8;
    }

    shouldComponentUpdate(nextProps: Props) {
        return (nextProps.theme.dark !== this.props.theme.dark)
            || (nextProps.badgeCount !== this.props.badgeCount);
    }

    render() {
        const props = this.props;
        return (
                <TouchableRipple
                    onPress={this.props.onPress}
                    borderless={true}
                    style={{
                        marginLeft: this.itemSize / 4,
                        marginRight: this.itemSize / 4,
                    }}
                >
                    <View style={{
                        width: this.itemSize,
                        height: this.itemSize,
                    }}>
                        <Image
                            source={{uri: props.image}}
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                        {
                            props.badgeCount != null && props.badgeCount > 0 ?
                                <AnimatableBadge
                                    animation={"zoomIn"}
                                    duration={300}
                                    useNativeDriver
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        backgroundColor: props.theme.colors.primary,
                                        borderColor: props.theme.colors.background,
                                        borderWidth: 2,
                                    }}>
                                    {props.badgeCount}
                                </AnimatableBadge> : null
                        }
                    </View>
                </TouchableRipple>

        );
    }

}

export default withTheme(SmallDashboardItem);
