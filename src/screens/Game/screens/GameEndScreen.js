// @flow

import * as React from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import {withTheme} from "react-native-paper";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
}

type State = {

}

class GameEndScreen extends React.Component<Props, State> {

    render() {
        return (
            null
        );
    }
}

export default withTheme(GameEndScreen);
