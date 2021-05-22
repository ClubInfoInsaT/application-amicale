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
import { Button, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import LinearGradient from 'react-native-linear-gradient';
import { MASCOT_STYLE } from '../../../components/Mascot/Mascot';
import MascotPopup from '../../../components/Mascot/MascotPopup';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import GENERAL_STYLES from '../../../constants/Styles';
import GameBackground from '../components/GameBrackground';
import PostGameContent from '../components/PostGameContent';
import WelcomeGameContent from '../components/WelcomeGameContent';
import FullGamePodium from '../components/FullGamePodium';
import { useNavigation } from '@react-navigation/core';
import { usePreferences } from '../../../context/preferencesContext';
import {
  getPreferenceObject,
  PreferenceKeys,
} from '../../../utils/asyncStorage';
import { StackNavigationProp } from '@react-navigation/stack';

type GameStatsType = {
  score: number;
  level: number;
  time: number;
  isHighScore: boolean;
};

type Props = {
  route: {
    params?: GameStatsType;
  };
};

const styles = StyleSheet.create({
  playButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },
});

export default function GameStartScreen(props: Props) {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { preferences } = usePreferences();

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

  const scores = getScores();
  const lastGameStats = props.route.params;

  const getMainContent = () => {
    return (
      <View style={GENERAL_STYLES.flex}>
        {lastGameStats ? (
          <PostGameContent
            stats={lastGameStats}
            isHighScore={lastGameStats.isHighScore}
          />
        ) : (
          <WelcomeGameContent />
        )}
        <Button
          icon={'play'}
          mode={'contained'}
          onPress={() => {
            navigation.replace('game-main');
          }}
          style={styles.playButton}
        >
          {i18n.t('screens.game.play')}
        </Button>
        <FullGamePodium
          scores={scores}
          isHighScore={lastGameStats?.isHighScore === true}
        />
      </View>
    );
  };

  return (
    <View style={GENERAL_STYLES.flex}>
      <GameBackground />
      <LinearGradient
        style={GENERAL_STYLES.flex}
        colors={[`${theme.colors.background}00`, theme.colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <CollapsibleScrollView headerColors={'transparent'}>
          {getMainContent()}
          <MascotPopup
            title={i18n.t('screens.game.mascotDialog.title')}
            message={i18n.t('screens.game.mascotDialog.message')}
            icon="gamepad-variant"
            buttons={{
              cancel: {
                message: i18n.t('screens.game.mascotDialog.button'),
                icon: 'check',
              },
            }}
            emotion={MASCOT_STYLE.COOL}
          />
        </CollapsibleScrollView>
      </LinearGradient>
    </View>
  );
}
