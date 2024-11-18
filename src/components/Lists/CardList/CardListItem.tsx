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
import { Avatar, List } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { ServiceItemType } from '../../../utils/Services';

type PropsType = {
  item: ServiceItemType;
};

const styles = StyleSheet.create({
  listItem: {
    width: '100%',
  },
  cover: {
    height: 60,
    width: 60,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function CardListItem(props: PropsType) {
  const { item } = props;
  const source =
    typeof item.image === 'number' ? item.image : { uri: item.image };

  const cardIcon = () => (
    <Avatar.Image size={50} source={source} style={styles.cover} />
  );

  const getChevronIcon = (iconProps: {
    color: string;
    style?: {
      marginRight: number;
      marginVertical?: number;
    };
  }) => {
    return (
      <List.Icon
        color={iconProps.color}
        style={iconProps.style}
        icon="chevron-right"
      />
    );
  };

  return (
    <List.Item
      title={item.title}
      description={item.subtitle}
      left={cardIcon}
      right={getChevronIcon}
      onPress={item.onPress}
      style={styles.listItem}
    />
  );
}

export default React.memo(CardListItem, () => true);
