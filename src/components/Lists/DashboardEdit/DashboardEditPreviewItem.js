// @flow

import * as React from 'react';
import {TouchableRipple, withTheme} from 'react-native-paper';
import {Dimensions, Image, View} from "react-native";
import type {CustomTheme} from "../../../managers/ThemeManager";

type Props = {
    image: string,
    isActive: boolean,
    onPress: () => void,
    theme: CustomTheme,
};

/**
 * Component used to render a small dashboard item
 */
class DashboardEditPreviewItem extends React.Component<Props> {

    itemSize: number;

    constructor(props: Props) {
        super(props);
        this.itemSize = Dimensions.get('window').width / 8;
    }

    render() {
        const props = this.props;
        return (
            <TouchableRipple
                onPress={this.props.onPress}
                borderless={true}
                style={{
                    marginLeft: 5,
                    marginRight: 5,
                    backgroundColor: this.props.isActive ? this.props.theme.colors.textDisabled : "transparent",
                    borderRadius: 5
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
                </View>
            </TouchableRipple>
        );
    }

}

export default withTheme(DashboardEditPreviewItem)
