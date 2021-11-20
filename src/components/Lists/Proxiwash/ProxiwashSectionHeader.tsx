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
import { Avatar, Text, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';

type Props = {
  title: string;
  isDryer: boolean;
  nbAvailable: number;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    marginTop: 20,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textContainer: {
    justifyContent: 'center',
  },
});

/**
 * Component used to display a proxiwash item, showing machine progression and state
 */
function ProxiwashListItem(props: Props) {
  const theme = useTheme();

  const subtitle = `${props.nbAvailable} ${
    props.nbAvailable <= 1
      ? i18n.t('screens.proxiwash.numAvailable')
      : i18n.t('screens.proxiwash.numAvailablePlural')
  }`;
  const iconColor =
    props.nbAvailable > 0 ? theme.colors.success : theme.colors.primary;

  return (
    <View style={styles.container}>
      <Avatar.Icon
        icon={props.isDryer ? 'tumble-dryer' : 'washing-machine'}
        color={iconColor}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{props.title}</Text>
        <Text style={{ color: theme.colors.subtitle }}>{subtitle}</Text>
      </View>
    </View>
  );
}

export default ProxiwashListItem;
