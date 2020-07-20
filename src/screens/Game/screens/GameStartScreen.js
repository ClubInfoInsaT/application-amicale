// @flow

import * as React from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import {Button, Card, Divider, Headline, Paragraph, withTheme} from "react-native-paper";
import {View} from "react-native";
import i18n from "i18n-js";
import Mascot, {MASCOT_STYLE} from "../../../components/Mascot/Mascot";
import MascotPopup from "../../../components/Mascot/MascotPopup";
import AsyncStorageManager from "../../../managers/AsyncStorageManager";
import type {Grid} from "../components/GridComponent";
import GridComponent from "../components/GridComponent";
import GridManager from "../logic/GridManager";
import Piece from "../logic/Piece";
import * as Animatable from "react-native-animatable";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
}

type State = {
    mascotDialogVisible: boolean,
}

class GameStartScreen extends React.Component<Props, State> {

    gridManager: GridManager;

    state = {
        mascotDialogVisible: AsyncStorageManager.getInstance().preferences.gameStartShowBanner.current === "1",
    }

    constructor(props: Props) {
        super(props);
        this.gridManager = new GridManager(4, 4, props.theme);
    }

    hideMascotDialog = () => {
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.gameStartShowBanner.key,
            '0'
        );
        this.setState({mascotDialogVisible: false})
    };

    getPiecesBackground() {
        let gridList = [];
        for (let i = 0; i < 18; i++) {
            gridList.push(this.gridManager.getEmptyGrid(4, 4));
            const piece = new Piece(this.props.theme);
            piece.toGrid(gridList[i], true);
        }
        return (
            <View style={{
                position: "absolute",
                width: "100%",
                height: "100%",
            }}>
                {gridList.map((item: Grid, index: number) => {
                    const size = 10 + Math.floor(Math.random() * 30);
                    const top = Math.floor(Math.random() * 100);
                    const rot = Math.floor(Math.random() * 360);
                    const left = (index % 6) * 20;
                    const animDelay = size * 20;
                    const animDuration = 2 * (2000 - (size * 30));
                    return (
                        <Animatable.View
                            animation={"fadeInDownBig"}
                            delay={animDelay}
                            duration={animDuration}
                            key={index.toString()}
                            style={{
                                width: size + "%",
                                position: "absolute",
                                top: top + "%",
                                left: left + "%",
                            }}
                        >
                            <View style={{
                                transform: [{rotateZ: rot + "deg"}],
                            }}>
                                <GridComponent
                                    width={4}
                                    height={4}
                                    grid={item}
                                    style={{
                                        marginRight: 5,
                                        marginLeft: 5,
                                        marginBottom: 5,
                                    }}
                                />
                            </View>

                        </Animatable.View>
                    );
                })}
            </View>

        );
    }

    getWelcomeText() {
        return (
            <View>
                <Mascot emotion={MASCOT_STYLE.COOL} style={{
                    width: "40%",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}/>
                <Card style={{
                    marginLeft: 10,
                    marginRight: 10,
                }}>
                    <Card.Content>
                        <Headline
                            style={{
                                textAlign: "center",
                                color: this.props.theme.colors.primary
                            }}>
                            {i18n.t("screens.game.welcomeTitle")}
                        </Headline>
                        <Divider/>
                        <Paragraph
                            style={{
                                textAlign: "center",
                                marginTop: 10,
                            }}>
                            {i18n.t("screens.game.welcomeMessage")}
                        </Paragraph>
                    </Card.Content>
                </Card>

            </View>
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.getPiecesBackground()}
                {this.getWelcomeText()}
                <Button
                    icon={"play"}
                    mode={"contained"}
                    onPress={() => this.props.navigation.navigate("game-main")}
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: 10,
                    }}
                >
                    {i18n.t("screens.game.play")}
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

