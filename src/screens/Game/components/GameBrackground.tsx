import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from 'react-native-paper';
import GridManager from '../logic/GridManager';
import Piece from '../logic/Piece';
import GridComponent from './GridComponent';

const styles = StyleSheet.create({
  pieceContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pieceBackground: {
    position: 'absolute',
  },
});

export default function GameBackground() {
  const theme = useTheme();
  const gridManager = new GridManager(4, 4, theme);
  const gridList = [];
  for (let i = 0; i < 18; i += 1) {
    gridList.push(gridManager.getEmptyGrid(4, 4));
    const piece = new Piece(theme);
    piece.toGrid(gridList[i], true);
  }
  return (
    <View style={styles.pieceContainer}>
      {gridList.map((item, index) => {
        const size = 10 + Math.floor(Math.random() * 30);
        const top = Math.floor(Math.random() * 100);
        const rot = Math.floor(Math.random() * 360);
        const left = (index % 6) * 20;
        const animDelay = size * 20;
        const animDuration = 2 * (2000 - size * 30);
        return (
          <Animatable.View
            useNativeDriver={true}
            animation={'fadeInDownBig'}
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
