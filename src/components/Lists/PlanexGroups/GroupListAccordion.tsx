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
import { List, withTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';
import { stringMatchQuery } from '../../../utils/Search';
import GroupListItem from './GroupListItem';
import AnimatedAccordion from '../../Animations/AnimatedAccordion';
import type {
  PlanexGroupType,
  PlanexGroupCategoryType,
} from '../../../screens/Planex/GroupSelectionScreen';

type PropsType = {
  item: PlanexGroupCategoryType;
  favorites: Array<PlanexGroupType>;
  onGroupPress: (data: PlanexGroupType) => void;
  onFavoritePress: (data: PlanexGroupType) => void;
  currentSearchString: string;
  theme: ReactNativePaper.Theme;
};

const LIST_ITEM_HEIGHT = 64;
const REPLACE_REGEX = /_/g;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});

class GroupListAccordion extends React.Component<PropsType> {
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const { props } = this;
    return (
      nextProps.currentSearchString !== props.currentSearchString ||
      nextProps.favorites.length !== props.favorites.length ||
      nextProps.item.content.length !== props.item.content.length
    );
  }

  getRenderItem = ({ item }: { item: PlanexGroupType }) => {
    const { props } = this;
    const onPress = () => {
      props.onGroupPress(item);
    };
    const onStarPress = () => {
      props.onFavoritePress(item);
    };
    return (
      <GroupListItem
        height={LIST_ITEM_HEIGHT}
        item={item}
        favorites={props.favorites}
        onPress={onPress}
        onStarPress={onStarPress}
      />
    );
  };

  getData(): Array<PlanexGroupType> {
    const { props } = this;
    const originalData = props.item.content;
    const displayData: Array<PlanexGroupType> = [];
    originalData.forEach((data: PlanexGroupType) => {
      if (stringMatchQuery(data.name, props.currentSearchString)) {
        displayData.push(data);
      }
    });
    return displayData;
  }

  itemLayout = (
    data: Array<PlanexGroupType> | null | undefined,
    index: number
  ): { length: number; offset: number; index: number } => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT * index,
    index,
  });

  keyExtractor = (item: PlanexGroupType): string => item.id.toString();

  render() {
    const { props } = this;
    const { item } = this.props;
    return (
      <View>
        <AnimatedAccordion
          title={item.name.replace(REPLACE_REGEX, ' ')}
          style={styles.container}
          left={(iconProps) =>
            item.id === 0 ? (
              <List.Icon
                style={iconProps.style}
                icon="star"
                color={props.theme.colors.tetrisScore}
              />
            ) : null
          }
          unmountWhenCollapsed={item.id !== 0} // Only render list if expanded for increased performance
          opened={props.currentSearchString.length > 0}
        >
          <FlatList
            data={this.getData()}
            extraData={props.currentSearchString + props.favorites.length}
            renderItem={this.getRenderItem}
            keyExtractor={this.keyExtractor}
            listKey={item.id.toString()}
            // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
            getItemLayout={this.itemLayout}
            removeClippedSubviews
          />
        </AnimatedAccordion>
      </View>
    );
  }
}

export default withTheme(GroupListAccordion);
