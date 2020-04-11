// @flow

import * as React from 'react';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {HeaderButton, HeaderButtons} from 'react-navigation-header-buttons';
import {withTheme} from "react-native-paper";
import * as Touchable from "react-native/Libraries/Components/Touchable/TouchableNativeFeedback.android";

const MaterialHeaderButton = (props: Object) => (
    <HeaderButton
        {...props}
        IconComponent={MaterialCommunityIcons}
        iconSize={26}
        color={props.theme.colors.text}
        background={Touchable.Ripple(props.theme.colors.ripple, true)}
    />
);

const MaterialHeaderButtons = (props: Object) => {
    return (
        <HeaderButtons
            {...props}
            HeaderButtonComponent={withTheme(MaterialHeaderButton)}
            OverflowIcon={
                <MaterialCommunityIcons
                    name="dots-vertical"
                    size={26}
                    color={props.theme.colors.text}
                />
            }
        />
    );
};

export default withTheme(MaterialHeaderButtons);

export {Item} from 'react-navigation-header-buttons';
