// @flow

import * as React from 'react';
import {List} from 'react-native-paper';
import {View} from 'react-native-animatable';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import packageJson from '../../../package.json';

type ListItemType = {
  name: string,
  version: string,
};

/**
 * Generates the dependencies list from the raw json
 *
 * @param object The raw json
 * @return {Array<ListItemType>}
 */
function generateListFromObject(object: {
  [key: string]: string,
}): Array<ListItemType> {
  const list = [];
  const keys = Object.keys(object);
  keys.forEach((key: string) => {
    list.push({name: key, version: object[key]});
  });
  return list;
}

const LIST_ITEM_HEIGHT = 64;

/**
 * Class defining a screen showing the list of libraries used by the app, taken from package.json
 */
export default class AboutDependenciesScreen extends React.Component<null> {
  data: Array<ListItemType>;

  constructor() {
    super();
    this.data = generateListFromObject(packageJson.dependencies);
  }

  keyExtractor = (item: ListItemType): string => item.name;

  getRenderItem = ({item}: {item: ListItemType}): React.Node => (
    <List.Item
      title={item.name}
      description={item.version.replace('^', '').replace('~', '')}
      style={{height: LIST_ITEM_HEIGHT}}
    />
  );

  getItemLayout = (
    data: ListItemType,
    index: number,
  ): {length: number, offset: number, index: number} => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT * index,
    index,
  });

  render(): React.Node {
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
