// @flow

import * as React from 'react';
import {Alert, View} from 'react-native';
import {IconButton, Text, withTheme} from 'react-native-paper';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import GameLogic from "./GameLogic";
import Grid from "./components/Grid";
import HeaderButton from "../../components/HeaderButton";
import Preview from "./components/Preview";
import i18n from "i18n-js";

type Props = {
    navigation: Object,
}

type State = {
    grid: Array<Array<Object>>,
    gameRunning: boolean,
    gameTime: number,
    gameScore: number,
    gameLevel: number,
}

class TetrisScreen extends React.Component<Props, State> {

    colors: Object;

    logic: GameLogic;
    onTick: Function;
    onClock: Function;
    onGameEnd: Function;
    updateGrid: Function;
    updateGridScore: Function;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.logic = new GameLogic(20, 10, this.colors);
        this.state = {
            grid: this.logic.getCurrentGrid(),
            gameRunning: false,
            gameTime: 0,
            gameScore: 0,
            gameLevel: 0,
        };
        this.onTick = this.onTick.bind(this);
        this.onClock = this.onClock.bind(this);
        this.onGameEnd = this.onGameEnd.bind(this);
        this.updateGrid = this.updateGrid.bind(this);
        this.updateGridScore = this.updateGridScore.bind(this);
        this.props.navigation.addListener('blur', this.onScreenBlur.bind(this));
        this.props.navigation.addListener('focus', this.onScreenFocus.bind(this));
    }

    componentDidMount() {
        const rightButton = this.getRightButton.bind(this);
        this.props.navigation.setOptions({
            headerRight: rightButton,
        });
        this.startGame();
    }

    getRightButton() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                }}>
                <HeaderButton icon={'pause'} onPress={() => this.togglePause()}/>
            </View>
        );
    }

    /**
     * Remove any interval on un-focus
     */
    onScreenBlur() {
        if (!this.logic.isGamePaused())
            this.logic.togglePause();
    }

    onScreenFocus() {
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

    onTick(score: number, level: number, newGrid: Array<Array<Object>>) {
        this.setState({
            gameScore: score,
            gameLevel: level,
            grid: newGrid,
        });
    }

    onClock(time: number) {
        this.setState({
            gameTime: time,
        });
    }

    updateGrid(newGrid: Array<Array<Object>>) {
        this.setState({
            grid: newGrid,
        });
    }

    updateGridScore(newGrid: Array<Array<Object>>, score: number) {
        this.setState({
            grid: newGrid,
            gameScore: score,
        });
    }

    togglePause() {
        this.logic.togglePause();
        if (this.logic.isGamePaused())
            this.showPausePopup();
    }

    showPausePopup() {
        Alert.alert(
            i18n.t("game.pause"),
            i18n.t("game.pauseMessage"),
            [
                {text: i18n.t("game.restart.text"), onPress: () => this.showRestartConfirm()},
                {text: i18n.t("game.resume"), onPress: () => this.togglePause()},
            ],
            {cancelable: false},
        );
    }

    showRestartConfirm() {
        Alert.alert(
            i18n.t("game.restart.confirm"),
            i18n.t("game.restart.confirmMessage"),
            [
                {text: i18n.t("game.restart.confirmNo"), onPress: () => this.showPausePopup()},
                {text: i18n.t("game.restart.confirmYes"), onPress: () => this.startGame()},
            ],
            {cancelable: false},
        );
    }

    showGameOverConfirm() {
        let message = i18n.t("game.gameOver.score") + this.state.gameScore + '\n';
        message += i18n.t("game.gameOver.level") + this.state.gameLevel + '\n';
        message += i18n.t("game.gameOver.time") + this.getFormattedTime(this.state.gameTime) + '\n';
        Alert.alert(
            i18n.t("game.gameOver.text"),
            message,
            [
                {text: i18n.t("game.gameOver.exit"), onPress: () => this.props.navigation.goBack()},
                {text: i18n.t("game.restart.text"), onPress: () => this.startGame()},
            ],
            {cancelable: false},
        );
    }

    startGame() {
        this.logic.startGame(this.onTick, this.onClock, this.onGameEnd);
        this.setState({
            gameRunning: true,
        });
    }

    onGameEnd(time: number, score: number, isRestart: boolean) {
        this.setState({
            gameTime: time,
            gameScore: score,
            gameRunning: false,
        });
        if (!isRestart)
            this.showGameOverConfirm();
    }

    render() {
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
                        color={this.colors.subtitle}
                        size={20}/>
                    <Text style={{
                        marginLeft: 5,
                        color: this.colors.subtitle
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
                        color={this.colors.text}
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
                        color={this.colors.tetrisScore}
                        size={30}/>
                    <Text style={{
                        marginLeft: 5,
                        fontSize: 22,
                    }}>{this.state.gameScore}</Text>
                </View>
                <Grid
                    width={this.logic.getWidth()}
                    height={this.logic.getHeight()}
                    containerMaxHeight={'80%'}
                    containerMaxWidth={'60%'}
                    grid={this.state.grid}
                    backgroundColor={this.colors.tetrisBackground}
                />
                <View style={{
                    position: 'absolute',
                    top: 50,
                    right: 5,
                }}>
                    <Preview
                        next={this.logic.getNextPiecesPreviews()}
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
                        color={this.colors.tetrisScore}
                    />
                </View>
            </View>
        );
    }

}

export default withTheme(TetrisScreen);
