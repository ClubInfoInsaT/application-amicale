// @flow

import * as React from 'react';
import {FlatList} from "react-native";
import packageJson from '../../package';
import {List} from 'react-native-paper';

function generateListFromObject(object) {
    let list = [];
    let keys = Object.keys(object);
    let values = Object.values(object);
    for (let i = 0; i < keys.length; i++) {
        list.push({name: keys[i], version: values[i]});
    }
    return list;
}

type Props = {
    navigation: Object,
    route: Object
}

/**
 * Class defining a screen showing the list of libraries used by the app, taken from package.json
 */
export default class AboutDependenciesScreen extends React.Component<Props> {

    render() {
        const data = generateListFromObject(packageJson.dependencies);
        return (
            <FlatList
                data={data}
                keyExtractor={(item) => item.name}
                style={{minHeight: 300, width: '100%'}}
                renderItem={({item}) =>
                    <List.Item
                        title={item.name}
                        description={item.version.replace('^', '').replace('~', '')}
                    />}
            />
        );
    }
}
