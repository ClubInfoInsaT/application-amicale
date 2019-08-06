// @flow

import * as React from 'react';
import {View} from 'react-native'
import {Badge, Body, H2, Left, ListItem, Right, Text} from 'native-base';
import i18n from "i18n-js";
import CustomMaterialIcon from "../../components/CustomMaterialIcon";
import FetchedDataSectionList from "../../components/FetchedDataSectionList";

const DATA_URL = "https://srv-falcon.etud.insa-toulouse.fr/~proximo/data/stock.json";

const typesIcons = {
    Nouveau: "alert-decagram",
    Alimentaire: "food",
    Boissons: "bottle-wine",
    Utilitaires: "notebook",
    Default: "information-outline",
};


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
        return item !== undefined ? item.type : undefined;
    }

    createDataset(fetchedData: Object) {
        return [
            {
                title: i18n.t('proximoScreen.listTitle'),
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
            for (let i = 0; i < types.length; i++) {
                finalData.push({
                    type: types[i],
                    data: []
                });
                for (let k = 0; k < articles.length; k++) {
                    if (articles[k]['type'].includes(types[i])) {
                        finalData[i].data.push(articles[k]);
                    }
                }
            }
        }
        return finalData;
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
                            icon={typesIcons[item.type] ? typesIcons[item.type] : typesIcons.Default}
                            fontSize={30}
                        />
                    </Left>
                    <Body>
                        <Text>
                            {item.type}
                        </Text>
                        <Badge><Text>
                            {item.data.length} {item.data.length > 1 ? i18n.t('proximoScreen.articles') : i18n.t('proximoScreen.article')}
                        </Text></Badge>
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

    getRenderSectionHeader(title: String) {
        return <H2 style={{textAlign: 'center', paddingVertical: 10}}>{title}</H2>;
    }
}

