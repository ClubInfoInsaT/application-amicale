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

import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Platform } from 'react-native';
import i18n from 'i18n-js';
import { Searchbar } from 'react-native-paper';
import { stringMatchQuery } from '../../utils/Search';
import WebSectionList from '../../components/Screens/WebSectionList';
import GroupListAccordion from '../../components/Lists/PlanexGroups/GroupListAccordion';
import Urls from '../../constants/Urls';
import { readData } from '../../utils/WebData';
import { useNavigation } from '@react-navigation/core';
import { useCachedPlanexGroups } from '../../context/cacheContext';
import { usePlanexPreferences } from '../../context/preferencesContext';
import {
  getPreferenceObject,
  PlanexPreferenceKeys,
} from '../../utils/asyncStorage';

export type PlanexGroupType = {
  name: string;
  id: number;
};

export type PlanexGroupCategoryType = {
  name: string;
  id: number;
  content: Array<PlanexGroupType>;
};

export type PlanexGroupsType = { [key: string]: PlanexGroupCategoryType };

function sortName(
  a: PlanexGroupType | PlanexGroupCategoryType,
  b: PlanexGroupType | PlanexGroupCategoryType
): number {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  }
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }
  return 0;
}

function GroupSelectionScreen() {
  const navigation = useNavigation();
  const { preferences, updatePreferences } = usePlanexPreferences();
  const { groups, setGroups } = useCachedPlanexGroups();
  const [currentSearchString, setCurrentSearchString] = useState('');

  const getFavoriteGroups = (): Array<PlanexGroupType> => {
    const data = getPreferenceObject(
      PlanexPreferenceKeys.planexFavoriteGroups,
      preferences
    );
    if (data) {
      return data as Array<PlanexGroupType>;
    } else {
      return [];
    }
  };

  const favoriteGroups = getFavoriteGroups();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getSearchBar,
      headerBackTitleVisible: false,
      headerTitleContainerStyle:
        Platform.OS === 'ios'
          ? { marginHorizontal: 0, width: '70%' }
          : { width: '100%' },
    });
  }, [navigation]);

  const getSearchBar = () => {
    return (
      // @ts-ignore
      <Searchbar
        placeholder={i18n.t('screens.proximo.search')}
        onChangeText={setCurrentSearchString}
      />
    );
  };

  /**
   * Gets a render item for the given article
   *
   * @param item The article to render
   * @return {*}
   */
  const getRenderItem = ({ item }: { item: PlanexGroupCategoryType }) => (
    <GroupListAccordion
      item={item}
      favorites={[...favoriteGroups]}
      onGroupPress={onListItemPress}
      onFavoritePress={onListFavoritePress}
      currentSearchString={currentSearchString}
    />
  );

  /**
   * Creates the dataset to be used in the FlatList
   *
   * @param fetchedData
   * @return {*}
   * */
  const createDataset = (
    fetchedData:
      | {
          [key: string]: PlanexGroupCategoryType;
        }
      | undefined
  ): Array<{ title: string; data: Array<PlanexGroupCategoryType> }> => {
    if (fetchedData) {
      return [
        {
          title: '',
          data: generateData(fetchedData),
        },
      ];
    } else {
      return [];
    }
  };

  /**
   * Callback used when clicking an article in the list.
   * It opens the modal to show detailed information about the article
   *
   * @param item The article pressed
   */
  const onListItemPress = (item: PlanexGroupType) => {
    updatePreferences(PlanexPreferenceKeys.planexCurrentGroup, item);
    navigation.goBack();
  };

  /**
   * Callback used when the user clicks on the favorite button
   *
   * @param item The item to add/remove from favorites
   */
  const onListFavoritePress = useCallback(
    (group: PlanexGroupType) => {
      const updateFavorites = (newValue: Array<PlanexGroupType>) => {
        updatePreferences(PlanexPreferenceKeys.planexFavoriteGroups, newValue);
      };

      const removeGroupFromFavorites = (g: PlanexGroupType) => {
        updateFavorites(favoriteGroups.filter((f) => f.id !== g.id));
      };

      const addGroupToFavorites = (g: PlanexGroupType) => {
        updateFavorites([...favoriteGroups, g].sort(sortName));
      };

      if (favoriteGroups.some((f) => f.id === group.id)) {
        removeGroupFromFavorites(group);
      } else {
        addGroupToFavorites(group);
      }
    },
    [favoriteGroups, updatePreferences]
  );

  /**
   * Generates the dataset to be used in the FlatList.
   * This improves formatting of group names, sorts alphabetically the categories, and adds favorites at the top.
   *
   * @param fetchedData The raw data fetched from the server
   * @returns {[]}
   */
  const generateData = (
    fetchedData: PlanexGroupsType
  ): Array<PlanexGroupCategoryType> => {
    const data: Array<PlanexGroupCategoryType> = [];
    // Convert the object into an array
    Object.values(fetchedData).forEach((category: PlanexGroupCategoryType) => {
      const content: Array<PlanexGroupType> = [];
      // Filter groups matching the search query
      category.content.forEach((g: PlanexGroupType) => {
        if (stringMatchQuery(g.name, currentSearchString)) {
          content.push(g);
        }
      });
      // Only add categories with groups matching the query
      if (content.length > 0) {
        data.push({
          id: category.id,
          name: category.name,
          content: content,
        });
      }
    });
    data.sort(sortName);
    // Add the favorites at the top
    data.unshift({
      name: i18n.t('screens.planex.favorites.title'),
      id: 0,
      content: favoriteGroups,
    });
    return data;
  };

  return (
    <WebSectionList
      request={() => readData<PlanexGroupsType>(Urls.planex.groups)}
      createDataset={createDataset}
      refreshOnFocus={true}
      renderItem={getRenderItem}
      extraData={currentSearchString + favoriteGroups.length}
      cache={groups}
      onCacheUpdate={setGroups}
    />
  );
}

export default GroupSelectionScreen;
