import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from 'i18n-js';
import { Text, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import GENERAL_STYLES from '../../../constants/Styles';

type Props = {
  score: number;
  highScore?: number;
};

const styles = StyleSheet.create({
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
  centerVerticalSmallMargin: {
    ...GENERAL_STYLES.centerVertical,
    marginLeft: 5,
  },
});

function GameScore(props: Props) {
  const { score, highScore } = props;
  const theme = useTheme();
  const displayHighScore =
    highScore == null || score > highScore ? score : highScore;
  return (
    <View style={styles.scoreMainContainer}>
      <View style={styles.scoreCurrentContainer}>
        <Text style={styles.scoreText}>
          {i18n.t('screens.game.score', { score: score })}
        </Text>
        <MaterialCommunityIcons
          name="star"
          color={theme.colors.tetrisScore}
          size={20}
          style={styles.centerVerticalSmallMargin}
        />
      </View>
      <View style={styles.scoreBestContainer}>
        <Text
          style={{
            ...styles.scoreText,
            color: theme.colors.textDisabled,
          }}
        >
          {i18n.t('screens.game.highScore', { score: displayHighScore })}
        </Text>
        <MaterialCommunityIcons
          name="star"
          color={theme.colors.tetrisScore}
          size={10}
          style={styles.centerVerticalSmallMargin}
        />
      </View>
    </View>
  );
}

export default React.memo(
  GameScore,
  (pp, np) => pp.highScore === np.highScore && pp.score === np.score
);
