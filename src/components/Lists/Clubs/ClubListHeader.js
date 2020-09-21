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

// @flow

import * as React from 'react';
import {Card, Chip, List, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import i18n from 'i18n-js';
import AnimatedAccordion from '../../Animations/AnimatedAccordion';
import {isItemInCategoryFilter} from '../../../utils/Search';
import type {ClubCategoryType} from '../../../screens/Amicale/Clubs/ClubListScreen';
import type {ListIconPropsType} from '../../../constants/PaperStyles';

type PropsType = {
  categories: Array<ClubCategoryType>,
  onChipSelect: (id: number) => void,
  selectedCategories: Array<number>,
};

const styles = StyleSheet.create({
  card: {
    margin: 5,
  },
  text: {
    paddingLeft: 0,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  chipContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 0,
    marginBottom: 5,
  },
});

class ClubListHeader extends React.Component<PropsType> {
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return (
      nextProps.selectedCategories.length !== props.selectedCategories.length
    );
  }

  getChipRender = (category: ClubCategoryType, key: string): React.Node => {
    const {props} = this;
    const onPress = (): void => props.onChipSelect(category.id);
    return (
      <Chip
        selected={isItemInCategoryFilter(props.selectedCategories, [
          category.id,
          null,
        ])}
        mode="outlined"
        onPress={onPress}
        style={{marginRight: 5, marginLeft: 5, marginBottom: 5}}
        key={key}>
        {category.name}
      </Chip>
    );
  };

  getCategoriesRender(): React.Node {
    const {props} = this;
    const final = [];
    props.categories.forEach((cat: ClubCategoryType) => {
      final.push(this.getChipRender(cat, cat.id.toString()));
    });
    return final;
  }

  render(): React.Node {
    return (
      <Card style={styles.card}>
        <AnimatedAccordion
          title={i18n.t('screens.clubs.categories')}
          left={(props: ListIconPropsType): React.Node => (
            <List.Icon color={props.color} style={props.style} icon="star" />
          )}
          opened>
          <Text style={styles.text}>
            {i18n.t('screens.clubs.categoriesFilterMessage')}
          </Text>
          <View style={styles.chipContainer}>{this.getCategoriesRender()}</View>
        </AnimatedAccordion>
      </Card>
    );
  }
}

export default ClubListHeader;
