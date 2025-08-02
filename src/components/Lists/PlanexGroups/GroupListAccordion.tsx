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
import { List, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet } from 'react-native';
import GroupListItem from './GroupListItem';
import AnimatedAccordion from '../../Animations/AnimatedAccordion';
import type {
  PlanexGroupType,
  PlanexGroupCategoryType,
} from '../../../screens/Planex/GroupSelectionScreen';
import i18n from 'i18n-js';

type PropsType = {
  item: PlanexGroupCategoryType;
  favorites: Array<PlanexGroupType>;
  onGroupPress: (data: PlanexGroupType) => void;
  onFavoritePress: (data: PlanexGroupType) => void;
  onEditPress: (data: PlanexGroupType) => void;
  currentSearchString: string;
};

const LIST_ITEM_HEIGHT = 64;
const REPLACE_REGEX = /_/g;
// The minimum number of characters to type before expanding the accordion
// This prevents expanding too many items at once
const MIN_SEARCH_SIZE_EXPAND = 2;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});

function GroupListAccordion(props: PropsType) {
  const theme = useTheme();

  const getRenderItem = ({ item }: { item: PlanexGroupType }) => {
    return (
      <GroupListItem
        height={LIST_ITEM_HEIGHT}
        item={item}
        isFav={props.favorites.some((f) => f.id === item.id)}
        onPress={() => props.onGroupPress(item)}
        onStarPress={() => props.onFavoritePress(item)}
        onEditPress={() => props.onEditPress(item)}
        subtitle={item.subtitle}
      />
    );
  };

  const itemLayout = (
    _data: Array<PlanexGroupType> | null | undefined,
    index: number
  ): { length: number; offset: number; index: number } => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT * index,
    index,
  });

  const keyExtractor = (item: PlanexGroupType): string => item.id.toString();

  var isFavorite = props.item.id === 0;
  var isEmptyFavorite = isFavorite && props.favorites.length === 0;

  return (
    <AnimatedAccordion
      title={
        isEmptyFavorite
          ? i18n.t('screens.planex.favorites.empty.title')
          : props.item.name.replace(REPLACE_REGEX, ' ')
      }
      subtitle={
        isEmptyFavorite
          ? i18n.t('screens.planex.favorites.empty.subtitle')
          : undefined
      }
      style={styles.container}
      left={(iconProps) =>
        isFavorite ? (
          <List.Icon
            style={iconProps.style}
            icon={'star'}
            color={theme.colors.tetrisScore}
          />
        ) : undefined
      }
      unmountWhenCollapsed={!isFavorite} // Only render list if expanded for increased performance
      opened={
        props.currentSearchString.length >= MIN_SEARCH_SIZE_EXPAND ||
        (isFavorite && !isEmptyFavorite)
      }
      enabled={!isEmptyFavorite}
      renderItem={() => (
        <FlatList
          data={props.item.content}
          extraData={props.currentSearchString + props.favorites.length}
          renderItem={getRenderItem}
          keyExtractor={keyExtractor}
          listKey={props.item.id.toString()}
          // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
          getItemLayout={itemLayout}
          removeClippedSubviews={true}
        />
      )}
    />
  );
}

const propsEqual = (pp: PropsType, np: PropsType) =>
  pp.currentSearchString === np.currentSearchString &&
  pp.favorites.length === np.favorites.length &&
  pp.item.content.length === np.item.content.length &&
  pp.onFavoritePress === np.onFavoritePress;

export default React.memo(GroupListAccordion, propsEqual);
