import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GamePodium } from './GamePodium';

type Props = {
  scores: Array<number>;
  isHighScore: boolean;
};

const styles = StyleSheet.create({
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

export default function FullGamePodium(props: Props) {
  const { scores, isHighScore } = props;
  const gold = scores.length > 0 ? scores[0] : '-';
  const silver = scores.length > 1 ? scores[1] : '-';
  const bronze = scores.length > 2 ? scores[2] : '-';
  return (
    <View style={styles.topScoreContainer}>
      <GamePodium place={1} score={gold.toString()} isHighScore={isHighScore} />
      <View style={styles.topScoreSubcontainer}>
        <GamePodium
          place={3}
          score={silver.toString()}
          isHighScore={isHighScore}
        />
        <GamePodium
          place={2}
          score={bronze.toString()}
          isHighScore={isHighScore}
        />
      </View>
    </View>
  );
}
