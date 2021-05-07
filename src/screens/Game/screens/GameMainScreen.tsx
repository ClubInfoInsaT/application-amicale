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

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, IconButton, Text, withTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from 'i18n-js';
import { StackNavigationProp } from '@react-navigation/stack';
import GameLogic from '../logic/GameLogic';
import type { GridType } from '../components/GridComponent';
import GridComponent from '../components/GridComponent';
import Preview from '../components/Preview';
import MaterialHeaderButtons, {
  Item,
} from '../../../components/Overrides/CustomHeaderButton';
import type { OptionsDialogButtonType } from '../../../components/Dialogs/OptionsDialog';
import OptionsDialog from '../../../components/Dialogs/OptionsDialog';
import GENERAL_STYLES from '../../../constants/Styles';

type PropsType = {
  navigation: StackNavigationProp<any>;
  route: { params: { highScore: number } };
  theme: ReactNativePaper.Theme;
};

type StateType = {
  grid: GridType;
  gameTime: number;
  gameScore: number;
  gameLevel: number;

  dialogVisible: boolean;
  dialogTitle: string;
  dialogMessage: string;
  dialogButtons: Array<OptionsDialogButtonType>;
  onDialogDismiss: () => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  gridContainer: {
    flex: 4,
  },
  centerSmallMargin: {
    ...GENERAL_STYLES.centerHorizontal,
    marginBottom: 5,
  },
  centerVerticalSmallMargin: {
    ...GENERAL_STYLES.centerVertical,
    marginLeft: 5,
  },
  centerBigMargin: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusIcon: {
    marginLeft: 5,
  },
  scoreMainContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  scoreCurrentContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  scoreText: {
    marginLeft: 5,
    fontSize: 20,
  },
  scoreBestContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
  },
  controlsContainer: {
    height: 80,
    flexDirection: 'row',
  },
  directionsContainer: {
    flexDirection: 'row',
    flex: 4,
  },
  preview: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },
});

class GameMainScreen extends React.Component<PropsType, StateType> {
  static getFormattedTime(seconds: number): string {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(seconds);
    let format;
    if (date.getHours()) {
      format = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    } else if (date.getMinutes()) {
      format = `${date.getMinutes()}:${date.getSeconds()}`;
    } else {
      format = date.getSeconds().toString();
    }
    return format;
  }

  logic: GameLogic;

  highScore: number | null;

  constructor(props: PropsType) {
    super(props);
    this.highScore = null;
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
    if (props.route.params != null) {
      this.highScore = props.route.params.highScore;
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions({
      headerRight: this.getRightButton,
    });
    this.startGame();
  }

  componentWillUnmount() {
    this.logic.endGame(true);
  }

  getRightButton = () => {
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
    this.setState({ dialogVisible: false });
  };

  onGameEnd = (time: number, score: number, isRestart: boolean) => {
    const { props, state } = this;
    this.setState({
      gameTime: time,
      gameScore: score,
    });
    if (!isRestart) {
      props.navigation.replace('game-start', {
        score: state.gameScore,
        level: state.gameLevel,
        time: state.gameTime,
      });
    }
  };

  getStatusIcons() {
    const { props, state } = this;
    return (
      <View
        style={{
          ...GENERAL_STYLES.flex,
          ...GENERAL_STYLES.centerVertical,
        }}
      >
        <View style={GENERAL_STYLES.centerHorizontal}>
          <Caption style={styles.centerSmallMargin}>
            {i18n.t('screens.game.time')}
          </Caption>
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons
              name="timer"
              color={props.theme.colors.subtitle}
              size={20}
            />
            <Text
              style={{
                ...styles.statusIcon,
                color: props.theme.colors.subtitle,
              }}
            >
              {GameMainScreen.getFormattedTime(state.gameTime)}
            </Text>
          </View>
        </View>
        <View style={styles.centerBigMargin}>
          <Caption style={styles.centerSmallMargin}>
            {i18n.t('screens.game.level')}
          </Caption>
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons
              name="gamepad-square"
              color={props.theme.colors.text}
              size={20}
            />
            <Text style={styles.statusIcon}>{state.gameLevel}</Text>
          </View>
        </View>
      </View>
    );
  }

  getScoreIcon() {
    const { props, state } = this;
    const highScore =
      this.highScore == null || state.gameScore > this.highScore
        ? state.gameScore
        : this.highScore;
    return (
      <View style={styles.scoreMainContainer}>
        <View style={styles.scoreCurrentContainer}>
          <Text style={styles.scoreText}>
            {i18n.t('screens.game.score', { score: state.gameScore })}
          </Text>
          <MaterialCommunityIcons
            name="star"
            color={props.theme.colors.tetrisScore}
            size={20}
            style={styles.centerVerticalSmallMargin}
          />
        </View>
        <View style={styles.scoreBestContainer}>
          <Text
            style={{
              ...styles.scoreText,
              color: props.theme.colors.textDisabled,
            }}
          >
            {i18n.t('screens.game.highScore', { score: highScore })}
          </Text>
          <MaterialCommunityIcons
            name="star"
            color={props.theme.colors.tetrisScore}
            size={10}
            style={styles.centerVerticalSmallMargin}
          />
        </View>
      </View>
    );
  }

  getControlButtons() {
    const { props } = this;
    return (
      <View style={styles.controlsContainer}>
        <IconButton
          icon="rotate-right-variant"
          size={40}
          onPress={() => {
            this.logic.rotatePressed(this.updateGrid);
          }}
          style={GENERAL_STYLES.flex}
        />
        <View style={styles.directionsContainer}>
          <IconButton
            icon="chevron-left"
            size={40}
            style={GENERAL_STYLES.flex}
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
            style={GENERAL_STYLES.flex}
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
          style={GENERAL_STYLES.flex}
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
      grid: GridType;
      gameScore: number;
    } => ({
      grid: newGrid,
      gameScore: score != null ? score : prevState.gameScore,
    }));
  };

  togglePause = () => {
    this.logic.togglePause();
    if (this.logic.isGamePaused()) {
      this.showPausePopup();
    }
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

  render() {
    const { props, state } = this;
    return (
      <View style={GENERAL_STYLES.flex}>
        <View style={styles.container}>
          {this.getStatusIcons()}
          <View style={styles.gridContainer}>
            {this.getScoreIcon()}
            <GridComponent
              width={this.logic.getWidth()}
              height={this.logic.getHeight()}
              grid={state.grid}
              style={{
                backgroundColor: props.theme.colors.tetrisBackground,
                ...GENERAL_STYLES.flex,
                ...GENERAL_STYLES.centerHorizontal,
              }}
            />
          </View>

          <View style={GENERAL_STYLES.flex}>
            <Preview
              items={this.logic.getNextPiecesPreviews()}
              style={styles.preview}
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
