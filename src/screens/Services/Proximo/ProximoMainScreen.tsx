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
import i18n from 'i18n-js';
import { Avatar, List, useTheme, withTheme } from 'react-native-paper';
import WebSectionList from '../../../components/Screens/WebSectionList';
import MaterialHeaderButtons, {
  Item,
} from '../../../components/Overrides/CustomHeaderButton';
import type { SectionListDataType } from '../../../components/Screens/WebSectionList';
import { StyleSheet } from 'react-native';
import Urls from '../../../constants/Urls';
import { readData } from '../../../utils/WebData';
import { useNavigation } from '@react-navigation/core';
import { useLayoutEffect } from 'react';
import { useCachedProximoCategories } from '../../../utils/cacheContext';

const LIST_ITEM_HEIGHT = 84;

export type ProximoCategoryType = {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
};

export type ProximoArticleType = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  code: string;
  image: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  category: ProximoCategoryType;
};

export type CategoriesType = Array<ProximoCategoryType>;

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
  },
});

function sortFinalData(a: ProximoCategoryType, b: ProximoCategoryType): number {
  const str1 = a.name.toLowerCase();
  const str2 = b.name.toLowerCase();

  // Make 'All' category with id -1 stick to the top
  if (a.id === -1) {
    return -1;
  }
  if (b.id === -1) {
    return 1;
  }

  // Sort others by name ascending
  if (str1 < str2) {
    return -1;
  }
  if (str1 > str2) {
    return 1;
  }
  return 0;
}

/**
 * Class defining the main proximo screen.
 * This screen shows the different categories of articles offered by proximo.
 */
function ProximoMainScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { categories, setCategories } = useCachedProximoCategories();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => getHeaderButtons(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  /**
   * Callback used when the search button is pressed.
   * This will open a new ProximoListScreen with all items displayed
   */
  const onPressSearchBtn = () => {
    const searchScreenData = {
      shouldFocusSearchBar: true,
      category: -1,
    };
    navigation.navigate('proximo-list', searchScreenData);
  };

  const onPressAboutBtn = () => navigation.navigate('proximo-about');

  const getHeaderButtons = () => {
    return (
      <MaterialHeaderButtons>
        <Item title="magnify" iconName="magnify" onPress={onPressSearchBtn} />
        <Item
          title="information"
          iconName="information"
          onPress={onPressAboutBtn}
        />
      </MaterialHeaderButtons>
    );
  };

  /**
   * Extracts a key for the given category
   *
   * @param item The category to extract the key from
   * @return {*} The extracted key
   */
  const getKeyExtractor = (item: ProximoCategoryType): string =>
    item.id.toString();

  /**
   * Gets the given category render item
   *
   * @param item The category to render
   * @return {*}
   */
  const getRenderItem = ({ item }: { item: ProximoCategoryType }) => {
    const dataToSend = {
      shouldFocusSearchBar: false,
      category: item.id,
    };
    // TODO get article number
    const article_number = 1;
    const subtitle = `${article_number} ${
      article_number > 1
        ? i18n.t('screens.proximo.articles')
        : i18n.t('screens.proximo.article')
    }`;
    const onPress = () => navigation.navigate('proximo-list', dataToSend);
    if (article_number > 0) {
      return (
        <List.Item
          title={item.name}
          description={subtitle}
          onPress={onPress}
          left={(props) =>
            item.icon.endsWith('.png') ? (
              <Avatar.Image style={props.style} source={{ uri: item.icon }} />
            ) : (
              <List.Icon
                style={props.style}
                icon={item.icon}
                color={theme.colors.primary}
              />
            )
          }
          right={(props) => (
            <List.Icon
              color={props.color}
              style={props.style}
              icon="chevron-right"
            />
          )}
          style={{
            height: LIST_ITEM_HEIGHT,
            ...styles.item,
          }}
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
    data: CategoriesType | undefined
  ): SectionListDataType<ProximoCategoryType> => {
    if (data) {
      const finalData: CategoriesType = [
        {
          id: -1,
          name: i18n.t('screens.proximo.all'),
          icon: 'star',
          created_at: '',
          updated_at: '',
        },
        ...data,
      ];
      return [
        {
          title: '',
          data: finalData.sort(sortFinalData),
          keyExtractor: getKeyExtractor,
        },
      ];
    } else {
      return [
        {
          title: '',
          data: [],
          keyExtractor: getKeyExtractor,
        },
      ];
    }
  };

  return (
    <WebSectionList
      request={() => readData<CategoriesType>(Urls.proximo.categories)}
      createDataset={createDataset}
      refreshOnFocus={true}
      renderItem={getRenderItem}
      cache={categories}
      onCacheUpdate={setCategories}
    />
  );
}

export default withTheme(ProximoMainScreen);
