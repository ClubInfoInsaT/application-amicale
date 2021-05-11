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
import { Image, Platform, ScrollView, StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import {
  RadioButton,
  Searchbar,
  Subheading,
  Text,
  Title,
  useTheme,
} from 'react-native-paper';
import { Modalize } from 'react-native-modalize';
import CustomModal from '../../../components/Overrides/CustomModal';
import { stringMatchQuery } from '../../../utils/Search';
import ProximoListItem from '../../../components/Lists/Proximo/ProximoListItem';
import MaterialHeaderButtons, {
  Item,
} from '../../../components/Overrides/CustomHeaderButton';
import type { ProximoArticleType } from './ProximoMainScreen';
import GENERAL_STYLES from '../../../constants/Styles';
import { useNavigation } from '@react-navigation/core';
import Urls from '../../../constants/Urls';
import WebSectionList, {
  SectionListDataType,
} from '../../../components/Screens/WebSectionList';
import { readData } from '../../../utils/WebData';
import { StackScreenProps } from '@react-navigation/stack';
import {
  MainRoutes,
  MainStackParamsList,
} from '../../../navigation/MainNavigator';
import { useCachedProximoArticles } from '../../../utils/cacheContext';

function sortPrice(a: ProximoArticleType, b: ProximoArticleType): number {
  return a.price - b.price;
}

function sortPriceReverse(
  a: ProximoArticleType,
  b: ProximoArticleType
): number {
  return b.price - a.price;
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

export type ArticlesType = Array<ProximoArticleType>;

type Props = StackScreenProps<MainStackParamsList, MainRoutes.ProximoList>;

function ProximoListScreen(props: Props) {
  const navigation = useNavigation();
  const theme = useTheme();
  const { articles, setArticles } = useCachedProximoArticles();
  const modalRef = useRef<Modalize>();

  const [currentSearchString, setCurrentSearchString] = useState('');
  const [currentSortMode, setCurrentSortMode] = useState(2);
  const [modalCurrentDisplayItem, setModalCurrentDisplayItem] = useState<
    React.ReactNode | undefined
  >();

  const sortModes = [sortPrice, sortPriceReverse, sortName, sortNameReverse];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: getSortMenuButton,
      headerTitle: getSearchBar,
      headerBackTitleVisible: false,
      headerTitleContainerStyle:
        Platform.OS === 'ios'
          ? { marginHorizontal: 0, width: '70%' }
          : { marginHorizontal: 0, right: 50, left: 50 },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, currentSortMode]);

  /**
   * Callback used when clicking on the sort menu button.
   * It will open the modal to show a sort selection
   */
  const onSortMenuPress = () => {
    setModalCurrentDisplayItem(getModalSortMenu());
    if (modalRef.current) {
      modalRef.current.open();
    }
  };

  /**
   * Callback used when clicking an article in the list.
   * It opens the modal to show detailed information about the article
   *
   * @param item The article pressed
   */
  const onListItemPress = (item: ProximoArticleType) => {
    setModalCurrentDisplayItem(getModalItemContent(item));
    if (modalRef.current) {
      modalRef.current.open();
    }
  };

  /**
   * Sets the current sort mode.
   *
   * @param mode The number representing the mode
   */
  const setSortMode = (mode: string) => {
    const currentMode = parseInt(mode, 10);
    setCurrentSortMode(currentMode);
    if (modalRef.current && currentMode !== currentSortMode) {
      modalRef.current.close();
    }
  };

  /**
   * Gets a color depending on the quantity available
   *
   * @param availableStock The quantity available
   * @return
   */
  const getStockColor = (availableStock: number): string => {
    let color: string;
    if (availableStock > 3) {
      color = theme.colors.success;
    } else if (availableStock > 0) {
      color = theme.colors.warning;
    } else {
      color = theme.colors.danger;
    }
    return color;
  };

  /**
   * Gets the sort menu header button
   *
   * @return {*}
   */
  const getSortMenuButton = () => {
    return (
      <MaterialHeaderButtons>
        <Item title="main" iconName="sort" onPress={onSortMenuPress} />
      </MaterialHeaderButtons>
    );
  };

  /**
   * Gets the header search bar
   *
   * @return {*}
   */
  const getSearchBar = () => {
    return (
      // @ts-ignore
      <Searchbar
        placeholder={i18n.t('screens.proximo.search')}
        onChangeText={setCurrentSearchString}
        autoFocus={props.route.params.shouldFocusSearchBar}
      />
    );
  };

  /**
   * Gets the modal content depending on the given article
   *
   * @param item The article to display
   * @return {*}
   */
  const getModalItemContent = (item: ProximoArticleType) => {
    return (
      <View style={styles.modalContainer}>
        <Title>{item.name}</Title>
        <View style={styles.modalTitleContainer}>
          <Subheading
            style={{
              color: getStockColor(item.quantity),
            }}
          >
            {`${item.quantity} ${i18n.t('screens.proximo.inStock')}`}
          </Subheading>
          <Subheading style={styles.modalTitle}>
            {item.price.toFixed(2)}€
          </Subheading>
        </View>

        <ScrollView>
          <View style={styles.modalContent}>
            <Image
              style={styles.image}
              source={{ uri: Urls.proximo.images + item.image }}
            />
          </View>
          <Text>{item.description}</Text>
        </ScrollView>
      </View>
    );
  };

  /**
   * Gets the modal content to display a sort menu
   *
   * @return {*}
   */
  const getModalSortMenu = () => {
    return (
      <View style={styles.modalContainer}>
        <Title style={styles.sortTitle}>
          {i18n.t('screens.proximo.sortOrder')}
        </Title>
        <RadioButton.Group
          onValueChange={setSortMode}
          value={currentSortMode.toString()}
        >
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortPrice')}
            value={'0'}
          />
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortPriceReverse')}
            value={'1'}
          />
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortName')}
            value={'2'}
          />
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortNameReverse')}
            value={'3'}
          />
        </RadioButton.Group>
      </View>
    );
  };

  /**
   * Gets a render item for the given article
   *
   * @param item The article to render
   * @return {*}
   */
  const getRenderItem = ({ item }: { item: ProximoArticleType }) => {
    if (stringMatchQuery(item.name, currentSearchString)) {
      const onPress = () => {
        onListItemPress(item);
      };
      const color = getStockColor(item.quantity);
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
  const keyExtractor = (item: ProximoArticleType): string =>
    item.name + item.code;

  const createDataset = (
    data: ArticlesType | undefined
  ): SectionListDataType<ProximoArticleType> => {
    if (data) {
      return [
        {
          title: '',
          data: data
            .filter(
              (d) =>
                props.route.params.category === -1 ||
                props.route.params.category === d.category_id
            )
            .sort(sortModes[currentSortMode]),
          keyExtractor: keyExtractor,
        },
      ];
    } else {
      return [
        {
          title: '',
          data: [],
          keyExtractor: keyExtractor,
        },
      ];
    }
  };

  return (
    <View style={GENERAL_STYLES.flex}>
      <CustomModal onRef={(ref) => (modalRef.current = ref)}>
        {modalCurrentDisplayItem}
      </CustomModal>
      <WebSectionList
        request={() => readData<ArticlesType>(Urls.proximo.articles)}
        createDataset={createDataset}
        refreshOnFocus={true}
        renderItem={getRenderItem}
        extraData={currentSearchString + currentSortMode}
        itemHeight={LIST_ITEM_HEIGHT}
        cache={articles}
        onCacheUpdate={setArticles}
      />
    </View>
  );
}

export default ProximoListScreen;
