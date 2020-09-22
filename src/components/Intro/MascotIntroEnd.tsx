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
import {StyleSheet, View} from 'react-native';
import Mascot, {MASCOT_STYLE} from '../Mascot/Mascot';

const styles = StyleSheet.create({
  center: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

function MascotIntroEnd() {
  return (
    <View style={{flex: 1}}>
      <Mascot
        style={{
          ...styles.center,
          width: '80%',
        }}
        emotion={MASCOT_STYLE.COOL}
        animated
        entryAnimation={{
          animation: 'slideInDown',
          duration: 2000,
        }}
        loopAnimation={{
          animation: 'pulse',
          duration: 2000,
          iterationCount: 'infinite',
        }}
      />
    </View>
  );
}

export default MascotIntroEnd;
