// @flow

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
  name: string,
  id: number,
  isFav: boolean,
};

export type PlanexGroupCategoryType = {
  name: string,
  id: number,
  content: Array<PlanexGroupType>,
};

type PropsType = {
  navigation: StackNavigationProp,
};

type StateType = {
  currentSearchString: string,
  favoriteGroups: Array<PlanexGroupType>,
};

function sortName(
  a: PlanexGroupType | PlanexGroupCategoryType,
  b: PlanexGroupType | PlanexGroupCategoryType,
): number {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
}

const GROUPS_URL = 'http://planex.insa-toulouse.fr/wsAdeGrp.php?projectId=1';
const REPLACE_REGEX = /_/g;

/**
 * Class defining planex group selection screen.
 */
class GroupSelectionScreen extends React.Component<PropsType, StateType> {
  /**
   * Removes the given group from the given array
   *
   * @param favorites The array containing favorites groups
   * @param group The group to remove from the array
   */
  static removeGroupFromFavorites(
    favorites: Array<PlanexGroupType>,
    group: PlanexGroupType,
  ) {
    for (let i = 0; i < favorites.length; i += 1) {
      if (group.id === favorites[i].id) {
        favorites.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Adds the given group to the given array
   *
   * @param favorites The array containing favorites groups
   * @param group The group to add to the array
   */
  static addGroupToFavorites(
    favorites: Array<PlanexGroupType>,
    group: PlanexGroupType,
  ) {
    const favGroup = {...group};
    favGroup.isFav = true;
    favorites.push(favGroup);
    favorites.sort(sortName);
  }

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
    const [navigation] = this.props;
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
  getSearchBar = (): React.Node => {
    return (
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
  getRenderItem = ({item}: {item: PlanexGroupCategoryType}): React.Node => {
    const {currentSearchString, favoriteGroups} = this.state;
    if (this.shouldDisplayAccordion(item)) {
      return (
        <GroupListAccordion
          item={item}
          onGroupPress={this.onListItemPress}
          onFavoritePress={this.onListFavoritePress}
          currentSearchString={currentSearchString}
          favoriteNumber={favoriteGroups.length}
          height={LIST_ITEM_HEIGHT}
        />
      );
    }
    return null;
  };

  /**
   * Replaces underscore by spaces and sets the favorite state of every group in the given category
   *
   * @param groups The groups to format
   * @return {Array<PlanexGroupType>}
   */
  getFormattedGroups(groups: Array<PlanexGroupType>): Array<PlanexGroupType> {
    return groups.map((group: PlanexGroupType): PlanexGroupType => {
      const newGroup = {...group};
      newGroup.name = group.name.replace(REPLACE_REGEX, ' ');
      newGroup.isFav = this.isGroupInFavorites(group);
      return newGroup;
    });
  }

  /**
   * Creates the dataset to be used in the FlatList
   *
   * @param fetchedData
   * @return {*}
   * */
  createDataset = (fetchedData: {
    [key: string]: PlanexGroupCategoryType,
  }): Array<{title: string, data: Array<PlanexGroupCategoryType>}> => {
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
      if (group.id === favGroup.id) isFav = true;
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
    const {favoriteGroups} = this.state;
    const newFavorites = [...favoriteGroups];
    if (this.isGroupInFavorites(group))
      GroupSelectionScreen.removeGroupFromFavorites(newFavorites, group);
    else GroupSelectionScreen.addGroupToFavorites(newFavorites, group);
    this.setState({favoriteGroups: newFavorites});
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.planexFavoriteGroups.key,
      newFavorites,
    );
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
    [key: string]: PlanexGroupCategoryType,
  }): Array<PlanexGroupCategoryType> {
    const {favoriteGroups} = this.state;
    const data = [];
    // eslint-disable-next-line flowtype/no-weak-types
    (Object.values(fetchedData): Array<any>).forEach(
      (category: PlanexGroupCategoryType) => {
        const newCat = {...category};
        newCat.content = this.getFormattedGroups(category.content);
        data.push(newCat);
      },
    );
    data.sort(sortName);
    data.unshift({
      name: i18n.t('screens.planex.favorites'),
      id: 0,
      content: favoriteGroups,
    });
    return data;
  }

  render(): React.Node {
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
