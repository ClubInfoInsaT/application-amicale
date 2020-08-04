// @flow

import * as React from 'react';
import i18n from 'i18n-js';
import {List, withTheme} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import WebSectionList from '../../../components/Screens/WebSectionList';
import MaterialHeaderButtons, {
  Item,
} from '../../../components/Overrides/CustomHeaderButton';
import type {CustomTheme} from '../../../managers/ThemeManager';
import type {SectionListDataType} from '../../../components/Screens/WebSectionList';

const DATA_URL = 'https://etud.insa-toulouse.fr/~proximo/data/stock-v2.json';
const LIST_ITEM_HEIGHT = 84;

export type ProximoCategoryType = {
  name: string,
  icon: string,
  id: string,
};

export type ProximoArticleType = {
  name: string,
  description: string,
  quantity: string,
  price: string,
  code: string,
  id: string,
  type: Array<string>,
  image: string,
};

export type ProximoMainListItemType = {
  type: ProximoCategoryType,
  data: Array<ProximoArticleType>,
};

export type ProximoDataType = {
  types: Array<ProximoCategoryType>,
  articles: Array<ProximoArticleType>,
};

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomTheme,
};

/**
 * Class defining the main proximo screen.
 * This screen shows the different categories of articles offered by proximo.
 */
class ProximoMainScreen extends React.Component<PropsType> {
  /**
   * Function used to sort items in the list.
   * Makes the All category sticks to the top and sorts the others by name ascending
   *
   * @param a
   * @param b
   * @return {number}
   */
  static sortFinalData(
    a: ProximoMainListItemType,
    b: ProximoMainListItemType,
  ): number {
    const str1 = a.type.name.toLowerCase();
    const str2 = b.type.name.toLowerCase();

    // Make 'All' category with id -1 stick to the top
    if (a.type.id === -1) return -1;
    if (b.type.id === -1) return 1;

    // Sort others by name ascending
    if (str1 < str2) return -1;
    if (str1 > str2) return 1;
    return 0;
  }

  /**
   * Get an array of available articles (in stock) of the given type
   *
   * @param articles The list of all articles
   * @param type The type of articles to find (undefined for any type)
   * @return {Array} The array of available articles
   */
  static getAvailableArticles(
    articles: Array<ProximoArticleType> | null,
    type: ?ProximoCategoryType,
  ): Array<ProximoArticleType> {
    const availableArticles = [];
    if (articles != null) {
      articles.forEach((article: ProximoArticleType) => {
        if (
          ((type != null && article.type.includes(type.id)) || type == null) &&
          parseInt(article.quantity, 10) > 0
        )
          availableArticles.push(article);
      });
    }
    return availableArticles;
  }

  articles: Array<ProximoArticleType> | null;

  /**
   * Creates header button
   */
  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerRight: (): React.Node => this.getHeaderButtons(),
    });
  }

  /**
   * Callback used when the search button is pressed.
   * This will open a new ProximoListScreen with all items displayed
   */
  onPressSearchBtn = () => {
    const {navigation} = this.props;
    const searchScreenData = {
      shouldFocusSearchBar: true,
      data: {
        type: {
          id: '0',
          name: i18n.t('screens.proximo.all'),
          icon: 'star',
        },
        data:
          this.articles != null
            ? ProximoMainScreen.getAvailableArticles(this.articles)
            : [],
      },
    };
    navigation.navigate('proximo-list', searchScreenData);
  };

  /**
   * Callback used when the about button is pressed.
   * This will open the ProximoAboutScreen
   */
  onPressAboutBtn = () => {
    const {navigation} = this.props;
    navigation.navigate('proximo-about');
  };

  /**
   * Gets the header buttons
   * @return {*}
   */
  getHeaderButtons(): React.Node {
    return (
      <MaterialHeaderButtons>
        <Item
          title="magnify"
          iconName="magnify"
          onPress={this.onPressSearchBtn}
        />
        <Item
          title="information"
          iconName="information"
          onPress={this.onPressAboutBtn}
        />
      </MaterialHeaderButtons>
    );
  }

  /**
   * Extracts a key for the given category
   *
   * @param item The category to extract the key from
   * @return {*} The extracted key
   */
  getKeyExtractor = (item: ProximoMainListItemType): string => item.type.id;

  /**
   * Gets the given category render item
   *
   * @param item The category to render
   * @return {*}
   */
  getRenderItem = ({item}: {item: ProximoMainListItemType}): React.Node => {
    const {navigation, theme} = this.props;
    const dataToSend = {
      shouldFocusSearchBar: false,
      data: item,
    };
    const subtitle = `${item.data.length} ${
      item.data.length > 1
        ? i18n.t('screens.proximo.articles')
        : i18n.t('screens.proximo.article')
    }`;
    const onPress = () => {
      navigation.navigate('proximo-list', dataToSend);
    };
    if (item.data.length > 0) {
      return (
        <List.Item
          title={item.type.name}
          description={subtitle}
          onPress={onPress}
          left={({size}: {size: number}): React.Node => (
            <List.Icon
              size={size}
              icon={item.type.icon}
              color={theme.colors.primary}
            />
          )}
          right={({size, color}: {size: number, color: string}): React.Node => (
            <List.Icon size={size} color={color} icon="chevron-right" />
          )}
          style={{
            height: LIST_ITEM_HEIGHT,
            justifyContent: 'center',
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
  createDataset = (
    fetchedData: ProximoDataType | null,
  ): SectionListDataType<ProximoMainListItemType> => {
    return [
      {
        title: '',
        data: this.generateData(fetchedData),
        keyExtractor: this.getKeyExtractor,
      },
    ];
  };

  /**
   * Generate the data using types and FetchedData.
   * This will group items under the same type.
   *
   * @param fetchedData The array of articles represented by objects
   * @returns {Array} The formatted dataset
   */
  generateData(
    fetchedData: ProximoDataType | null,
  ): Array<ProximoMainListItemType> {
    const finalData: Array<ProximoMainListItemType> = [];
    this.articles = null;
    if (fetchedData != null) {
      const {types} = fetchedData;
      this.articles = fetchedData.articles;
      finalData.push({
        type: {
          id: '-1',
          name: i18n.t('screens.proximo.all'),
          icon: 'star',
        },
        data: ProximoMainScreen.getAvailableArticles(this.articles),
      });
      types.forEach((type: ProximoCategoryType) => {
        finalData.push({
          type,
          data: ProximoMainScreen.getAvailableArticles(this.articles, type),
        });
      });
    }
    finalData.sort(ProximoMainScreen.sortFinalData);
    return finalData;
  }

  render(): React.Node {
    const {navigation} = this.props;
    return (
      <WebSectionList
        createDataset={this.createDataset}
        navigation={navigation}
        autoRefreshTime={0}
        refreshOnFocus={false}
        fetchUrl={DATA_URL}
        renderItem={this.getRenderItem}
      />
    );
  }
}

export default withTheme(ProximoMainScreen);
