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
import { List } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  item: {
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 10,
    marginRight: 10,
  },
});

function ActionsDashBoardItem() {
  const navigation = useNavigation();
  return (
    <View>
      <List.Item
        title={i18n.t('screens.feedback.homeButtonTitle')}
        description={i18n.t('screens.feedback.homeButtonSubtitle')}
        left={(props) => (
          <List.Icon
            color={props.color}
            style={props.style}
            icon="comment-quote"
          />
        )}
        right={(props) => (
          <List.Icon
            color={props.color}
            style={props.style}
            icon="chevron-right"
          />
        )}
        onPress={(): void => navigation.navigate('feedback')}
        style={styles.item}
      />
    </View>
  );
}

export default ActionsDashBoardItem;
