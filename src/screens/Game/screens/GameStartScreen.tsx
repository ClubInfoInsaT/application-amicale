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
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  Card,
  Divider,
  Headline,
  Paragraph,
  Text,
  withTheme,
} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Mascot, { MASCOT_STYLE } from '../../../components/Mascot/Mascot';
import MascotPopup from '../../../components/Mascot/MascotPopup';
import type { GridType } from '../components/GridComponent';
import GridComponent from '../components/GridComponent';
import GridManager from '../logic/GridManager';
import Piece from '../logic/Piece';
import SpeechArrow from '../../../components/Mascot/SpeechArrow';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import GENERAL_STYLES from '../../../constants/Styles';

type GameStatsType = {
  score: number;
  level: number;
  time: number;
};

type PropsType = {
  navigation: StackNavigationProp<any>;
  route: {
    params: GameStatsType;
  };
  theme: ReactNativePaper.Theme;
};

const styles = StyleSheet.create({
  pieceContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pieceBackground: {
    position: 'absolute',
  },
  playButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },
  recapCard: {
    borderWidth: 2,
    marginLeft: 20,
    marginRight: 20,
  },
  recapContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  recapScoreContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  recapScore: {
    fontSize: 20,
  },
  recapScoreIcon: {
    marginLeft: 5,
  },
  recapIcon: {
    marginRight: 5,
    marginLeft: 5,
  },
  welcomeMascot: {
    width: '40%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  welcomeCard: {
    borderWidth: 2,
    marginLeft: 10,
    marginRight: 10,
  },
  centertext: {
    textAlign: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    marginTop: 10,
  },
  speechArrow: {
    marginLeft: '60%',
  },
  podiumContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  podiumIconContainer: {
    position: 'absolute',
    top: -20,
  },
  topScoreContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  topScoreSubcontainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

class GameStartScreen extends React.Component<PropsType> {
  gridManager: GridManager;

  scores: Array<number>;

  gameStats?: GameStatsType;

  isHighScore: boolean;

  constructor(props: PropsType) {
    super(props);
    this.isHighScore = false;
    this.gridManager = new GridManager(4, 4, props.theme);
    // TODO
    // this.scores = AsyncStorageManager.getObject(
    //   AsyncStorageManager.PREFERENCES.gameScores.key
    // );
    this.scores = [];
    this.scores.sort((a: number, b: number): number => b - a);
    if (props.route.params != null) {
      this.recoverGameScore();
    }
  }

  getPiecesBackground() {
    const { theme } = this.props;
    const gridList = [];
    for (let i = 0; i < 18; i += 1) {
      gridList.push(this.gridManager.getEmptyGrid(4, 4));
      const piece = new Piece(theme);
      piece.toGrid(gridList[i], true);
    }
    return (
      <View style={styles.pieceContainer}>
        {gridList.map((item: GridType, index: number) => {
          const size = 10 + Math.floor(Math.random() * 30);
          const top = Math.floor(Math.random() * 100);
          const rot = Math.floor(Math.random() * 360);
          const left = (index % 6) * 20;
          const animDelay = size * 20;
          const animDuration = 2 * (2000 - size * 30);
          return (
            <Animatable.View
              useNativeDriver
              animation="fadeInDownBig"
              delay={animDelay}
              duration={animDuration}
              key={`piece${index.toString()}`}
              style={{
                width: `${size}%`,
                top: `${top}%`,
                left: `${left}%`,
                ...styles.pieceBackground,
              }}
            >
              <GridComponent
                width={4}
                height={4}
                grid={item}
                style={{
                  transform: [{ rotateZ: `${rot}deg` }],
                }}
              />
            </Animatable.View>
          );
        })}
      </View>
    );
  }

  getPostGameContent(stats: GameStatsType) {
    const { props } = this;
    const width = this.isHighScore ? '50%' : '30%';
    const margin = this.isHighScore ? 'auto' : undefined;
    const marginLeft = this.isHighScore ? '60%' : '20%';
    const color = this.isHighScore
      ? props.theme.colors.gameGold
      : props.theme.colors.primary;
    return (
      <View style={GENERAL_STYLES.flex}>
        <Mascot
          emotion={this.isHighScore ? MASCOT_STYLE.LOVE : MASCOT_STYLE.NORMAL}
          animated={this.isHighScore}
          style={{
            width: width,
            marginLeft: margin,
            marginRight: margin,
          }}
        />
        <SpeechArrow
          style={{ marginLeft: marginLeft }}
          size={20}
          color={props.theme.colors.mascotMessageArrow}
        />
        <Card
          style={{
            borderColor: props.theme.colors.mascotMessageArrow,
            ...styles.recapCard,
          }}
        >
          <Card.Content>
            <Headline
              style={{
                color: color,
                ...styles.centertext,
              }}
            >
              {this.isHighScore
                ? i18n.t('screens.game.newHighScore')
                : i18n.t('screens.game.gameOver')}
            </Headline>
            <Divider />
            <View style={styles.recapScoreContainer}>
              <Text style={styles.recapScore}>
                {i18n.t('screens.game.score', { score: stats.score })}
              </Text>
              <MaterialCommunityIcons
                name="star"
                color={props.theme.colors.tetrisScore}
                size={30}
                style={styles.recapScoreIcon}
              />
            </View>
            <View style={styles.recapContainer}>
              <Text>{i18n.t('screens.game.level')}</Text>
              <MaterialCommunityIcons
                style={styles.recapIcon}
                name="gamepad-square"
                size={20}
                color={props.theme.colors.textDisabled}
              />
              <Text>{stats.level}</Text>
            </View>
            <View style={styles.recapContainer}>
              <Text>{i18n.t('screens.game.time')}</Text>
              <MaterialCommunityIcons
                style={styles.recapIcon}
                name="timer"
                size={20}
                color={props.theme.colors.textDisabled}
              />
              <Text>{stats.time}</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }

  getWelcomeText() {
    const { props } = this;
    return (
      <View>
        <Mascot emotion={MASCOT_STYLE.COOL} style={styles.welcomeMascot} />
        <SpeechArrow
          style={styles.speechArrow}
          size={20}
          color={props.theme.colors.mascotMessageArrow}
        />
        <Card
          style={{
            borderColor: props.theme.colors.mascotMessageArrow,
            ...styles.welcomeCard,
          }}
        >
          <Card.Content>
            <Headline
              style={{
                color: props.theme.colors.primary,
                ...styles.centertext,
              }}
            >
              {i18n.t('screens.game.welcomeTitle')}
            </Headline>
            <Divider />
            <Paragraph style={styles.welcomeText}>
              {i18n.t('screens.game.welcomeMessage')}
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  }

  getPodiumRender(place: 1 | 2 | 3, score: string) {
    const { props } = this;
    let icon = 'podium-gold';
    let color = props.theme.colors.gameGold;
    let fontSize = 20;
    let size = 70;
    if (place === 2) {
      icon = 'podium-silver';
      color = props.theme.colors.gameSilver;
      fontSize = 18;
      size = 60;
    } else if (place === 3) {
      icon = 'podium-bronze';
      color = props.theme.colors.gameBronze;
      fontSize = 15;
      size = 50;
    }
    const marginLeft = place === 2 ? 20 : 'auto';
    const marginRight = place === 3 ? 20 : 'auto';
    const fontWeight = place === 1 ? 'bold' : undefined;
    return (
      <View
        style={{
          marginLeft: marginLeft,
          marginRight: marginRight,
          ...styles.podiumContainer,
        }}
      >
        {this.isHighScore && place === 1 ? (
          <Animatable.View
            animation="swing"
            iterationCount="infinite"
            duration={2000}
            delay={1000}
            useNativeDriver
            style={styles.podiumIconContainer}
          >
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              useNativeDriver
            >
              <MaterialCommunityIcons
                name="decagram"
                color={props.theme.colors.gameGold}
                size={150}
              />
            </Animatable.View>
          </Animatable.View>
        ) : null}
        <MaterialCommunityIcons
          name={icon}
          color={this.isHighScore && place === 1 ? '#fff' : color}
          size={size}
        />
        <Text
          style={{
            fontWeight: fontWeight,
            fontSize,
            ...styles.centertext,
          }}
        >
          {score}
        </Text>
      </View>
    );
  }

  getTopScoresRender() {
    const gold = this.scores.length > 0 ? this.scores[0] : '-';
    const silver = this.scores.length > 1 ? this.scores[1] : '-';
    const bronze = this.scores.length > 2 ? this.scores[2] : '-';
    return (
      <View style={styles.topScoreContainer}>
        {this.getPodiumRender(1, gold.toString())}
        <View style={styles.topScoreSubcontainer}>
          {this.getPodiumRender(3, bronze.toString())}
          {this.getPodiumRender(2, silver.toString())}
        </View>
      </View>
    );
  }

  getMainContent() {
    const { props } = this;
    return (
      <View style={GENERAL_STYLES.flex}>
        {this.gameStats != null
          ? this.getPostGameContent(this.gameStats)
          : this.getWelcomeText()}
        <Button
          icon="play"
          mode="contained"
          onPress={() => {
            props.navigation.replace('game-main', {
              highScore: this.scores.length > 0 ? this.scores[0] : null,
            });
          }}
          style={styles.playButton}
        >
          {i18n.t('screens.game.play')}
        </Button>
        {this.getTopScoresRender()}
      </View>
    );
  }

  keyExtractor = (item: number): string => item.toString();

  recoverGameScore() {
    const { route } = this.props;
    this.gameStats = route.params;
    if (this.gameStats.score != null) {
      this.isHighScore =
        this.scores.length === 0 || this.gameStats.score > this.scores[0];
      for (let i = 0; i < 3; i += 1) {
        if (this.scores.length > i && this.gameStats.score > this.scores[i]) {
          this.scores.splice(i, 0, this.gameStats.score);
          break;
        } else if (this.scores.length <= i) {
          this.scores.push(this.gameStats.score);
          break;
        }
      }
      if (this.scores.length > 3) {
        this.scores.splice(3, 1);
      }
      // TODO
      // AsyncStorageManager.set(
      //   AsyncStorageManager.PREFERENCES.gameScores.key,
      //   this.scores
      // );
    }
  }

  render() {
    const { props } = this;
    return (
      <View style={GENERAL_STYLES.flex}>
        {this.getPiecesBackground()}
        <LinearGradient
          style={GENERAL_STYLES.flex}
          colors={[
            `${props.theme.colors.background}00`,
            props.theme.colors.background,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <CollapsibleScrollView headerColors={'transparent'}>
            {this.getMainContent()}
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
}

export default withTheme(GameStartScreen);
