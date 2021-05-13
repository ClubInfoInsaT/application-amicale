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
import { SectionListData, StyleSheet, View } from 'react-native';
import { Card, Text, withTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'i18n-js';
import DateManager from '../../managers/DateManager';
import WebSectionList from '../../components/Screens/WebSectionList';
import type { SectionListDataType } from '../../components/Screens/WebSectionList';
import Urls from '../../constants/Urls';
import { readData } from '../../utils/WebData';
import { REQUEST_STATUS } from '../../utils/Requests';

type PropsType = {
  navigation: StackNavigationProp<any>;
  theme: ReactNativePaper.Theme;
};

export type RuFoodCategoryType = {
  name: string;
  dishes: Array<{ name: string }>;
};

type RuMealType = {
  name: string;
  foodcategory: Array<RuFoodCategoryType>;
};

type RawRuMenuType = {
  restaurant_id: number;
  id: number;
  date: string;
  meal: Array<RuMealType>;
};

const styles = StyleSheet.create({
  itemCard: {
    flex: 0,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  headerCard: {
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
    marginBottom: 5,
    elevation: 4,
  },
  text: {
    textAlign: 'center',
  },
  title: {
    paddingLeft: 0,
  },
  itemTitle: {
    marginTop: 5,
  },
  item: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  itemText: {
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
  },
});

/**
 * Class defining the app's menu screen.
 */
class SelfMenuScreen extends React.Component<PropsType> {
  /**
   * Formats the given string to make sure it starts with a capital letter
   *
   * @param name The string to format
   * @return {string} The formatted string
   */
  static formatName(name: string): string {
    return name.charAt(0) + name.substr(1).toLowerCase();
  }

  /**
   * Creates the dataset to be used in the FlatList
   *
   * @param fetchedData
   * @return {[]}
   */
  createDataset = (
    fetchedData: Array<RawRuMenuType> | undefined,
    _loading: boolean,
    _lastRefreshDate: Date | undefined,
    _refreshData: (newRequest?: () => Promise<Array<RawRuMenuType>>) => void,
    status: REQUEST_STATUS
  ): SectionListDataType<RuFoodCategoryType> => {
    let result: SectionListDataType<RuFoodCategoryType> = [];
    if (status === REQUEST_STATUS.SUCCESS) {
      if (fetchedData == null || fetchedData.length === 0) {
        result = [
          {
            title: i18n.t('general.notAvailable'),
            data: [],
            keyExtractor: this.getKeyExtractor,
          },
        ];
      } else {
        fetchedData.forEach((item: RawRuMenuType) => {
          result.push({
            title: DateManager.getInstance().getTranslatedDate(item.date),
            data: item.meal[0].foodcategory,
            keyExtractor: this.getKeyExtractor,
          });
        });
      }
    }
    return result;
  };

  /**
   * Gets the render section header
   *
   * @param section The section to render the header from
   * @return {*}
   */
  getRenderSectionHeader = ({
    section,
  }: {
    section: SectionListData<RuFoodCategoryType>;
  }) => {
    return (
      <Card style={styles.headerCard}>
        <Card.Title
          title={section.title}
          titleStyle={styles.text}
          subtitleStyle={styles.text}
          style={styles.title}
        />
      </Card>
    );
  };

  /**
   * Gets a FlatList render item
   *
   * @param item The item to render
   * @return {*}
   */
  getRenderItem = ({ item }: { item: RuFoodCategoryType }) => {
    const { theme } = this.props;
    return (
      <Card style={styles.itemCard}>
        <Card.Title style={styles.itemTitle} title={item.name} />
        <View
          style={{
            borderBottomColor: theme.colors.primary,
            ...styles.item,
          }}
        />
        <Card.Content>
          {item.dishes.map((object: { name: string }) =>
            object.name !== '' ? (
              <Text style={styles.itemText}>
                {SelfMenuScreen.formatName(object.name)}
              </Text>
            ) : null
          )}
        </Card.Content>
      </Card>
    );
  };

  /**
   * Extract a key for the given item
   *
   * @param item The item to extract the key from
   * @return {*} The extracted key
   */
  getKeyExtractor = (item: RuFoodCategoryType): string => item.name;

  render() {
    return (
      <WebSectionList
        request={() => readData<Array<RawRuMenuType>>(Urls.app.menu)}
        createDataset={this.createDataset}
        refreshOnFocus={true}
        renderItem={this.getRenderItem}
        renderSectionHeader={this.getRenderSectionHeader}
        stickySectionHeadersEnabled={true}
      />
    );
  }
}

export default withTheme(SelfMenuScreen);
