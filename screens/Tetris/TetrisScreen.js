// @flow

import * as React from 'react';
import {View} from 'react-native';
import {IconButton, Text, withTheme} from 'react-native-paper';
import GameLogic from "./GameLogic";
import Grid from "./components/Grid";

type Props = {
    navigation: Object,
}

type State = {
    grid: Array<Array<Object>>,
    gameTime: number,
    gameScore: number
}

class TetrisScreen extends React.Component<Props, State> {

    colors: Object;

    logic: GameLogic;
    onTick: Function;
    onGameEnd: Function;
    updateGrid: Function;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.logic = new GameLogic(20, 10);
        this.state = {
            grid: this.logic.getEmptyGrid(),
            gameTime: 0,
            gameScore: 0,
        };
        this.onTick = this.onTick.bind(this);
        this.onGameEnd = this.onGameEnd.bind(this);
        this.updateGrid = this.updateGrid.bind(this);
        const onScreenBlur = this.onScreenBlur.bind(this);
        this.props.navigation.addListener('blur', onScreenBlur);
    }


    /**
     * Remove any interval on un-focus
     */
    onScreenBlur() {
        this.logic.endGame();
    }

    onTick(time: number, score: number, newGrid: Array<Array<Object>>) {
        this.setState({
            gameTime: time,
            gameScore: score,
            grid: newGrid,
        });
    }

    updateGrid(newGrid: Array<Array<Object>>) {
        this.setState({
            grid: newGrid,
        });
    }

    startGame() {
        if (!this.logic.isGameRunning()) {
            this.logic.startGame(this.onTick, this.onGameEnd);
        }
    }

    onGameEnd(time: number, score: number) {
        this.setState({
            gameTime: time,
            gameScore: score,
        })
    }

    render() {
        return (
            <View style={{
                width: '100%',
                height: '100%',
            }}>
                <Text style={{
                    textAlign: 'center',
                }}>
                    Score: {this.state.gameScore}
                </Text>
                <Text style={{
                    textAlign: 'center',
                }}>
                    time: {this.state.gameTime}
                </Text>
                <Grid
                    width={this.logic.getWidth()}
                    height={this.logic.getHeight()}
                    grid={this.state.grid}
                />
                <View style={{
                    flexDirection: 'row-reverse',
                }}>
                    <IconButton
                        icon="arrow-right"
                        size={40}
                        onPress={() => this.logic.rightPressed(this.updateGrid)}
                    />
                    <IconButton
                        icon="arrow-left"
                        size={40}
                        onPress={() => this.logic.leftPressed(this.updateGrid)}
                    />
                    <IconButton
                        icon="format-rotate-90"
                        size={40}
                        onPress={() => this.logic.rotatePressed(this.updateGrid)}
                    />
                    <IconButton
                    icon="power"
                    size={40}
                    onPress={() => this.startGame()}
                />
                </View>
            </View>
        );
    }

}

export default withTheme(TetrisScreen);
