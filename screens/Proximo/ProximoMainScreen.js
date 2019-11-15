// @flow

import * as React from 'react';
import {Platform, View} from 'react-native'
import {Badge, Body, Left, ListItem, Right, Text} from 'native-base';
import i18n from "i18n-js";
import CustomMaterialIcon from "../../components/CustomMaterialIcon";
import FetchedDataSectionList from "../../components/FetchedDataSectionList";
import ThemeManager from "../../utils/ThemeManager";
import Touchable from "react-native-platform-touchable";

const DATA_URL = "https://srv-falcon.etud.insa-toulouse.fr/~proximo/data/stock-v2.json";


/**
 * Class defining the main proximo screen. This screen shows the different categories of articles
 * offered by proximo.
 */
export default class ProximoMainScreen extends FetchedDataSectionList {

    constructor() {
        super(DATA_URL, 0);
    }

    getHeaderTranslation() {
        return i18n.t("screens.proximo");
    }

    getUpdateToastTranslations() {
        return [i18n.t("proximoScreen.listUpdated"), i18n.t("proximoScreen.listUpdateFail")];
    }

    getKeyExtractor(item: Object) {
        return item !== undefined ? item.type['id'] : undefined;
    }

    createDataset(fetchedData: Object) {
        return [
            {
                title: '',
                data: ProximoMainScreen.generateData(fetchedData),
                extraData: super.state,
                keyExtractor: this.getKeyExtractor
            }
        ];
    }

    /**
     * Generate the data using types and FetchedData.
     * This will group items under the same type.
     *
     * @param fetchedData The array of articles represented by objects
     * @returns {Array} The formatted dataset
     */
    static generateData(fetchedData: Object) {
        let finalData = [];
        if (fetchedData.types !== undefined && fetchedData.articles !== undefined) {
            let types = fetchedData.types;
            let articles = fetchedData.articles;
            finalData.push({
                type: {
                    id: "0",
                    name: i18n.t('proximoScreen.all'),
                    icon: 'star'
                },
                data: this.getAvailableArticles(articles, undefined)
            });
            for (let i = 0; i < types.length; i++) {
                finalData.push({
                    type: types[i],
                    data: this.getAvailableArticles(articles, types[i])
                });

            }
        }
        finalData.sort(ProximoMainScreen.sortFinalData);
        return finalData;
    }

    /**
     * Get an array of available articles (in stock) of the given type
     *
     * @param articles The list of all articles
     * @param type The type of articles to find (undefined for any type)
     * @return {Array} The array of available articles
     */
    static getAvailableArticles(articles: Array<Object>, type: ?Object) {
        let availableArticles = [];
        for (let k = 0; k < articles.length; k++) {
            if ((type !== undefined && type !== null && articles[k]['type'].includes(type['id'])
                || type === undefined)
                && parseInt(articles[k]['quantity']) > 0) {
                availableArticles.push(articles[k]);
            }
        }
        return availableArticles;
    }

    static sortFinalData(a: Object, b: Object) {
        return a.type.id - b.type.id;
    }

    getRightButton() {
        return (
            <Touchable
                style={{padding: 6}}
                onPress={() => this.props.navigation.navigate('ProximoAboutScreen')}>
                <CustomMaterialIcon
                    color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                    icon="information"/>
            </Touchable>
        );
    }

    getRenderItem(item: Object, section: Object, data: Object) {
        if (item.data.length > 0) {
            return (
                <ListItem
                    button
                    thumbnail
                    onPress={() => {
                        this.props.navigation.navigate('ProximoListScreen', item);
                    }}
                >
                    <Left>
                        <CustomMaterialIcon
                            icon={item.type.icon}
                            fontSize={30}
                            color={ThemeManager.getCurrentThemeVariables().brandPrimary}
                        />
                    </Left>
                    <Body>
                        <Text>
                            {item.type.name}
                        </Text>
                        <Text note>
                            {item.data.length} {item.data.length > 1 ? i18n.t('proximoScreen.articles') : i18n.t('proximoScreen.article')}
                        </Text>
                    </Body>
                    <Right>
                        <CustomMaterialIcon icon="chevron-right"/>
                    </Right>
                </ListItem>
            );
        } else {
            return <View/>;
        }

    }
}

