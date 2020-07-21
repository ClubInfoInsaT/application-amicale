// @flow

import * as React from 'react';
import {View} from 'react-native';
import {Caption, IconButton, Text, withTheme} from 'react-native-paper';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GameLogic from "../logic/GameLogic";
import type {Grid} from "../components/GridComponent";
import GridComponent from "../components/GridComponent";
import Preview from "../components/Preview";
import i18n from "i18n-js";
import MaterialHeaderButtons, {Item} from "../../../components/Overrides/CustomHeaderButton";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import type {OptionsDialogButton} from "../../../components/Dialogs/OptionsDialog";
import OptionsDialog from "../../../components/Dialogs/OptionsDialog";

type Props = {
    navigation: StackNavigationProp,
    route: { params: { highScore: number }, ... },
    theme: CustomTheme,
}

type State = {
    grid: Grid,
    gameRunning: boolean,
    gameTime: number,
    gameScore: number,
    gameLevel: number,

    dialogVisible: boolean,
    dialogTitle: string,
    dialogMessage: string,
    dialogButtons: Array<OptionsDialogButton>,
    onDialogDismiss: () => void,
}

class GameMainScreen extends React.Component<Props, State> {

    logic: GameLogic;
    highScore: number | null;

    constructor(props) {
        super(props);
        this.logic = new GameLogic(20, 10, this.props.theme);
        this.state = {
            grid: this.logic.getCurrentGrid(),
            gameRunning: false,
            gameTime: 0,
            gameScore: 0,
            gameLevel: 0,
            dialogVisible: false,
            dialogTitle: "",
            dialogMessage: "",
            dialogButtons: [],
            onDialogDismiss: () => {
            },
        };
        if (this.props.route.params != null)
            this.highScore = this.props.route.params.highScore;
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: this.getRightButton,
        });
        this.startGame();
    }

    getRightButton = () => {
        return <MaterialHeaderButtons>
            <Item title="pause" iconName="pause" onPress={this.togglePause}/>
        </MaterialHeaderButtons>;
    }

    getFormattedTime(seconds: number) {
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(seconds);
        let format;
        if (date.getHours())
            format = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        else if (date.getMinutes())
            format = date.getMinutes() + ':' + date.getSeconds();
        else
            format = date.getSeconds();
        return format;
    }

    onTick = (score: number, level: number, newGrid: Grid) => {
        this.setState({
            gameScore: score,
            gameLevel: level,
            grid: newGrid,
        });
    }

    onClock = (time: number) => {
        this.setState({
            gameTime: time,
        });
    }

    updateGrid = (newGrid: Grid) => {
        this.setState({
            grid: newGrid,
        });
    }

    updateGridScore = (newGrid: Grid, score: number) => {
        this.setState({
            grid: newGrid,
            gameScore: score,
        });
    }

    togglePause = () => {
        this.logic.togglePause();
        if (this.logic.isGamePaused())
            this.showPausePopup();
    }

    onDialogDismiss = () => this.setState({dialogVisible: false});

    showPausePopup = () => {
        const onDismiss = () => {
            this.togglePause();
            this.onDialogDismiss();
        };
        this.setState({
            dialogVisible: true,
            dialogTitle: i18n.t("screens.game.pause"),
            dialogMessage: i18n.t("screens.game.pauseMessage"),
            dialogButtons: [
                {
                    title: i18n.t("screens.game.restart.text"),
                    onPress: this.showRestartConfirm
                },
                {
                    title: i18n.t("screens.game.resume"),
                    onPress: onDismiss
                }
            ],
            onDialogDismiss: onDismiss,
        });
    }

    showRestartConfirm = () => {
        this.setState({
            dialogVisible: true,
            dialogTitle: i18n.t("screens.game.restart.confirm"),
            dialogMessage: i18n.t("screens.game.restart.confirmMessage"),
            dialogButtons: [
                {
                    title: i18n.t("screens.game.restart.confirmYes"),
                    onPress: () => {
                        this.onDialogDismiss();
                        this.startGame();
                    }
                },
                {
                    title: i18n.t("screens.game.restart.confirmNo"),
                    onPress: this.showPausePopup
                }
            ],
            onDialogDismiss: this.showPausePopup,
        });
    }

    showGameOverConfirm() {
        let message = i18n.t("screens.game.gameOver.score") + this.state.gameScore + '\n';
        message += i18n.t("screens.game.gameOver.level") + this.state.gameLevel + '\n';
        message += i18n.t("screens.game.gameOver.time") + this.getFormattedTime(this.state.gameTime) + '\n';
        const onDismiss = () => {
            this.onDialogDismiss();
            this.startGame();
        };
        this.setState({
            dialogVisible: true,
            dialogTitle: i18n.t("screens.game.gameOver.text"),
            dialogMessage: message,
            dialogButtons: [
                {
                    title: i18n.t("screens.game.gameOver.exit"),
                    onPress: () => this.props.navigation.goBack()
                },
                {
                    title: i18n.t("screens.game.resume"),
                    onPress: onDismiss
                }
            ],
            onDialogDismiss: onDismiss,
        });
    }

    startGame = () => {
        this.logic.startGame(this.onTick, this.onClock, this.onGameEnd);
        this.setState({
            gameRunning: true,
        });
    }

    onGameEnd = (time: number, score: number, isRestart: boolean) => {
        this.setState({
            gameTime: time,
            gameScore: score,
            gameRunning: false,
        });
        if (!isRestart)
            this.props.navigation.replace(
                "game-start",
                {
                    score: this.state.gameScore,
                    level: this.state.gameLevel,
                    time: this.state.gameTime,
                }
            );
    }

    getStatusIcons() {
        return (
            <View style={{
                flex: 1,
                marginTop: "auto",
                marginBottom: "auto"
            }}>
                <View style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    <Caption style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginBottom: 5,
                    }}>{i18n.t("screens.game.time")}</Caption>
                    <View style={{
                        flexDirection: "row"
                    }}>
                        <MaterialCommunityIcons
                            name={'timer'}
                            color={this.props.theme.colors.subtitle}
                            size={20}/>
                        <Text style={{
                            marginLeft: 5,
                            color: this.props.theme.colors.subtitle
                        }}>{this.getFormattedTime(this.state.gameTime)}</Text>
                    </View>

                </View>
                <View style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 20,
                }}>
                    <Caption style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginBottom: 5,
                    }}>{i18n.t("screens.game.level")}</Caption>
                    <View style={{
                        flexDirection: "row"
                    }}>
                        <MaterialCommunityIcons
                            name={'gamepad-square'}
                            color={this.props.theme.colors.text}
                            size={20}/>
                        <Text style={{
                            marginLeft: 5
                        }}>{this.state.gameLevel}</Text>
                    </View>
                </View>
            </View>
        );
    }

    getScoreIcon() {
        let highScore = this.highScore == null || this.state.gameScore > this.highScore
            ? this.state.gameScore
            : this.highScore;
        return (
            <View style={{
                marginTop: 10,
                marginBottom: 10,
            }}>
                <View style={{
                    flexDirection: "row",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>
                    <Text style={{
                        marginLeft: 5,
                        fontSize: 20,
                    }}>{i18n.t("screens.game.score", {score: this.state.gameScore})}</Text>
                    <MaterialCommunityIcons
                        name={'star'}
                        color={this.props.theme.colors.tetrisScore}
                        size={20}
                        style={{
                            marginTop: "auto",
                            marginBottom: "auto",
                            marginLeft: 5
                        }}/>
                </View>
                <View style={{
                    flexDirection: "row",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: 5,
                }}>
                    <Text style={{
                        marginLeft: 5,
                        fontSize: 10,
                        color: this.props.theme.colors.textDisabled
                    }}>{i18n.t("screens.game.highScore", {score: highScore})}</Text>
                    <MaterialCommunityIcons
                        name={'star'}
                        color={this.props.theme.colors.tetrisScore}
                        size={10}
                        style={{
                            marginTop: "auto",
                            marginBottom: "auto",
                            marginLeft: 5
                        }}/>
                </View>
            </View>

        );
    }

    getControlButtons() {
        return (
            <View style={{
                height: 80,
                flexDirection: "row"
            }}>
                <IconButton
                    icon="rotate-right-variant"
                    size={40}
                    onPress={() => this.logic.rotatePressed(this.updateGrid)}
                    style={{flex: 1}}
                />
                <View style={{
                    flexDirection: 'row',
                    flex: 4
                }}>
                    <IconButton
                        icon="chevron-left"
                        size={40}
                        style={{flex: 1}}
                        onPress={() => this.logic.pressedOut()}
                        onPressIn={() => this.logic.leftPressedIn(this.updateGrid)}

                    />
                    <IconButton
                        icon="chevron-right"
                        size={40}
                        style={{flex: 1}}
                        onPress={() => this.logic.pressedOut()}
                        onPressIn={() => this.logic.rightPressed(this.updateGrid)}
                    />
                </View>
                <IconButton
                    icon="arrow-down-bold"
                    size={40}
                    onPressIn={() => this.logic.downPressedIn(this.updateGridScore)}
                    onPress={() => this.logic.pressedOut()}
                    style={{flex: 1}}
                    color={this.props.theme.colors.tetrisScore}
                />
            </View>
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                }}>
                    {this.getStatusIcons()}
                    <View style={{flex: 4}}>
                        {this.getScoreIcon()}
                        <GridComponent
                            width={this.logic.getWidth()}
                            height={this.logic.getHeight()}
                            grid={this.state.grid}
                            style={{
                                backgroundColor: this.props.theme.colors.tetrisBackground,
                                flex: 1,
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        />
                    </View>

                    <View style={{flex: 1}}>
                        <Preview
                            items={this.logic.getNextPiecesPreviews()}
                            style={{
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                marginTop: 10,
                            }}
                        />
                    </View>
                </View>
                {this.getControlButtons()}

                <OptionsDialog
                    visible={this.state.dialogVisible}
                    title={this.state.dialogTitle}
                    message={this.state.dialogMessage}
                    buttons={this.state.dialogButtons}
                    onDismiss={this.state.onDialogDismiss}
                />
            </View>
        );
    }

}

export default withTheme(GameMainScreen);
