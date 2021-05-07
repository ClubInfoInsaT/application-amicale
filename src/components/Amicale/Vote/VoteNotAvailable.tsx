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

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline, useTheme } from 'react-native-paper';
import i18n from 'i18n-js';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  headline: {
    textAlign: 'center',
  },
});

function VoteNotAvailable() {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Headline
        style={{
          color: theme.colors.textDisabled,
          ...styles.headline,
        }}
      >
        {i18n.t('screens.vote.noVote')}
      </Headline>
    </View>
  );
}

export default VoteNotAvailable;
