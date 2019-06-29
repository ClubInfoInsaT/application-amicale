// @flow

import * as React from 'react';
import {Container, Text, Content, ListItem, Body} from 'native-base';
import CustomHeader from "../../components/CustomHeader";
import {FlatList} from "react-native";
import i18n from "i18n-js";

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
    navigation: Object
}

/**
 * Class defining a screen showing the list of libraries used by the app, taken from package.json
 */
export default class AboutDependenciesScreen extends React.Component<Props> {

    render() {
        const nav = this.props.navigation;
        const data = generateListFromObject(nav.getParam('data', {}));
        return (
            <Container>
                <CustomHeader backButton={true} navigation={nav} title={i18n.t('aboutScreen.libs')} />
                <Content>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.name}
                        style={{minHeight: 300, width: '100%'}}
                        renderItem={({item}) =>
                            <ListItem>
                                <Body>
                                    <Text>
                                        {item.name}
                                    </Text>
                                    <Text note>
                                        {item.version.replace('^', '')}
                                    </Text>
                                </Body>
                            </ListItem>}
                    />
                </Content>
            </Container>
        );
    }
}
