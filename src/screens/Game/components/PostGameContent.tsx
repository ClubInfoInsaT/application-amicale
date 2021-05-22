import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Divider, Headline, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Mascot, { MASCOT_STYLE } from '../../../components/Mascot/Mascot';
import SpeechArrow from '../../../components/Mascot/SpeechArrow';
import GENERAL_STYLES from '../../../constants/Styles';
import i18n from 'i18n-js';

type GameStatsType = {
  score: number;
  level: number;
  time: number;
};

type Props = {
  isHighScore: boolean;
  stats: GameStatsType;
};

const styles = StyleSheet.create({
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
  centertext: {
    textAlign: 'center',
  },
});

export default function PostGameContent(props: Props) {
  const { isHighScore, stats } = props;
  const theme = useTheme();
  const width = isHighScore ? '50%' : '30%';
  const margin = isHighScore ? 'auto' : undefined;
  const marginLeft = isHighScore ? '60%' : '20%';
  const color = isHighScore ? theme.colors.gameGold : theme.colors.primary;
  return (
    <View style={GENERAL_STYLES.flex}>
      <Mascot
        emotion={isHighScore ? MASCOT_STYLE.LOVE : MASCOT_STYLE.NORMAL}
        animated={isHighScore}
        style={{
          width: width,
          marginLeft: margin,
          marginRight: margin,
        }}
      />
      <SpeechArrow
        style={{ marginLeft: marginLeft }}
        size={20}
        color={theme.colors.mascotMessageArrow}
      />
      <Card
        style={{
          borderColor: theme.colors.mascotMessageArrow,
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
            {isHighScore
              ? i18n.t('screens.game.newHighScore')
              : i18n.t('screens.game.gameOver')}
          </Headline>
          <Divider />
          <View style={styles.recapScoreContainer}>
            <Text style={styles.recapScore}>
              {i18n.t('screens.game.score', { score: stats.score })}
            </Text>
            <MaterialCommunityIcons
              name={'star'}
              color={theme.colors.tetrisScore}
              size={30}
              style={styles.recapScoreIcon}
            />
          </View>
          <View style={styles.recapContainer}>
            <Text>{i18n.t('screens.game.level')}</Text>
            <MaterialCommunityIcons
              style={styles.recapIcon}
              name={'gamepad-square'}
              size={20}
              color={theme.colors.textDisabled}
            />
            <Text>{stats.level}</Text>
          </View>
          <View style={styles.recapContainer}>
            <Text>{i18n.t('screens.game.time')}</Text>
            <MaterialCommunityIcons
              style={styles.recapIcon}
              name={'timer'}
              size={20}
              color={theme.colors.textDisabled}
            />
            <Text>{stats.time}</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}
