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
import { Avatar, Chip, List, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import type { Club } from '../../../screens/Amicale/Clubs/ClubListScreen';
import GENERAL_STYLES from '../../../constants/Styles';

type Props = {
  onPress: () => void;
  item: Club;
  height: number;
};

const styles = StyleSheet.create({
  chip: {
    marginRight: 5,
    marginBottom: 5,
  },
  chipContainer: {
    flexDirection: 'row',
  },
  avatar: {
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginRight: 10,
  },
  icon: {
    ...GENERAL_STYLES.centerVertical,
    backgroundColor: 'transparent',
  },
  item: {
    justifyContent: 'center',
  },
});

const ClubListItem = React.memo(
  (props: Props) => {
    const theme = useTheme();
    const hasManagers: boolean = props.item.respo.length > 0;

    const getCategoriesRender = () => {
      const final: Array<React.ReactNode> = [];
      props.item.categories.forEach((category) => {
        if (category) {
          final.push(
            <Chip style={styles.chip} key={`${props.item.id}:${category}`}>
              {category}
            </Chip>
          );
        }
      });
      return <View style={styles.chipContainer}>{final}</View>;
    };

    function getRenderLogo() {
      if (props.item.logo)
        return (
          <Avatar.Image
            style={styles.avatar}
            size={64}
            source={{ uri: props.item.logo }}
          />
        );
      else return <view />;
    }

    return (
      <List.Item
        title={props.item.name}
        description={getCategoriesRender()}
        onPress={props.onPress}
        left={getRenderLogo}
        right={() => (
          <Avatar.Icon
            style={styles.icon}
            size={48}
            icon={hasManagers ? 'check-circle-outline' : 'alert-circle-outline'}
            color={hasManagers ? theme.colors.success : theme.colors.primary}
          />
        )}
        style={{
          height: props.height,
          ...styles.item,
        }}
      />
    );
  },
  () => true
); // Component is memoized and constant

export default ClubListItem;
