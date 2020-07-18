// @flow

import * as React from 'react';
import {View} from 'react-native';
import {IconButton, Text, withTheme} from 'react-native-paper';
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
            onDialogDismiss: () => {},
        };
        this.props.navigation.addListener('blur', this.onScreenBlur);
        this.props.navigation.addListener('focus', this.onScreenFocus);
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

    /**
     * Remove any interval on un-focus
     */
    onScreenBlur = () => {
        if (!this.logic.isGamePaused())
            this.logic.togglePause();
    }

    onScreenFocus = () => {
        if (!this.logic.isGameRunning())
            this.startGame();
        else if (this.logic.isGamePaused())
            this.showPausePopup();
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
                    title:  i18n.t("screens.game.restart.text"),
                    onPress: this.showRestartConfirm
                },
                {
                    title:  i18n.t("screens.game.resume"),
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
                    title:  i18n.t("screens.game.restart.confirmYes"),
                    onPress: () => {
                        this.onDialogDismiss();
                        this.startGame();
                    }
                },
                {
                    title:  i18n.t("screens.game.restart.confirmNo"),
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
                    title:  i18n.t("screens.game.gameOver.exit"),
                    onPress: () => this.props.navigation.goBack()
                },
                {
                    title:  i18n.t("screens.game.resume"),
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
            this.showGameOverConfirm();
    }

    render() {
        const colors = this.props.theme.colors;
        return (
            <View style={{
                width: '100%',
                height: '100%',
            }}>
                <View style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    top: 5,
                    left: 10,
                }}>
                    <MaterialCommunityIcons
                        name={'timer'}
                        color={colors.subtitle}
                        size={20}/>
                    <Text style={{
                        marginLeft: 5,
                        color: colors.subtitle
                    }}>{this.getFormattedTime(this.state.gameTime)}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    top: 50,
                    left: 10,
                }}>
                    <MaterialCommunityIcons
                        name={'gamepad'}
                        color={colors.text}
                        size={20}/>
                    <Text style={{
                        marginLeft: 5
                    }}>{this.state.gameLevel}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                }}>
                    <MaterialCommunityIcons
                        name={'star'}
                        color={colors.tetrisScore}
                        size={30}/>
                    <Text style={{
                        marginLeft: 5,
                        fontSize: 22,
                    }}>{this.state.gameScore}</Text>
                </View>
                <GridComponent
                    width={this.logic.getWidth()}
                    height={this.logic.getHeight()}
                    containerMaxHeight={'80%'}
                    containerMaxWidth={'60%'}
                    grid={this.state.grid}
                    backgroundColor={colors.tetrisBackground}
                />
                <View style={{
                    position: 'absolute',
                    top: 50,
                    right: 5,
                }}>
                    <Preview
                        items={this.logic.getNextPiecesPreviews()}
                    />
                </View>
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    width: '100%',
                }}>
                    <IconButton
                        icon="rotate-right-variant"
                        size={40}
                        onPress={() => this.logic.rotatePressed(this.updateGrid)}
                        style={{marginRight: 'auto'}}
                    />
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <IconButton
                            icon="arrow-left"
                            size={40}
                            onPress={() => this.logic.pressedOut()}
                            onPressIn={() => this.logic.leftPressedIn(this.updateGrid)}

                        />
                        <IconButton
                            icon="arrow-right"
                            size={40}
                            onPress={() => this.logic.pressedOut()}
                            onPressIn={() => this.logic.rightPressed(this.updateGrid)}
                        />
                    </View>
                    <IconButton
                        icon="arrow-down"
                        size={40}
                        onPressIn={() => this.logic.downPressedIn(this.updateGridScore)}
                        onPress={() => this.logic.pressedOut()}
                        style={{marginLeft: 'auto'}}
                        color={colors.tetrisScore}
                    />
                </View>
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
