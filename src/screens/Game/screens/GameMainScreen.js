/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

// @flow

import * as React from 'react';
import {View} from 'react-native';
import {Caption, IconButton, Text, withTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import GameLogic from '../logic/GameLogic';
import type {GridType} from '../components/GridComponent';
import GridComponent from '../components/GridComponent';
import Preview from '../components/Preview';
import MaterialHeaderButtons, {
  Item,
} from '../../../components/Overrides/CustomHeaderButton';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {OptionsDialogButtonType} from '../../../components/Dialogs/OptionsDialog';
import OptionsDialog from '../../../components/Dialogs/OptionsDialog';

type PropsType = {
  navigation: StackNavigationProp,
  route: {params: {highScore: number}},
  theme: CustomThemeType,
};

type StateType = {
  grid: GridType,
  gameTime: number,
  gameScore: number,
  gameLevel: number,

  dialogVisible: boolean,
  dialogTitle: string,
  dialogMessage: string,
  dialogButtons: Array<OptionsDialogButtonType>,
  onDialogDismiss: () => void,
};

class GameMainScreen extends React.Component<PropsType, StateType> {
  static getFormattedTime(seconds: number): string {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(seconds);
    let format;
    if (date.getHours())
      format = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    else if (date.getMinutes())
      format = `${date.getMinutes()}:${date.getSeconds()}`;
    else format = date.getSeconds().toString();
    return format;
  }

  logic: GameLogic;

  highScore: number | null;

  constructor(props: PropsType) {
    super(props);
    this.logic = new GameLogic(20, 10, props.theme);
    this.state = {
      grid: this.logic.getCurrentGrid(),
      gameTime: 0,
      gameScore: 0,
      gameLevel: 0,
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      dialogButtons: [],
      onDialogDismiss: () => {},
    };
    if (props.route.params != null)
      this.highScore = props.route.params.highScore;
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerRight: this.getRightButton,
    });
    this.startGame();
  }

  componentWillUnmount() {
    this.logic.endGame(true);
  }

  getRightButton = (): React.Node => {
    return (
      <MaterialHeaderButtons>
        <Item title="pause" iconName="pause" onPress={this.togglePause} />
      </MaterialHeaderButtons>
    );
  };

  onTick = (score: number, level: number, newGrid: GridType) => {
    this.setState({
      gameScore: score,
      gameLevel: level,
      grid: newGrid,
    });
  };

  onClock = (time: number) => {
    this.setState({
      gameTime: time,
    });
  };

  onDialogDismiss = () => {
    this.setState({dialogVisible: false});
  };

  onGameEnd = (time: number, score: number, isRestart: boolean) => {
    const {props, state} = this;
    this.setState({
      gameTime: time,
      gameScore: score,
    });
    if (!isRestart)
      props.navigation.replace('game-start', {
        score: state.gameScore,
        level: state.gameLevel,
        time: state.gameTime,
      });
  };

  getStatusIcons(): React.Node {
    const {props, state} = this;
    return (
      <View
        style={{
          flex: 1,
          marginTop: 'auto',
          marginBottom: 'auto',
        }}>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <Caption
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 5,
            }}>
            {i18n.t('screens.game.time')}
          </Caption>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <MaterialCommunityIcons
              name="timer"
              color={props.theme.colors.subtitle}
              size={20}
            />
            <Text
              style={{
                marginLeft: 5,
                color: props.theme.colors.subtitle,
              }}>
              {GameMainScreen.getFormattedTime(state.gameTime)}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 20,
          }}>
          <Caption
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 5,
            }}>
            {i18n.t('screens.game.level')}
          </Caption>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <MaterialCommunityIcons
              name="gamepad-square"
              color={props.theme.colors.text}
              size={20}
            />
            <Text
              style={{
                marginLeft: 5,
              }}>
              {state.gameLevel}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  getScoreIcon(): React.Node {
    const {props, state} = this;
    const highScore =
      this.highScore == null || state.gameScore > this.highScore
        ? state.gameScore
        : this.highScore;
    return (
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
            }}>
            {i18n.t('screens.game.score', {score: state.gameScore})}
          </Text>
          <MaterialCommunityIcons
            name="star"
            color={props.theme.colors.tetrisScore}
            size={20}
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              marginLeft: 5,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 5,
          }}>
          <Text
            style={{
              marginLeft: 5,
              fontSize: 10,
              color: props.theme.colors.textDisabled,
            }}>
            {i18n.t('screens.game.highScore', {score: highScore})}
          </Text>
          <MaterialCommunityIcons
            name="star"
            color={props.theme.colors.tetrisScore}
            size={10}
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              marginLeft: 5,
            }}
          />
        </View>
      </View>
    );
  }

  getControlButtons(): React.Node {
    const {props} = this;
    return (
      <View
        style={{
          height: 80,
          flexDirection: 'row',
        }}>
        <IconButton
          icon="rotate-right-variant"
          size={40}
          onPress={() => {
            this.logic.rotatePressed(this.updateGrid);
          }}
          style={{flex: 1}}
        />
        <View
          style={{
            flexDirection: 'row',
            flex: 4,
          }}>
          <IconButton
            icon="chevron-left"
            size={40}
            style={{flex: 1}}
            onPress={() => {
              this.logic.pressedOut();
            }}
            onPressIn={() => {
              this.logic.leftPressedIn(this.updateGrid);
            }}
          />
          <IconButton
            icon="chevron-right"
            size={40}
            style={{flex: 1}}
            onPress={() => {
              this.logic.pressedOut();
            }}
            onPressIn={() => {
              this.logic.rightPressed(this.updateGrid);
            }}
          />
        </View>
        <IconButton
          icon="arrow-down-bold"
          size={40}
          onPressIn={() => {
            this.logic.downPressedIn(this.updateGridScore);
          }}
          onPress={() => {
            this.logic.pressedOut();
          }}
          style={{flex: 1}}
          color={props.theme.colors.tetrisScore}
        />
      </View>
    );
  }

  updateGrid = (newGrid: GridType) => {
    this.setState({
      grid: newGrid,
    });
  };

  updateGridScore = (newGrid: GridType, score?: number) => {
    this.setState((prevState: StateType): {
      grid: GridType,
      gameScore: number,
    } => ({
      grid: newGrid,
      gameScore: score != null ? score : prevState.gameScore,
    }));
  };

  togglePause = () => {
    this.logic.togglePause();
    if (this.logic.isGamePaused()) this.showPausePopup();
  };

  showPausePopup = () => {
    const onDismiss = () => {
      this.togglePause();
      this.onDialogDismiss();
    };
    this.setState({
      dialogVisible: true,
      dialogTitle: i18n.t('screens.game.pause'),
      dialogMessage: i18n.t('screens.game.pauseMessage'),
      dialogButtons: [
        {
          title: i18n.t('screens.game.restart.text'),
          onPress: this.showRestartConfirm,
        },
        {
          title: i18n.t('screens.game.resume'),
          onPress: onDismiss,
        },
      ],
      onDialogDismiss: onDismiss,
    });
  };

  showRestartConfirm = () => {
    this.setState({
      dialogVisible: true,
      dialogTitle: i18n.t('screens.game.restart.confirm'),
      dialogMessage: i18n.t('screens.game.restart.confirmMessage'),
      dialogButtons: [
        {
          title: i18n.t('screens.game.restart.confirmYes'),
          onPress: () => {
            this.onDialogDismiss();
            this.startGame();
          },
        },
        {
          title: i18n.t('screens.game.restart.confirmNo'),
          onPress: this.showPausePopup,
        },
      ],
      onDialogDismiss: this.showPausePopup,
    });
  };

  startGame = () => {
    this.logic.startGame(this.onTick, this.onClock, this.onGameEnd);
  };

  render(): React.Node {
    const {props, state} = this;
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          {this.getStatusIcons()}
          <View style={{flex: 4}}>
            {this.getScoreIcon()}
            <GridComponent
              width={this.logic.getWidth()}
              height={this.logic.getHeight()}
              grid={state.grid}
              style={{
                backgroundColor: props.theme.colors.tetrisBackground,
                flex: 1,
                marginLeft: 'auto',
                marginRight: 'auto',
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
          visible={state.dialogVisible}
          title={state.dialogTitle}
          message={state.dialogMessage}
          buttons={state.dialogButtons}
          onDismiss={state.onDialogDismiss}
        />
      </View>
    );
  }
}

export default withTheme(GameMainScreen);
