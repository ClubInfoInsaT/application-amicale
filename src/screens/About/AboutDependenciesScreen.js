// @flow

import * as React from 'react';
import {FlatList} from "react-native";
import packageJson from '../../../package';
import {List} from 'react-native-paper';
import {StackNavigationProp} from "@react-navigation/stack";

type listItem = {
    name: string,
    version: string
};

/**
 * Generates the dependencies list from the raw json
 *
 * @param object The raw json
 * @return {Array<listItem>}
 */
function generateListFromObject(object: { [key: string]: string }): Array<listItem> {
    let list = [];
    let keys = Object.keys(object);
    let values = Object.values(object);
    for (let i = 0; i < keys.length; i++) {
        list.push({name: keys[i], version: values[i]});
    }
    //$FlowFixMe
    return list;
}

type Props = {
    navigation: StackNavigationProp,
}

const LIST_ITEM_HEIGHT = 64;

/**
 * Class defining a screen showing the list of libraries used by the app, taken from package.json
 */
export default class AboutDependenciesScreen extends React.Component<Props> {

    data: Array<listItem>;

    constructor() {
        super();
        this.data = generateListFromObject(packageJson.dependencies);
    }

    keyExtractor = (item: listItem) => item.name;

    renderItem = ({item}: { item: listItem }) =>
        <List.Item
            title={item.name}
            description={item.version.replace('^', '').replace('~', '')}
            style={{height: LIST_ITEM_HEIGHT}}
        />;

    itemLayout = (data: any, index: number) => ({length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index});

    render() {
        return (
            <FlatList
                data={this.data}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
                removeClippedSubviews={true}
                getItemLayout={this.itemLayout}
            />
        );
    }
}
