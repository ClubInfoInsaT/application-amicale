// @flow

import * as React from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import {Button, Headline, withTheme} from "react-native-paper";
import {View} from "react-native";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
}

type State = {

}

class GameStartScreen extends React.Component<Props, State> {

    render() {
        return (
            <View style={{flex: 1}}>
                <Headline style={{textAlign: "center"}}>Coucou</Headline>
                <Button
                    mode={"contained"}
                    onPress={() => this.props.navigation.navigate("game-main")}
                >
                    PLAY
                </Button>
            </View>
        );
    }
}

export default withTheme(GameStartScreen);

