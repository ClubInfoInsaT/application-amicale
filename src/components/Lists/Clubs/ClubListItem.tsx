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
import { Avatar, Chip, List, withTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import type {
  ClubCategoryType,
  ClubType,
} from '../../../screens/Amicale/Clubs/ClubListScreen';
import GENERAL_STYLES from '../../../constants/Styles';

type PropsType = {
  onPress: () => void;
  categoryTranslator: (id: number) => ClubCategoryType | null;
  item: ClubType;
  height: number;
  theme: ReactNativePaper.Theme;
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

class ClubListItem extends React.Component<PropsType> {
  hasManagers: boolean;

  constructor(props: PropsType) {
    super(props);
    this.hasManagers = props.item.responsibles.length > 0;
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  getCategoriesRender(categories: Array<number | null>) {
    const { props } = this;
    const final: Array<React.ReactNode> = [];
    categories.forEach((cat: number | null) => {
      if (cat != null) {
        const category = props.categoryTranslator(cat);
        if (category) {
          final.push(
            <Chip style={styles.chip} key={`${props.item.id}:${category.id}`}>
              {category.name}
            </Chip>
          );
        }
      }
    });
    return <View style={styles.chipContainer}>{final}</View>;
  }

  render() {
    const { props } = this;
    const categoriesRender = () =>
      this.getCategoriesRender(props.item.category);
    const { colors } = props.theme;
    return (
      <List.Item
        title={props.item.name}
        description={categoriesRender}
        onPress={props.onPress}
        left={() => (
          <Avatar.Image
            style={styles.avatar}
            size={64}
            source={{ uri: props.item.logo }}
          />
        )}
        right={() => (
          <Avatar.Icon
            style={styles.icon}
            size={48}
            icon={
              this.hasManagers ? 'check-circle-outline' : 'alert-circle-outline'
            }
            color={this.hasManagers ? colors.success : colors.primary}
          />
        )}
        style={{
          height: props.height,
          ...styles.item,
        }}
      />
    );
  }
}

export default withTheme(ClubListItem);
