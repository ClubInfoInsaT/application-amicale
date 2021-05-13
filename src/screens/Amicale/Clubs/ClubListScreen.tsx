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
import { Platform } from 'react-native';
import { Searchbar } from 'react-native-paper';
import i18n from 'i18n-js';
import { StackNavigationProp } from '@react-navigation/stack';
import ClubListItem from '../../../components/Lists/Clubs/ClubListItem';
import {
  isItemInCategoryFilter,
  stringMatchQuery,
} from '../../../utils/Search';
import ClubListHeader from '../../../components/Lists/Clubs/ClubListHeader';
import MaterialHeaderButtons, {
  Item,
} from '../../../components/Overrides/CustomHeaderButton';
import ConnectionManager from '../../../managers/ConnectionManager';
import WebSectionList from '../../../components/Screens/WebSectionList';

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

type PropsType = {
  navigation: StackNavigationProp<any>;
};

type StateType = {
  currentlySelectedCategories: Array<number>;
  currentSearchString: string;
};

type ResponseType = {
  categories: Array<ClubCategoryType>;
  clubs: Array<ClubType>;
};

const LIST_ITEM_HEIGHT = 96;

class ClubListScreen extends React.Component<PropsType, StateType> {
  categories: Array<ClubCategoryType>;

  constructor(props: PropsType) {
    super(props);
    this.categories = [];
    this.state = {
      currentlySelectedCategories: [],
      currentSearchString: '',
    };
  }

  /**
   * Creates the header content
   */
  componentDidMount() {
    const { props } = this;
    props.navigation.setOptions({
      headerTitle: this.getSearchBar,
      headerRight: this.getHeaderButtons,
      headerBackTitleVisible: false,
      headerTitleContainerStyle:
        Platform.OS === 'ios'
          ? { marginHorizontal: 0, width: '70%' }
          : { marginHorizontal: 0, right: 50, left: 50 },
    });
  }

  /**
   * Callback used when clicking an article in the list.
   * It opens the modal to show detailed information about the article
   *
   * @param item The article pressed
   */
  onListItemPress(item: ClubType) {
    const { props } = this;
    props.navigation.navigate('club-information', {
      data: item,
      categories: this.categories,
    });
  }

  /**
   * Callback used when the search changes
   *
   * @param str The new search string
   */
  onSearchStringChange = (str: string) => {
    this.updateFilteredData(str, null);
  };

  /**
   * Gets the header search bar
   *
   * @return {*}
   */
  getSearchBar = () => {
    return (
      // @ts-ignore
      <Searchbar
        placeholder={i18n.t('screens.proximo.search')}
        onChangeText={this.onSearchStringChange}
      />
    );
  };

  onChipSelect = (id: number) => {
    this.updateFilteredData(null, id);
  };

  /**
   * Gets the header button
   * @return {*}
   */
  getHeaderButtons = () => {
    const onPress = () => {
      const { props } = this;
      props.navigation.navigate('club-about');
    };
    return (
      <MaterialHeaderButtons>
        <Item title="main" iconName="information" onPress={onPress} />
      </MaterialHeaderButtons>
    );
  };

  createDataset = (data: ResponseType | undefined) => {
    if (data) {
      this.categories = data?.categories;
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
  getListHeader(data: ResponseType | undefined) {
    const { state } = this;
    if (data) {
      return (
        <ClubListHeader
          categories={this.categories}
          selectedCategories={state.currentlySelectedCategories}
          onChipSelect={this.onChipSelect}
        />
      );
    } else {
      return null;
    }
  }

  /**
   * Gets the category object of the given ID
   *
   * @param id The ID of the category to find
   * @returns {*}
   */
  getCategoryOfId = (id: number): ClubCategoryType | null => {
    let cat = null;
    this.categories.forEach((item: ClubCategoryType) => {
      if (id === item.id) {
        cat = item;
      }
    });
    return cat;
  };

  getRenderItem = ({ item }: { item: ClubType }) => {
    const onPress = () => {
      this.onListItemPress(item);
    };
    if (this.shouldRenderItem(item)) {
      return (
        <ClubListItem
          categoryTranslator={this.getCategoryOfId}
          item={item}
          onPress={onPress}
          height={LIST_ITEM_HEIGHT}
        />
      );
    }
    return null;
  };

  keyExtractor = (item: ClubType): string => item.id.toString();

  /**
   * Updates the search string and category filter, saving them to the State.
   *
   * If the given category is already in the filter, it removes it.
   * Otherwise it adds it to the filter.
   *
   * @param filterStr The new filter string to use
   * @param categoryId The category to add/remove from the filter
   */
  updateFilteredData(filterStr: string | null, categoryId: number | null) {
    const { state } = this;
    const newCategoriesState = [...state.currentlySelectedCategories];
    let newStrState = state.currentSearchString;
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
      this.setState({
        currentSearchString: newStrState,
        currentlySelectedCategories: newCategoriesState,
      });
    }
  }

  /**
   * Checks if the given item should be rendered according to current name and category filters
   *
   * @param item The club to check
   * @returns {boolean}
   */
  shouldRenderItem(item: ClubType): boolean {
    const { state } = this;
    let shouldRender =
      state.currentlySelectedCategories.length === 0 ||
      isItemInCategoryFilter(state.currentlySelectedCategories, item.category);
    if (shouldRender) {
      shouldRender = stringMatchQuery(item.name, state.currentSearchString);
    }
    return shouldRender;
  }

  render() {
    return (
      <WebSectionList
        request={() =>
          ConnectionManager.getInstance().authenticatedRequest<ResponseType>(
            'clubs/list'
          )
        }
        createDataset={this.createDataset}
        keyExtractor={this.keyExtractor}
        renderItem={this.getRenderItem}
        renderListHeaderComponent={(data) => this.getListHeader(data)}
        // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
        removeClippedSubviews={true}
        itemHeight={LIST_ITEM_HEIGHT}
      />
    );
  }
}

export default ClubListScreen;
