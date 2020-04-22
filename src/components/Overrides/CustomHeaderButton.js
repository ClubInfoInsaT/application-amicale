// @flow

import * as React from 'react';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {HeaderButton, HeaderButtons} from 'react-navigation-header-buttons';
import {withTheme} from "react-native-paper";
import * as Touchable from "react-native/Libraries/Components/Touchable/TouchableNativeFeedback.android";

const MaterialHeaderButton = (props: Object) => <HeaderButton
        IconComponent={MaterialCommunityIcons}
        iconSize={26}
        color={props.color != null ? props.color : props.theme.colors.text}
        background={Touchable.Ripple(props.theme.colors.ripple, true)}
        {...props}
    />;

const MaterialHeaderButtons = (props: Object) => {
    return (
        <HeaderButtons
            HeaderButtonComponent={withTheme(MaterialHeaderButton)}
            OverflowIcon={
                <MaterialCommunityIcons
                    name="dots-vertical"
                    size={26}
                    color={props.theme.colors.text}
                />
            }
            {...props}
        />
    );
};

export default withTheme(MaterialHeaderButtons);

export {Item} from 'react-navigation-header-buttons';
