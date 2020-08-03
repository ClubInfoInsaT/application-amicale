// @flow

import * as React from 'react';
import {Card, Chip, List, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import i18n from 'i18n-js';
import AnimatedAccordion from '../../Animations/AnimatedAccordion';
import {isItemInCategoryFilter} from '../../../utils/Search';
import type {ClubCategoryType} from '../../../screens/Amicale/Clubs/ClubListScreen';

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
          left={({size}: {size: number}): React.Node => (
            <List.Icon size={size} icon="star" />
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
