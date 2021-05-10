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

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Platform } from 'react-native';
import i18n from 'i18n-js';
import { Searchbar } from 'react-native-paper';
import { stringMatchQuery } from '../../utils/Search';
import WebSectionList from '../../components/Screens/WebSectionList';
import GroupListAccordion from '../../components/Lists/PlanexGroups/GroupListAccordion';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import Urls from '../../constants/Urls';
import { readData } from '../../utils/WebData';
import { useNavigation } from '@react-navigation/core';
import { useCachedPlanexGroups } from '../../utils/cacheContext';

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
  const { groups, setGroups } = useCachedPlanexGroups();
  const [currentSearchString, setCurrentSearchString] = useState('');
  const [favoriteGroups, setFavoriteGroups] = useState<Array<PlanexGroupType>>(
    AsyncStorageManager.getObject(
      AsyncStorageManager.PREFERENCES.planexFavoriteGroups.key
    )
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getSearchBar,
      headerBackTitleVisible: false,
      headerTitleContainerStyle:
        Platform.OS === 'ios'
          ? { marginHorizontal: 0, width: '70%' }
          : { marginHorizontal: 0, right: 50, left: 50 },
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
  const getRenderItem = ({ item }: { item: PlanexGroupCategoryType }) => {
    if (
      shouldDisplayAccordion(item) ||
      (item.id === 0 && item.content.length === 0)
    ) {
      return (
        <GroupListAccordion
          item={item}
          favorites={[...favoriteGroups]}
          onGroupPress={onListItemPress}
          onFavoritePress={onListFavoritePress}
          currentSearchString={currentSearchString}
        />
      );
    }
    return null;
  };

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
    return [
      {
        title: '',
        data: generateData(fetchedData),
      },
    ];
  };

  /**
   * Callback used when clicking an article in the list.
   * It opens the modal to show detailed information about the article
   *
   * @param item The article pressed
   */
  const onListItemPress = (item: PlanexGroupType) => {
    navigation.navigate('planex', {
      screen: 'index',
      params: { group: item },
    });
  };

  /**
   * Callback used when the user clicks on the favorite button
   *
   * @param item The item to add/remove from favorites
   */
  const onListFavoritePress = (item: PlanexGroupType) => {
    updateGroupFavorites(item);
  };

  /**
   * Checks if the given group is in the favorites list
   *
   * @param group The group to check
   * @returns {boolean}
   */
  const isGroupInFavorites = (group: PlanexGroupType): boolean => {
    let isFav = false;
    favoriteGroups.forEach((favGroup: PlanexGroupType) => {
      if (group.id === favGroup.id) {
        isFav = true;
      }
    });
    return isFav;
  };

  /**
   * Adds or removes the given group to the favorites list, depending on whether it is already in it or not.
   * Favorites are then saved in user preferences
   *
   * @param group The group to add/remove to favorites
   */
  const updateGroupFavorites = (group: PlanexGroupType) => {
    if (isGroupInFavorites(group)) {
      removeGroupFromFavorites(group);
    } else {
      addGroupToFavorites(group);
    }
  };

  /**
   * Checks whether to display the given group category, depending on user search query
   *
   * @param item The group category
   * @returns {boolean}
   */
  const shouldDisplayAccordion = (item: PlanexGroupCategoryType): boolean => {
    let shouldDisplay = false;
    for (let i = 0; i < item.content.length; i += 1) {
      if (stringMatchQuery(item.content[i].name, currentSearchString)) {
        shouldDisplay = true;
        break;
      }
    }
    return shouldDisplay;
  };

  /**
   * Generates the dataset to be used in the FlatList.
   * This improves formatting of group names, sorts alphabetically the categories, and adds favorites at the top.
   *
   * @param fetchedData The raw data fetched from the server
   * @returns {[]}
   */
  const generateData = (
    fetchedData: PlanexGroupsType | undefined
  ): Array<PlanexGroupCategoryType> => {
    const data: Array<PlanexGroupCategoryType> = [];
    if (fetchedData) {
      Object.values(fetchedData).forEach(
        (category: PlanexGroupCategoryType) => {
          data.push(category);
        }
      );
      data.sort(sortName);
      data.unshift({
        name: i18n.t('screens.planex.favorites'),
        id: 0,
        content: favoriteGroups,
      });
    }
    return data;
  };

  /**
   * Removes the given group from the favorites
   *
   * @param group The group to remove from the array
   */
  const removeGroupFromFavorites = (group: PlanexGroupType) => {
    setFavoriteGroups(favoriteGroups.filter((g) => g.id !== group.id));
  };

  useEffect(() => {
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.planexFavoriteGroups.key,
      favoriteGroups
    );
  }, [favoriteGroups]);

  /**
   * Adds the given group to favorites
   *
   * @param group The group to add to the array
   */
  const addGroupToFavorites = (group: PlanexGroupType) => {
    setFavoriteGroups([...favoriteGroups, group].sort(sortName));
  };

  return (
    <WebSectionList
      request={() => readData<PlanexGroupsType>(Urls.planex.groups)}
      createDataset={createDataset}
      refreshOnFocus={true}
      renderItem={getRenderItem}
      updateData={currentSearchString + favoriteGroups.length}
      cache={groups}
      onCacheUpdate={setGroups}
    />
  );
}

export default GroupSelectionScreen;
