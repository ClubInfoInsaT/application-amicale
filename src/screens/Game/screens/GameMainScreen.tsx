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

import React, { useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
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
import { MainRoutes } from '../../../navigation/MainNavigator';
import GameStatus from '../components/GameStatus';
import GameControls from '../components/GameControls';
import GameScore from '../components/GameScore';
import { usePreferences } from '../../../context/preferencesContext';
import {
  getPreferenceObject,
  PreferenceKeys,
} from '../../../utils/asyncStorage';
import { useNavigation } from '@react-navigation/core';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  gridContainer: {
    flex: 4,
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

export default function GameMainScreen() {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const logic = useRef(new GameLogic(20, 10, theme));

  const [gameTime, setGameTime] = useState(0);

  const [gameState, setGameState] = useState({
    grid: logic.current.getCurrentGrid(),
    gameScore: 0,
    gameLevel: 0,
  });

  const [dialogContent, setDialogContent] = useState<{
    dialogTitle: string;
    dialogMessage: string;
    dialogButtons: Array<OptionsDialogButtonType>;
    onDialogDismiss: () => void;
  }>();

  const { preferences, updatePreferences } = usePreferences();

  function getScores() {
    const pref = getPreferenceObject(PreferenceKeys.gameScores, preferences) as
      | Array<number>
      | undefined;
    if (pref) {
      return pref.sort((a, b) => b - a);
    } else {
      return [];
    }
  }

  const savedScores = getScores();
  const highScore = savedScores.length > 0 ? savedScores[0] : undefined;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: getRightButton,
    });
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const getRightButton = () => (
    <MaterialHeaderButtons>
      <Item title={'pause'} iconName={'pause'} onPress={togglePause} />
    </MaterialHeaderButtons>
  );

  const onTick = (score: number, level: number, newGrid: GridType) => {
    setGameState({
      gameScore: score,
      gameLevel: level,
      grid: newGrid,
    });
  };

  const onDialogDismiss = () => setDialogContent(undefined);

  const onGameEnd = (time: number, score: number, isRestart: boolean) => {
    setGameState((prevState) => ({
      ...prevState,
      gameScore: score,
    }));
    setGameTime(time);
    const newScores = [...savedScores];
    const isHighScore = newScores.length === 0 || score > newScores[0];
    for (let i = 0; i < 3; i += 1) {
      if (newScores.length > i && score > newScores[i]) {
        newScores.splice(i, 0, score);
        break;
      } else if (newScores.length <= i) {
        newScores.push(score);
        break;
      }
    }
    if (newScores.length > 3) {
      newScores.splice(3, 1);
    }
    console.log(newScores);
    updatePreferences(PreferenceKeys.gameScores, newScores);
    if (!isRestart) {
      navigation.replace(MainRoutes.GameStart, {
        score: score,
        level: gameState.gameLevel,
        time: time,
        isHighScore: isHighScore,
      });
    }
  };

  const onDirectionPressed = (newGrid: GridType, score?: number) => {
    setGameState((prevState) => ({
      ...prevState,
      grid: newGrid,
      gameScore: score != null ? score : prevState.gameScore,
    }));
  };

  const togglePause = () => {
    logic.current.togglePause();
    if (logic.current.isGamePaused()) {
      showPausePopup();
    }
  };

  const showPausePopup = () => {
    const onDismiss = () => {
      togglePause();
      onDialogDismiss();
    };
    setDialogContent({
      dialogTitle: i18n.t('screens.game.pause'),
      dialogMessage: i18n.t('screens.game.pauseMessage'),
      dialogButtons: [
        {
          title: i18n.t('screens.game.restart.text'),
          onPress: showRestartConfirm,
        },
        {
          title: i18n.t('screens.game.resume'),
          onPress: onDismiss,
        },
      ],
      onDialogDismiss: onDismiss,
    });
  };

  const showRestartConfirm = () => {
    setDialogContent({
      dialogTitle: i18n.t('screens.game.restart.confirm'),
      dialogMessage: i18n.t('screens.game.restart.confirmMessage'),
      dialogButtons: [
        {
          title: i18n.t('screens.game.restart.confirmYes'),
          onPress: () => {
            onDialogDismiss();
            startGame();
          },
        },
        {
          title: i18n.t('screens.game.restart.confirmNo'),
          onPress: showPausePopup,
        },
      ],
      onDialogDismiss: showPausePopup,
    });
  };

  const startGame = () => {
    logic.current.startGame(onTick, setGameTime, onGameEnd);
  };

  return (
    <View style={GENERAL_STYLES.flex}>
      <View style={styles.container}>
        <GameStatus time={gameTime} level={gameState.gameLevel} />
        <View style={styles.gridContainer}>
          <GameScore score={gameState.gameScore} highScore={highScore} />
          <GridComponent
            width={logic.current.getWidth()}
            height={logic.current.getHeight()}
            grid={gameState.grid}
            style={{
              backgroundColor: theme.colors.tetrisBackground,
              ...GENERAL_STYLES.flex,
              ...GENERAL_STYLES.centerHorizontal,
            }}
          />
        </View>
        <View style={GENERAL_STYLES.flex}>
          <Preview
            items={logic.current.getNextPiecesPreviews()}
            style={styles.preview}
          />
        </View>
      </View>
      <GameControls
        logic={logic.current}
        onDirectionPressed={onDirectionPressed}
      />
      {dialogContent ? (
        <OptionsDialog
          visible={dialogContent !== undefined}
          title={dialogContent.dialogTitle}
          message={dialogContent.dialogMessage}
          buttons={dialogContent.dialogButtons}
          onDismiss={dialogContent.onDialogDismiss}
        />
      ) : null}
    </View>
  );
}
