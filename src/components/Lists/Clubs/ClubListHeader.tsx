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
import { Card, Chip, List, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import AnimatedAccordion from '../../Animations/AnimatedAccordion';
import { isItemInCategoryFilter } from '../../../utils/Search';
import GENERAL_STYLES from '../../../constants/Styles';

type PropsType = {
  categories: Array<string>;
  onChipSelect: (id: string) => void;
  selectedCategories: Array<string>;
};

const styles = StyleSheet.create({
  card: {
    margin: 5,
  },
  text: {
    paddingLeft: 0,
    marginTop: 5,
    marginBottom: 10,
    ...GENERAL_STYLES.centerHorizontal,
  },
  chipContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 0,
    marginBottom: 5,
  },
  chip: {
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
  },
});

function ClubListHeader(props: PropsType) {
  const getChipRender = (category: string, key: string) => {
    const onPress = (): void => props.onChipSelect(category);
    return (
      <Chip
        selected={isItemInCategoryFilter(props.selectedCategories, [
          category,
          null,
        ])}
        mode="outlined"
        onPress={onPress}
        style={styles.chip}
        key={key}
      >
        {category}
      </Chip>
    );
  };

  const getCategoriesRender = () => {
    const final: Array<React.ReactNode> = [];
    if (props.categories) {
      props.categories.forEach((cat: string) => {
        final.push(getChipRender(cat, cat));
      });
    }
    return final;
  };

  return (
    <Card style={styles.card}>
      <AnimatedAccordion
        title={i18n.t('screens.clubs.categories')}
        left={(iconProps) => (
          <List.Icon
            color={iconProps.color}
            style={iconProps.style}
            icon="star"
          />
        )}
        opened={true}
        renderItem={() => (
          <View>
            <Text style={styles.text}>
              {i18n.t('screens.clubs.categoriesFilterMessage')}
            </Text>
            <View style={styles.chipContainer}>{getCategoriesRender()}</View>
          </View>
        )}
      />
    </Card>
  );
}

const areEqual = (prevProps: PropsType, nextProps: PropsType): boolean => {
  return (
    prevProps.selectedCategories.length === nextProps.selectedCategories.length
  );
};

export default React.memo(ClubListHeader, areEqual);
