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
import { List } from 'react-native-paper';
import { View } from 'react-native-animatable';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import packageJson from '../../../package.json';

type ListItemType = {
  name: string;
  version: string;
};

/**
 * Generates the dependencies list from the raw json
 *
 * @param object The raw json
 * @return {Array<ListItemType>}
 */
function generateListFromObject(object: {
  [key: string]: string;
}): Array<ListItemType> {
  const list: Array<ListItemType> = [];
  const keys = Object.keys(object);
  keys.forEach((key: string) => {
    list.push({ name: key, version: object[key] });
  });
  return list;
}

const LIST_ITEM_HEIGHT = 64;

/**
 * Class defining a screen showing the list of libraries used by the app, taken from package.json
 */
export default class AboutDependenciesScreen extends React.Component<{}> {
  data: Array<ListItemType>;

  constructor(props: {}) {
    super(props);
    this.data = generateListFromObject(packageJson.dependencies);
  }

  keyExtractor = (item: ListItemType): string => item.name;

  getRenderItem = ({ item }: { item: ListItemType }) => (
    <List.Item
      title={item.name}
      description={item.version.replace('^', '').replace('~', '')}
      style={{ height: LIST_ITEM_HEIGHT }}
    />
  );

  getItemLayout = (
    _data: Array<ListItemType> | null | undefined,
    index: number
  ): { length: number; offset: number; index: number } => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT * index,
    index,
  });

  render() {
    return (
      <View>
        <CollapsibleFlatList
          data={this.data}
          keyExtractor={this.keyExtractor}
          renderItem={this.getRenderItem}
          // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
          removeClippedSubviews
          getItemLayout={this.getItemLayout}
        />
      </View>
    );
  }
}
