// @flow

import * as React from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import {Button, Card, Divider, Headline, Paragraph, Text, withTheme} from "react-native-paper";
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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import SpeechArrow from "../../../components/Mascot/SpeechArrow";
import CollapsibleScrollView from "../../../components/Collapsible/CollapsibleScrollView";

type GameStats = {
    score: number,
    level: number,
    time: number,
}

type Props = {
    navigation: StackNavigationProp,
    route: {
        params: GameStats
    },
    theme: CustomTheme,
}

type State = {
    mascotDialogVisible: boolean,
}

class GameStartScreen extends React.Component<Props, State> {

    gridManager: GridManager;
    scores: Array<number>;

    gameStats: GameStats | null;
    isHighScore: boolean;

    state = {
        mascotDialogVisible: AsyncStorageManager.getInstance().preferences.gameStartShowBanner.current === "1",
    }

    constructor(props: Props) {
        super(props);
        this.gridManager = new GridManager(4, 4, props.theme);
        this.scores = JSON.parse(AsyncStorageManager.getInstance().preferences.gameScores.current);
        this.scores.sort((a, b) => b - a);
        if (this.props.route.params != null)
            this.recoverGameScore();
    }

    recoverGameScore() {
        this.gameStats = this.props.route.params;
        this.isHighScore = this.scores.length === 0 || this.gameStats.score > this.scores[0];
        for (let i = 0; i < 3; i++) {
            if (this.scores.length > i && this.gameStats.score > this.scores[i]) {
                this.scores.splice(i, 0, this.gameStats.score);
                break;
            } else if (this.scores.length <= i) {
                this.scores.push(this.gameStats.score);
                break;
            }
        }
        if (this.scores.length > 3)
            this.scores.splice(3, 1);
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.gameScores.key,
            JSON.stringify(this.scores)
        );
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
                            key={"piece" + index.toString()}
                            style={{
                                width: size + "%",
                                position: "absolute",
                                top: top + "%",
                                left: left + "%",
                            }}
                        >
                            <GridComponent
                                width={4}
                                height={4}
                                grid={item}
                                style={{
                                    transform: [{rotateZ: rot + "deg"}],
                                }}
                            />
                        </Animatable.View>
                    );
                })}
            </View>
        );
    }

    getPostGameContent(stats: GameStats) {
        return (
            <View style={{
                flex: 1
            }}>
                <Mascot
                    emotion={this.isHighScore ? MASCOT_STYLE.LOVE : MASCOT_STYLE.NORMAL}
                    animated={this.isHighScore}
                    style={{
                        width: this.isHighScore ? "50%" : "30%",
                        marginLeft: this.isHighScore ? "auto" : null,
                        marginRight: this.isHighScore ? "auto" : null,
                    }}/>
                <SpeechArrow
                    style={{marginLeft: this.isHighScore ? "60%" : "20%"}}
                    size={20}
                    color={this.props.theme.colors.mascotMessageArrow}
                />
                <Card style={{
                    borderColor: this.props.theme.colors.mascotMessageArrow,
                    borderWidth: 2,
                    marginLeft: 20,
                    marginRight: 20,
                }}>
                    <Card.Content>
                        <Headline
                            style={{
                                textAlign: "center",
                                color: this.isHighScore
                                    ? this.props.theme.colors.gameGold
                                    : this.props.theme.colors.primary
                            }}>
                            {this.isHighScore
                                ? i18n.t("screens.game.newHighScore")
                                : i18n.t("screens.game.gameOver.text")}
                        </Headline>
                        <Divider/>
                        <View style={{
                            flexDirection: "row",
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: 10,
                            marginBottom: 10,
                        }}>
                            <Text style={{
                                fontSize: 20,
                            }}>
                                {i18n.t("screens.game.score", {score: stats.score})}
                            </Text>
                            <MaterialCommunityIcons
                                name={'star'}
                                color={this.props.theme.colors.tetrisScore}
                                size={30}
                                style={{
                                    marginLeft: 5
                                }}/>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}>
                            <Text>{i18n.t("screens.game.level")}</Text>
                            <MaterialCommunityIcons
                                style={{
                                    marginRight: 5,
                                    marginLeft: 5,
                                }}
                                name={"gamepad-square"}
                                size={20}
                                color={this.props.theme.colors.textDisabled}
                            />
                            <Text>
                                {stats.level}
                            </Text>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}>
                            <Text>{i18n.t("screens.game.time")}</Text>
                            <MaterialCommunityIcons
                                style={{
                                    marginRight: 5,
                                    marginLeft: 5,
                                }}
                                name={"timer"}
                                size={20}
                                color={this.props.theme.colors.textDisabled}
                            />
                            <Text>
                                {stats.time}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        )
    }

    getWelcomeText() {
        return (
            <View>
                <Mascot emotion={MASCOT_STYLE.COOL} style={{
                    width: "40%",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}/>
                <SpeechArrow
                    style={{marginLeft: "60%"}}
                    size={20}
                    color={this.props.theme.colors.mascotMessageArrow}
                />
                <Card style={{
                    borderColor: this.props.theme.colors.mascotMessageArrow,
                    borderWidth: 2,
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

    getPodiumRender(place: 1 | 2 | 3, score: string) {
        let icon = "podium-gold";
        let color = this.props.theme.colors.gameGold;
        let fontSize = 20;
        let size = 70;
        if (place === 2) {
            icon = "podium-silver";
            color = this.props.theme.colors.gameSilver;
            fontSize = 18;
            size = 60;
        } else if (place === 3) {
            icon = "podium-bronze";
            color = this.props.theme.colors.gameBronze;
            fontSize = 15;
            size = 50;
        }
        return (
            <View style={{
                marginLeft: place === 2 ? 20 : "auto",
                marginRight: place === 3 ? 20 : "auto",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
            }}>
                {
                    this.isHighScore && place === 1
                        ?
                        <Animatable.View
                            animation={"swing"}
                            iterationCount={"infinite"}
                            duration={2000}
                            delay={1000}
                            useNativeDriver={true}
                            style={{
                                position: "absolute",
                                top: -20
                            }}
                        >
                            <Animatable.View
                                animation={"pulse"}
                                iterationCount={"infinite"}
                                useNativeDriver={true}
                            >
                                <MaterialCommunityIcons
                                    name={"decagram"}
                                    color={this.props.theme.colors.gameGold}
                                    size={150}
                                />
                            </Animatable.View>
                        </Animatable.View>

                        : null
                }
                <MaterialCommunityIcons
                    name={icon}
                    color={this.isHighScore && place === 1 ? "#fff" : color}
                    size={size}
                />
                <Text style={{
                    textAlign: "center",
                    fontWeight: place === 1 ? "bold" : null,
                    fontSize: fontSize,
                }}>{score}</Text>
            </View>
        );
    }

    getTopScoresRender() {
        const gold = this.scores.length > 0
            ? this.scores[0]
            : "-";
        const silver = this.scores.length > 1
            ? this.scores[1]
            : "-";
        const bronze = this.scores.length > 2
            ? this.scores[2]
            : "-";
        return (
            <View style={{
                marginBottom: 20,
                marginTop: 20
            }}>
                {this.getPodiumRender(1, gold.toString())}
                <View style={{
                    flexDirection: "row",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>
                    {this.getPodiumRender(3, bronze.toString())}
                    {this.getPodiumRender(2, silver.toString())}
                </View>
            </View>
        );
    }

    getMainContent() {
        return (
            <View style={{flex: 1}}>
                {
                    this.gameStats != null
                        ? this.getPostGameContent(this.gameStats)
                        : this.getWelcomeText()
                }
                <Button
                    icon={"play"}
                    mode={"contained"}
                    onPress={() => this.props.navigation.replace(
                        "game-main",
                        {
                            highScore: this.scores.length > 0
                                ? this.scores[0]
                                : null
                        }
                    )}
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: 10,
                    }}
                >
                    {i18n.t("screens.game.play")}
                </Button>
                {this.getTopScoresRender()}
            </View>
        )
    }

    keyExtractor = (item: number) => item.toString();

    render() {
        return (
            <View style={{flex: 1}}>
                {this.getPiecesBackground()}
                <LinearGradient
                    style={{flex: 1}}
                    colors={[
                        this.props.theme.colors.background + "00",
                        this.props.theme.colors.background
                    ]}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                >
                    <CollapsibleScrollView>
                        {this.getMainContent()}
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
                    </CollapsibleScrollView>
                </LinearGradient>
            </View>

        );
    }
}

export default withTheme(GameStartScreen);

