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
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GENERAL_STYLES from '../../constants/Styles';
import Mascot, { MASCOT_STYLE } from '../Mascot/Mascot';

const styles = StyleSheet.create({
  mascot: {
    ...GENERAL_STYLES.center,
    width: '80%',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 25,
  },
  container: {
    position: 'absolute',
    bottom: 30,
    right: '20%',
    width: 50,
    height: 50,
  },
  icon: {
    ...GENERAL_STYLES.center,
    transform: [{ rotateZ: '70deg' }],
  },
});

function MascotIntroWelcome() {
  return (
    <View style={GENERAL_STYLES.flex}>
      <Mascot
        style={styles.mascot}
        emotion={MASCOT_STYLE.NORMAL}
        animated
        entryAnimation={{
          animation: 'bounceIn',
          duration: 2000,
        }}
      />
      <Animatable.Text
        useNativeDriver
        animation="fadeInUp"
        duration={500}
        style={styles.text}
      >
        PABLO
      </Animatable.Text>
      <Animatable.View
        useNativeDriver
        animation="fadeInUp"
        duration={500}
        delay={200}
        style={styles.container}
      >
        <MaterialCommunityIcons
          style={styles.icon}
          name="undo"
          color="#fff"
          size={40}
        />
      </Animatable.View>
    </View>
  );
}

export default MascotIntroWelcome;
