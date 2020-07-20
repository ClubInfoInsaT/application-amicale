// @flow

import * as React from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import {Button, Headline, withTheme} from "react-native-paper";
import {View} from "react-native";
import i18n from "i18n-js";
import Mascot, {MASCOT_STYLE} from "../../../components/Mascot/Mascot";
import MascotPopup from "../../../components/Mascot/MascotPopup";
import AsyncStorageManager from "../../../managers/AsyncStorageManager";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
}

type State = {
    mascotDialogVisible: boolean,
}

class GameStartScreen extends React.Component<Props, State> {

    state = {
        mascotDialogVisible: AsyncStorageManager.getInstance().preferences.gameStartShowBanner.current === "1",
    }

    hideMascotDialog = () => {
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.gameStartShowBanner.key,
            '0'
        );
        this.setState({mascotDialogVisible: false})
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <Mascot emotion={MASCOT_STYLE.NORMAL} style={{
                    width: "50%",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}/>
                <Headline style={{textAlign: "center"}}>Coucou</Headline>
                <Button
                    mode={"contained"}
                    onPress={() => this.props.navigation.navigate("game-main")}
                >
                    PLAY
                </Button>
                <MascotPopup
                    visible={this.state.mascotDialogVisible}
                    title={i18n.t("screens.game.mascotDialog.title")}
                    message={i18n.t("screens.game.mascotDialog.message")}
                    icon={"gamepad-variant"}
                    buttons={{
                        action: null,
                        cancel: {
                            message: i18n.t("screens.game.mascotDialog.button"),
                            icon: "check",
                            onPress: this.hideMascotDialog,
                        }
                    }}
                    emotion={MASCOT_STYLE.COOL}
                />
            </View>
        );
    }
}

export default withTheme(GameStartScreen);

