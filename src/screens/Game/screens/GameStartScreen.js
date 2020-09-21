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
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Button,
  Card,
  Divider,
  Headline,
  Paragraph,
  Text,
  withTheme,
} from 'react-native-paper';
import {View} from 'react-native';
import i18n from 'i18n-js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import Mascot, {MASCOT_STYLE} from '../../../components/Mascot/Mascot';
import MascotPopup from '../../../components/Mascot/MascotPopup';
import AsyncStorageManager from '../../../managers/AsyncStorageManager';
import type {GridType} from '../components/GridComponent';
import GridComponent from '../components/GridComponent';
import GridManager from '../logic/GridManager';
import Piece from '../logic/Piece';
import SpeechArrow from '../../../components/Mascot/SpeechArrow';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';

type GameStatsType = {
  score: number,
  level: number,
  time: number,
};

type PropsType = {
  navigation: StackNavigationProp,
  route: {
    params: GameStatsType,
  },
  theme: CustomThemeType,
};

class GameStartScreen extends React.Component<PropsType> {
  gridManager: GridManager;

  scores: Array<number>;

  gameStats: GameStatsType | null;

  isHighScore: boolean;

  constructor(props: PropsType) {
    super(props);
    this.gridManager = new GridManager(4, 4, props.theme);
    this.scores = AsyncStorageManager.getObject(
      AsyncStorageManager.PREFERENCES.gameScores.key,
    );
    this.scores.sort((a: number, b: number): number => b - a);
    if (props.route.params != null) this.recoverGameScore();
  }

  getPiecesBackground(): React.Node {
    const {theme} = this.props;
    const gridList = [];
    for (let i = 0; i < 18; i += 1) {
      gridList.push(this.gridManager.getEmptyGrid(4, 4));
      const piece = new Piece(theme);
      piece.toGrid(gridList[i], true);
    }
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        {gridList.map((item: GridType, index: number): React.Node => {
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
                position: 'absolute',
                top: `${top}%`,
                left: `${left}%`,
              }}>
              <GridComponent
                width={4}
                height={4}
                grid={item}
                style={{
                  transform: [{rotateZ: `${rot}deg`}],
                }}
              />
            </Animatable.View>
          );
        })}
      </View>
    );
  }

  getPostGameContent(stats: GameStatsType): React.Node {
    const {props} = this;
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Mascot
          emotion={this.isHighScore ? MASCOT_STYLE.LOVE : MASCOT_STYLE.NORMAL}
          animated={this.isHighScore}
          style={{
            width: this.isHighScore ? '50%' : '30%',
            marginLeft: this.isHighScore ? 'auto' : null,
            marginRight: this.isHighScore ? 'auto' : null,
          }}
        />
        <SpeechArrow
          style={{marginLeft: this.isHighScore ? '60%' : '20%'}}
          size={20}
          color={props.theme.colors.mascotMessageArrow}
        />
        <Card
          style={{
            borderColor: props.theme.colors.mascotMessageArrow,
            borderWidth: 2,
            marginLeft: 20,
            marginRight: 20,
          }}>
          <Card.Content>
            <Headline
              style={{
                textAlign: 'center',
                color: this.isHighScore
                  ? props.theme.colors.gameGold
                  : props.theme.colors.primary,
              }}>
              {this.isHighScore
                ? i18n.t('screens.game.newHighScore')
                : i18n.t('screens.game.gameOver')}
            </Headline>
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                }}>
                {i18n.t('screens.game.score', {score: stats.score})}
              </Text>
              <MaterialCommunityIcons
                name="star"
                color={props.theme.colors.tetrisScore}
                size={30}
                style={{
                  marginLeft: 5,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              <Text>{i18n.t('screens.game.level')}</Text>
              <MaterialCommunityIcons
                style={{
                  marginRight: 5,
                  marginLeft: 5,
                }}
                name="gamepad-square"
                size={20}
                color={props.theme.colors.textDisabled}
              />
              <Text>{stats.level}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              <Text>{i18n.t('screens.game.time')}</Text>
              <MaterialCommunityIcons
                style={{
                  marginRight: 5,
                  marginLeft: 5,
                }}
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

  getWelcomeText(): React.Node {
    const {props} = this;
    return (
      <View>
        <Mascot
          emotion={MASCOT_STYLE.COOL}
          style={{
            width: '40%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
        <SpeechArrow
          style={{marginLeft: '60%'}}
          size={20}
          color={props.theme.colors.mascotMessageArrow}
        />
        <Card
          style={{
            borderColor: props.theme.colors.mascotMessageArrow,
            borderWidth: 2,
            marginLeft: 10,
            marginRight: 10,
          }}>
          <Card.Content>
            <Headline
              style={{
                textAlign: 'center',
                color: props.theme.colors.primary,
              }}>
              {i18n.t('screens.game.welcomeTitle')}
            </Headline>
            <Divider />
            <Paragraph
              style={{
                textAlign: 'center',
                marginTop: 10,
              }}>
              {i18n.t('screens.game.welcomeMessage')}
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  }

  getPodiumRender(place: 1 | 2 | 3, score: string): React.Node {
    const {props} = this;
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
    return (
      <View
        style={{
          marginLeft: place === 2 ? 20 : 'auto',
          marginRight: place === 3 ? 20 : 'auto',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        {this.isHighScore && place === 1 ? (
          <Animatable.View
            animation="swing"
            iterationCount="infinite"
            duration={2000}
            delay={1000}
            useNativeDriver
            style={{
              position: 'absolute',
              top: -20,
            }}>
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              useNativeDriver>
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
            textAlign: 'center',
            fontWeight: place === 1 ? 'bold' : null,
            fontSize,
          }}>
          {score}
        </Text>
      </View>
    );
  }

  getTopScoresRender(): React.Node {
    const gold = this.scores.length > 0 ? this.scores[0] : '-';
    const silver = this.scores.length > 1 ? this.scores[1] : '-';
    const bronze = this.scores.length > 2 ? this.scores[2] : '-';
    return (
      <View
        style={{
          marginBottom: 20,
          marginTop: 20,
        }}>
        {this.getPodiumRender(1, gold.toString())}
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          {this.getPodiumRender(3, bronze.toString())}
          {this.getPodiumRender(2, silver.toString())}
        </View>
      </View>
    );
  }

  getMainContent(): React.Node {
    const {props} = this;
    return (
      <View style={{flex: 1}}>
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
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 10,
          }}>
          {i18n.t('screens.game.play')}
        </Button>
        {this.getTopScoresRender()}
      </View>
    );
  }

  keyExtractor = (item: number): string => item.toString();

  recoverGameScore() {
    const {route} = this.props;
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
      if (this.scores.length > 3) this.scores.splice(3, 1);
      AsyncStorageManager.set(
        AsyncStorageManager.PREFERENCES.gameScores.key,
        this.scores,
      );
    }
  }

  render(): React.Node {
    const {props} = this;
    return (
      <View style={{flex: 1}}>
        {this.getPiecesBackground()}
        <LinearGradient
          style={{flex: 1}}
          colors={[
            `${props.theme.colors.background}00`,
            props.theme.colors.background,
          ]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}>
          <CollapsibleScrollView>
            {this.getMainContent()}
            <MascotPopup
              prefKey={AsyncStorageManager.PREFERENCES.gameStartMascot.key}
              title={i18n.t('screens.game.mascotDialog.title')}
              message={i18n.t('screens.game.mascotDialog.message')}
              icon="gamepad-variant"
              buttons={{
                action: null,
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
