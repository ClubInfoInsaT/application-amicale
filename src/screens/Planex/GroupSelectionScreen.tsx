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
import {Platform} from 'react-native';
import i18n from 'i18n-js';
import {Searchbar} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {stringMatchQuery} from '../../utils/Search';
import WebSectionList from '../../components/Screens/WebSectionList';
import GroupListAccordion from '../../components/Lists/PlanexGroups/GroupListAccordion';
import AsyncStorageManager from '../../managers/AsyncStorageManager';

const LIST_ITEM_HEIGHT = 70;

export type PlanexGroupType = {
  name: string;
  id: number;
};

export type PlanexGroupCategoryType = {
  name: string;
  id: number;
  content: Array<PlanexGroupType>;
};

type PropsType = {
  navigation: StackNavigationProp<any>;
};

type StateType = {
  currentSearchString: string;
  favoriteGroups: Array<PlanexGroupType>;
};

function sortName(
  a: PlanexGroupType | PlanexGroupCategoryType,
  b: PlanexGroupType | PlanexGroupCategoryType,
): number {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  }
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }
  return 0;
}

const GROUPS_URL = 'http://planex.insa-toulouse.fr/wsAdeGrp.php?projectId=1';

/**
 * Class defining planex group selection screen.
 */
class GroupSelectionScreen extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      currentSearchString: '',
      favoriteGroups: AsyncStorageManager.getObject(
        AsyncStorageManager.PREFERENCES.planexFavoriteGroups.key,
      ),
    };
  }

  /**
   * Creates the header content
   */
  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerTitle: this.getSearchBar,
      headerBackTitleVisible: false,
      headerTitleContainerStyle:
        Platform.OS === 'ios'
          ? {marginHorizontal: 0, width: '70%'}
          : {marginHorizontal: 0, right: 50, left: 50},
    });
  }

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

  /**
   * Gets a render item for the given article
   *
   * @param item The article to render
   * @return {*}
   */
  getRenderItem = ({item}: {item: PlanexGroupCategoryType}) => {
    const {currentSearchString, favoriteGroups} = this.state;
    if (
      this.shouldDisplayAccordion(item) ||
      (item.id === 0 && item.content.length === 0)
    ) {
      return (
        <GroupListAccordion
          item={item}
          favorites={[...favoriteGroups]}
          onGroupPress={this.onListItemPress}
          onFavoritePress={this.onListFavoritePress}
          currentSearchString={currentSearchString}
          height={LIST_ITEM_HEIGHT}
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
  createDataset = (fetchedData: {
    [key: string]: PlanexGroupCategoryType;
  }): Array<{title: string; data: Array<PlanexGroupCategoryType>}> => {
    return [
      {
        title: '',
        data: this.generateData(fetchedData),
      },
    ];
  };

  /**
   * Callback used when the search changes
   *
   * @param str The new search string
   */
  onSearchStringChange = (str: string) => {
    this.setState({currentSearchString: str});
  };

  /**
   * Callback used when clicking an article in the list.
   * It opens the modal to show detailed information about the article
   *
   * @param item The article pressed
   */
  onListItemPress = (item: PlanexGroupType) => {
    const {navigation} = this.props;
    navigation.navigate('planex', {
      screen: 'index',
      params: {group: item},
    });
  };

  /**
   * Callback used when the user clicks on the favorite button
   *
   * @param item The item to add/remove from favorites
   */
  onListFavoritePress = (item: PlanexGroupType) => {
    this.updateGroupFavorites(item);
  };

  /**
   * Checks if the given group is in the favorites list
   *
   * @param group The group to check
   * @returns {boolean}
   */
  isGroupInFavorites(group: PlanexGroupType): boolean {
    let isFav = false;
    const {favoriteGroups} = this.state;
    favoriteGroups.forEach((favGroup: PlanexGroupType) => {
      if (group.id === favGroup.id) {
        isFav = true;
      }
    });
    return isFav;
  }

  /**
   * Adds or removes the given group to the favorites list, depending on whether it is already in it or not.
   * Favorites are then saved in user preferences
   *
   * @param group The group to add/remove to favorites
   */
  updateGroupFavorites(group: PlanexGroupType) {
    if (this.isGroupInFavorites(group)) {
      this.removeGroupFromFavorites(group);
    } else {
      this.addGroupToFavorites(group);
    }
  }

  /**
   * Checks whether to display the given group category, depending on user search query
   *
   * @param item The group category
   * @returns {boolean}
   */
  shouldDisplayAccordion(item: PlanexGroupCategoryType): boolean {
    const {currentSearchString} = this.state;
    let shouldDisplay = false;
    for (let i = 0; i < item.content.length; i += 1) {
      if (stringMatchQuery(item.content[i].name, currentSearchString)) {
        shouldDisplay = true;
        break;
      }
    }
    return shouldDisplay;
  }

  /**
   * Generates the dataset to be used in the FlatList.
   * This improves formatting of group names, sorts alphabetically the categories, and adds favorites at the top.
   *
   * @param fetchedData The raw data fetched from the server
   * @returns {[]}
   */
  generateData(fetchedData: {
    [key: string]: PlanexGroupCategoryType;
  }): Array<PlanexGroupCategoryType> {
    const {favoriteGroups} = this.state;
    const data: Array<PlanexGroupCategoryType> = [];
    Object.values(fetchedData).forEach((category: PlanexGroupCategoryType) => {
      data.push(category);
    });
    data.sort(sortName);
    data.unshift({
      name: i18n.t('screens.planex.favorites'),
      id: 0,
      content: favoriteGroups,
    });
    return data;
  }

  /**
   * Removes the given group from the favorites
   *
   * @param group The group to remove from the array
   */
  removeGroupFromFavorites(group: PlanexGroupType) {
    this.setState((prevState: StateType): {
      favoriteGroups: Array<PlanexGroupType>;
    } => {
      const {favoriteGroups} = prevState;
      for (let i = 0; i < favoriteGroups.length; i += 1) {
        if (group.id === favoriteGroups[i].id) {
          favoriteGroups.splice(i, 1);
          break;
        }
      }
      AsyncStorageManager.set(
        AsyncStorageManager.PREFERENCES.planexFavoriteGroups.key,
        favoriteGroups,
      );
      return {favoriteGroups};
    });
  }

  /**
   * Adds the given group to favorites
   *
   * @param group The group to add to the array
   */
  addGroupToFavorites(group: PlanexGroupType) {
    this.setState((prevState: StateType): {
      favoriteGroups: Array<PlanexGroupType>;
    } => {
      const {favoriteGroups} = prevState;
      favoriteGroups.push(group);
      favoriteGroups.sort(sortName);
      AsyncStorageManager.set(
        AsyncStorageManager.PREFERENCES.planexFavoriteGroups.key,
        favoriteGroups,
      );
      return {favoriteGroups};
    });
  }

  render() {
    const {props, state} = this;
    return (
      <WebSectionList
        navigation={props.navigation}
        createDataset={this.createDataset}
        autoRefreshTime={0}
        refreshOnFocus={false}
        fetchUrl={GROUPS_URL}
        renderItem={this.getRenderItem}
        updateData={state.currentSearchString + state.favoriteGroups.length}
        itemHeight={LIST_ITEM_HEIGHT}
      />
    );
  }
}

export default GroupSelectionScreen;
