import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

type Props = {
  place: 1 | 2 | 3;
  score: string;
  isHighScore: boolean;
};

const styles = StyleSheet.create({
  podiumContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  podiumIconContainer: {
    position: 'absolute',
    top: -20,
  },
  centertext: {
    textAlign: 'center',
  },
});

export function GamePodium(props: Props) {
  const { place, score, isHighScore } = props;
  const theme = useTheme();
  let icon = 'podium-gold';
  let color = theme.colors.gameGold;
  let fontSize = 20;
  let size = 70;
  if (place === 2) {
    icon = 'podium-silver';
    color = theme.colors.gameSilver;
    fontSize = 18;
    size = 60;
  } else if (place === 3) {
    icon = 'podium-bronze';
    color = theme.colors.gameBronze;
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
      {isHighScore && place === 1 ? (
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
              color={theme.colors.gameGold}
              size={150}
            />
          </Animatable.View>
        </Animatable.View>
      ) : null}
      <MaterialCommunityIcons
        name={icon}
        color={isHighScore && place === 1 ? '#fff' : color}
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
