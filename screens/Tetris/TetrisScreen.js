// @flow

import * as React from 'react';
import {Alert, View} from 'react-native';
import {IconButton, Text, withTheme} from 'react-native-paper';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import GameLogic from "./GameLogic";
import Grid from "./components/Grid";
import HeaderButton from "../../components/HeaderButton";

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
            grid: this.logic.getEmptyGrid(),
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
            'PAUSE',
            'GAME PAUSED',
            [
                {text: 'RESTART', onPress: () => this.showRestartConfirm()},
                {text: 'RESUME', onPress: () => this.togglePause()},
            ],
            {cancelable: false},
        );
    }

    showRestartConfirm() {
        Alert.alert(
            'RESTART?',
            'WHOA THERE',
            [
                {text: 'NO', onPress: () => this.showPausePopup()},
                {text: 'YES', onPress: () => this.startGame()},
            ],
            {cancelable: false},
        );
    }

    showGameOverConfirm() {
        let message = 'SCORE: ' + this.state.gameScore + '\n';
        message += 'LEVEL: ' + this.state.gameLevel + '\n';
        message += 'TIME: ' + this.state.gameTime + '\n';
        Alert.alert(
            'GAME OVER',
            message,
            [
                {text: 'LEAVE', onPress: () => this.props.navigation.goBack()},
                {text: 'RESTART', onPress: () => this.startGame()},
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
                    top: 10,
                    left: 10,
                }}>
                    <MaterialCommunityIcons
                        name={'timer'}
                        color={this.colors.subtitle}
                        size={20}/>
                    <Text style={{
                        marginLeft: 5,
                        color: this.colors.subtitle
                    }}>{this.state.gameTime}</Text>
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
                    grid={this.state.grid}
                />
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                }}>
                    <IconButton
                        icon="format-rotate-90"
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
                            onPress={() => this.logic.leftPressed(this.updateGrid)}
                        />
                        <IconButton
                            icon="arrow-right"
                            size={40}
                            onPress={() => this.logic.rightPressed(this.updateGrid)}
                        />
                    </View>
                    <IconButton
                        icon="arrow-down"
                        size={40}
                        onPress={() => this.logic.downPressed(this.updateGridScore)}
                        style={{marginLeft: 'auto'}}
                    />
                </View>
            </View>
        );
    }

}

export default withTheme(TetrisScreen);
