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
import { Image, Platform, ScrollView, StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import {
  RadioButton,
  Searchbar,
  Subheading,
  Text,
  Title,
  withTheme,
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import CustomModal from '../../../components/Overrides/CustomModal';
import { stringMatchQuery } from '../../../utils/Search';
import ProximoListItem from '../../../components/Lists/Proximo/ProximoListItem';
import MaterialHeaderButtons, {
  Item,
} from '../../../components/Overrides/CustomHeaderButton';
import CollapsibleFlatList from '../../../components/Collapsible/CollapsibleFlatList';
import type { ProximoArticleType } from './ProximoMainScreen';
import GENERAL_STYLES from '../../../constants/Styles';

function sortPrice(a: ProximoArticleType, b: ProximoArticleType): number {
  return parseInt(a.price, 10) - parseInt(b.price, 10);
}

function sortPriceReverse(
  a: ProximoArticleType,
  b: ProximoArticleType
): number {
  return parseInt(b.price, 10) - parseInt(a.price, 10);
}

function sortName(a: ProximoArticleType, b: ProximoArticleType): number {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  }
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }
  return 0;
}

function sortNameReverse(a: ProximoArticleType, b: ProximoArticleType): number {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return 1;
  }
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return -1;
  }
  return 0;
}

const LIST_ITEM_HEIGHT = 84;

type PropsType = {
  navigation: StackNavigationProp<any>;
  route: {
    params: {
      data: { data: Array<ProximoArticleType> };
      shouldFocusSearchBar: boolean;
    };
  };
  theme: ReactNativePaper.Theme;
};

type StateType = {
  currentSortMode: number;
  modalCurrentDisplayItem: React.ReactNode;
  currentSearchString: string;
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  modalTitle: {
    marginLeft: 'auto',
  },
  modalContent: {
    width: '100%',
    height: 150,
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  sortTitle: {
    marginBottom: 10,
  },
});

/**
 * Class defining Proximo article list of a certain category.
 */
class ProximoListScreen extends React.Component<PropsType, StateType> {
  modalRef: Modalize | null;

  listData: Array<ProximoArticleType>;

  shouldFocusSearchBar: boolean;

  constructor(props: PropsType) {
    super(props);
    this.modalRef = null;
    this.listData = props.route.params.data.data.sort(sortName);
    this.shouldFocusSearchBar = props.route.params.shouldFocusSearchBar;
    this.state = {
      currentSearchString: '',
      currentSortMode: 3,
      modalCurrentDisplayItem: null,
    };
  }

  /**
   * Creates the header content
   */
  componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions({
      headerRight: this.getSortMenuButton,
      headerTitle: this.getSearchBar,
      headerBackTitleVisible: false,
      headerTitleContainerStyle:
        Platform.OS === 'ios'
          ? { marginHorizontal: 0, width: '70%' }
          : { marginHorizontal: 0, right: 50, left: 50 },
    });
  }

  /**
   * Callback used when clicking on the sort menu button.
   * It will open the modal to show a sort selection
   */
  onSortMenuPress = () => {
    this.setState({
      modalCurrentDisplayItem: this.getModalSortMenu(),
    });
    if (this.modalRef) {
      this.modalRef.open();
    }
  };

  /**
   * Callback used when the search changes
   *
   * @param str The new search string
   */
  onSearchStringChange = (str: string) => {
    this.setState({ currentSearchString: str });
  };

  /**
   * Callback used when clicking an article in the list.
   * It opens the modal to show detailed information about the article
   *
   * @param item The article pressed
   */
  onListItemPress(item: ProximoArticleType) {
    this.setState({
      modalCurrentDisplayItem: this.getModalItemContent(item),
    });
    if (this.modalRef) {
      this.modalRef.open();
    }
  }

  /**
   * Sets the current sort mode.
   *
   * @param mode The number representing the mode
   */
  setSortMode(mode: string) {
    const { currentSortMode } = this.state;
    const currentMode = parseInt(mode, 10);
    this.setState({
      currentSortMode: currentMode,
    });
    switch (currentMode) {
      case 1:
        this.listData.sort(sortPrice);
        break;
      case 2:
        this.listData.sort(sortPriceReverse);
        break;
      case 3:
        this.listData.sort(sortName);
        break;
      case 4:
        this.listData.sort(sortNameReverse);
        break;
      default:
        this.listData.sort(sortName);
        break;
    }
    if (this.modalRef && currentMode !== currentSortMode) {
      this.modalRef.close();
    }
  }

  /**
   * Gets a color depending on the quantity available
   *
   * @param availableStock The quantity available
   * @return
   */
  getStockColor(availableStock: number): string {
    const { theme } = this.props;
    let color: string;
    if (availableStock > 3) {
      color = theme.colors.success;
    } else if (availableStock > 0) {
      color = theme.colors.warning;
    } else {
      color = theme.colors.danger;
    }
    return color;
  }

  /**
   * Gets the sort menu header button
   *
   * @return {*}
   */
  getSortMenuButton = () => {
    return (
      <MaterialHeaderButtons>
        <Item title="main" iconName="sort" onPress={this.onSortMenuPress} />
      </MaterialHeaderButtons>
    );
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

  /**
   * Gets the modal content depending on the given article
   *
   * @param item The article to display
   * @return {*}
   */
  getModalItemContent(item: ProximoArticleType) {
    return (
      <View style={styles.modalContainer}>
        <Title>{item.name}</Title>
        <View style={styles.modalTitleContainer}>
          <Subheading
            style={{
              color: this.getStockColor(parseInt(item.quantity, 10)),
            }}
          >
            {`${item.quantity} ${i18n.t('screens.proximo.inStock')}`}
          </Subheading>
          <Subheading style={styles.modalTitle}>{item.price}€</Subheading>
        </View>

        <ScrollView>
          <View style={styles.modalContent}>
            <Image style={styles.image} source={{ uri: item.image }} />
          </View>
          <Text>{item.description}</Text>
        </ScrollView>
      </View>
    );
  }

  /**
   * Gets the modal content to display a sort menu
   *
   * @return {*}
   */
  getModalSortMenu() {
    const { currentSortMode } = this.state;
    return (
      <View style={styles.modalContainer}>
        <Title style={styles.sortTitle}>
          {i18n.t('screens.proximo.sortOrder')}
        </Title>
        <RadioButton.Group
          onValueChange={(value: string) => {
            this.setSortMode(value);
          }}
          value={currentSortMode.toString()}
        >
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortPrice')}
            value={'1'}
          />
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortPriceReverse')}
            value={'2'}
          />
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortName')}
            value={'3'}
          />
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortNameReverse')}
            value={'4'}
          />
        </RadioButton.Group>
      </View>
    );
  }

  /**
   * Gets a render item for the given article
   *
   * @param item The article to render
   * @return {*}
   */
  getRenderItem = ({ item }: { item: ProximoArticleType }) => {
    const { currentSearchString } = this.state;
    if (stringMatchQuery(item.name, currentSearchString)) {
      const onPress = () => {
        this.onListItemPress(item);
      };
      const color = this.getStockColor(parseInt(item.quantity, 10));
      return (
        <ProximoListItem
          item={item}
          onPress={onPress}
          color={color}
          height={LIST_ITEM_HEIGHT}
        />
      );
    }
    return null;
  };

  /**
   * Extracts a key for the given article
   *
   * @param item The article to extract the key from
   * @return {string} The extracted key
   */
  keyExtractor = (item: ProximoArticleType): string => item.name + item.code;

  /**
   * Callback used when receiving the modal ref
   *
   * @param ref
   */
  onModalRef = (ref: Modalize) => {
    this.modalRef = ref;
  };

  itemLayout = (
    data: Array<ProximoArticleType> | null | undefined,
    index: number
  ): { length: number; offset: number; index: number } => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT * index,
    index,
  });

  render() {
    const { state } = this;
    return (
      <View style={GENERAL_STYLES.flex}>
        <CustomModal onRef={this.onModalRef}>
          {state.modalCurrentDisplayItem}
        </CustomModal>
        <CollapsibleFlatList
          data={this.listData}
          extraData={state.currentSearchString + state.currentSortMode}
          keyExtractor={this.keyExtractor}
          renderItem={this.getRenderItem}
          // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
          removeClippedSubviews
          getItemLayout={this.itemLayout}
          initialNumToRender={10}
        />
      </View>
    );
  }
}

export default withTheme(ProximoListScreen);
