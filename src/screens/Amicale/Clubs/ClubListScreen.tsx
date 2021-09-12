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

import React, { useLayoutEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Searchbar } from 'react-native-paper';
import i18n from 'i18n-js';
import ClubListItem from '../../../components/Lists/Clubs/ClubListItem';
import {
  isItemInCategoryFilter,
  stringMatchQuery,
} from '../../../utils/Search';
import ClubListHeader from '../../../components/Lists/Clubs/ClubListHeader';
import MaterialHeaderButtons, {
  Item,
} from '../../../components/Overrides/CustomHeaderButton';
import WebSectionList from '../../../components/Screens/WebSectionList';
import { useNavigation } from '@react-navigation/native';
import { useAuthenticatedRequest } from '../../../context/loginContext';
import { MainRoutes } from '../../../navigation/MainNavigator';

export type ClubCategoryType = {
  id: number;
  name: string;
};

export type ClubType = {
  id: number;
  name: string;
  description: string;
  logo: string;
  email: string | null;
  category: Array<number | null>;
  responsibles: Array<string>;
};

type ResponseType = {
  categories: Array<ClubCategoryType>;
  clubs: Array<ClubType>;
};

const LIST_ITEM_HEIGHT = 96;

function ClubListScreen() {
  const navigation = useNavigation();
  const request = useAuthenticatedRequest<ResponseType>('clubs/list');
  const [currentlySelectedCategories, setCurrentlySelectedCategories] =
    useState<Array<number>>([]);
  const [currentSearchString, setCurrentSearchString] = useState('');
  const categories = useRef<Array<ClubCategoryType>>([]);

  useLayoutEffect(() => {
    const getSearchBar = () => {
      return (
        // @ts-ignore
        <Searchbar
          placeholder={i18n.t('screens.proximo.search')}
          onChangeText={onSearchStringChange}
        />
      );
    };
    const getHeaderButtons = () => {
      return (
        <MaterialHeaderButtons>
          <Item
            title="main"
            iconName="information"
            onPress={() => navigation.navigate(MainRoutes.ClubAbout)}
          />
        </MaterialHeaderButtons>
      );
    };
    navigation.setOptions({
      headerTitle: getSearchBar,
      headerRight: getHeaderButtons,
      headerBackTitleVisible: false,
      headerTitleContainerStyle:
        Platform.OS === 'ios'
          ? { marginHorizontal: 0, width: '70%' }
          : { marginHorizontal: 0, right: 50, left: 50 },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const onSearchStringChange = (str: string) => {
    updateFilteredData(str, null);
  };

  /**
   * Callback used when clicking an article in the list.
   * It opens the modal to show detailed information about the article
   *
   * @param item The article pressed
   */
  const onListItemPress = (item: ClubType) => {
    navigation.navigate(MainRoutes.ClubInformation, {
      type: 'full',
      data: item,
      categories: categories.current,
    });
  };

  const onChipSelect = (id: number) => {
    updateFilteredData(null, id);
  };

  const createDataset = (data: ResponseType | undefined) => {
    if (data) {
      categories.current = data.categories;
      return [{ title: '', data: data.clubs }];
    } else {
      return [];
    }
  };

  /**
   * Gets the list header, with controls to change the categories filter
   *
   * @returns {*}
   */
  const getListHeader = (data: ResponseType | undefined) => {
    if (data) {
      return (
        <ClubListHeader
          categories={categories.current}
          selectedCategories={currentlySelectedCategories}
          onChipSelect={onChipSelect}
        />
      );
    } else {
      return null;
    }
  };

  const getCategoryOfId = (id: number): ClubCategoryType | null => {
    let cat = null;
    categories.current.forEach((item: ClubCategoryType) => {
      if (id === item.id) {
        cat = item;
      }
    });
    return cat;
  };

  const getRenderItem = ({ item }: { item: ClubType }) => {
    const onPress = () => {
      onListItemPress(item);
    };
    if (shouldRenderItem(item)) {
      return (
        <ClubListItem
          categoryTranslator={getCategoryOfId}
          item={item}
          onPress={onPress}
          height={LIST_ITEM_HEIGHT}
        />
      );
    }
    return null;
  };

  const keyExtractor = (item: ClubType): string => item.id.toString();

  /**
   * Updates the search string and category filter, saving them to the State.
   *
   * If the given category is already in the filter, it removes it.
   * Otherwise it adds it to the filter.
   *
   * @param filterStr The new filter string to use
   * @param categoryId The category to add/remove from the filter
   */
  const updateFilteredData = (
    filterStr: string | null,
    categoryId: number | null
  ) => {
    const newCategoriesState = [...currentlySelectedCategories];
    let newStrState = currentSearchString;
    if (filterStr !== null) {
      newStrState = filterStr;
    }
    if (categoryId !== null) {
      const index = newCategoriesState.indexOf(categoryId);
      if (index === -1) {
        newCategoriesState.push(categoryId);
      } else {
        newCategoriesState.splice(index, 1);
      }
    }
    if (filterStr !== null || categoryId !== null) {
      setCurrentSearchString(newStrState);
      setCurrentlySelectedCategories(newCategoriesState);
    }
  };

  /**
   * Checks if the given item should be rendered according to current name and category filters
   *
   * @param item The club to check
   * @returns {boolean}
   */
  const shouldRenderItem = (item: ClubType): boolean => {
    let shouldRender =
      currentlySelectedCategories.length === 0 ||
      isItemInCategoryFilter(currentlySelectedCategories, item.category);
    if (shouldRender) {
      shouldRender = stringMatchQuery(item.name, currentSearchString);
    }
    return shouldRender;
  };

  return (
    <WebSectionList
      request={request}
      createDataset={createDataset}
      keyExtractor={keyExtractor}
      renderItem={getRenderItem}
      renderListHeaderComponent={getListHeader}
      // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
      removeClippedSubviews={true}
      itemHeight={LIST_ITEM_HEIGHT}
    />
  );
}

export default ClubListScreen;
