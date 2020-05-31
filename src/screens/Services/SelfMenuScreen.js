// @flow

import * as React from 'react';
import {View} from 'react-native';
import DateManager from "../../managers/DateManager";
import WebSectionList from "../../components/Screens/WebSectionList";
import {Card, Text, withTheme} from 'react-native-paper';
import AprilFoolsManager from "../../managers/AprilFoolsManager";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../managers/ThemeManager";
import i18n from 'i18n-js';

const DATA_URL = "https://etud.insa-toulouse.fr/~amicale_app/menu/menu_data.json";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
}

/**
 * Class defining the app's menu screen.
 */
class SelfMenuScreen extends React.Component<Props> {

    /**
     * Extract a key for the given item
     *
     * @param item The item to extract the key from
     * @return {*} The extracted key
     */
    getKeyExtractor(item: Object) {
        return item !== undefined ? item['name'] : undefined;
    }

    /**
     * Creates the dataset to be used in the FlatList
     *
     * @param fetchedData
     * @return {[]}
     */
    createDataset = (fetchedData: Object) => {
        let result = [];
        if (fetchedData == null || Object.keys(fetchedData).length === 0) {
            result = [
                {
                    title: i18n.t("general.notAvailable"),
                    data: [],
                    keyExtractor: this.getKeyExtractor
                }
            ];
        } else {
            if (AprilFoolsManager.getInstance().isAprilFoolsEnabled() && fetchedData.length > 0)
                fetchedData[0].meal[0].foodcategory = AprilFoolsManager.getFakeMenuItem(fetchedData[0].meal[0].foodcategory);
            // fetched data is an array here
            for (let i = 0; i < fetchedData.length; i++) {
                result.push(
                    {
                        title: DateManager.getInstance().getTranslatedDate(fetchedData[i].date),
                        data: fetchedData[i].meal[0].foodcategory,
                        keyExtractor: this.getKeyExtractor,
                    }
                );
            }
        }
        return result
    };

    /**
     * Gets the render section header
     *
     * @param section The section to render the header from
     * @return {*}
     */
    getRenderSectionHeader = ({section}: Object) => {
        return (
            <Card style={{
                width: '95%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5,
                marginBottom: 5,
                elevation: 4,
            }}>
                <Card.Title
                    title={section.title}
                    titleStyle={{
                        textAlign: 'center'
                    }}
                    subtitleStyle={{
                        textAlign: 'center'
                    }}
                    style={{
                        paddingLeft: 0,
                    }}
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
    getRenderItem = ({item}: Object) => {
        return (
            <Card style={{
                flex: 0,
                marginHorizontal: 10,
                marginVertical: 5,
            }}>
                <Card.Title
                    style={{marginTop: 5}}
                    title={item.name}
                />
                <View style={{
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderBottomWidth: 1,
                    borderBottomColor: this.theme.colors.primary,
                    marginTop: 5,
                    marginBottom: 5,
                }}/>
                <Card.Content>
                    {item.dishes.map((object) =>
                        <View>
                            {object.name !== "" ?
                                <Text style={{
                                    marginTop: 5,
                                    marginBottom: 5,
                                    textAlign: 'center'
                                }}>{this.formatName(object.name)}</Text>
                                : <View/>}
                        </View>)}
                </Card.Content>
            </Card>
        );
    };

    /**
     * Formats the given string to make sure it starts with a capital letter
     *
     * @param name The string to format
     * @return {string} The formatted string
     */
    formatName(name: String) {
        return name.charAt(0) + name.substr(1).toLowerCase();
    }

    render() {
        const nav = this.props.navigation;
        return (
            <WebSectionList
                createDataset={this.createDataset}
                navigation={nav}
                autoRefreshTime={0}
                refreshOnFocus={false}
                fetchUrl={DATA_URL}
                renderItem={this.getRenderItem}
                renderSectionHeader={this.getRenderSectionHeader}
                stickyHeader={true}/>
        );
    }
}

export default withTheme(SelfMenuScreen);
