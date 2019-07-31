// @flow

import * as React from 'react';
import {Image, Linking, TouchableOpacity, View} from 'react-native';
import {Body, Button, Card, CardItem, Left, Text, Thumbnail} from 'native-base';
import i18n from "i18n-js";
import CustomMaterialIcon from '../components/CustomMaterialIcon';
import FetchedDataSectionList from "../components/FetchedDataSectionList";
import Autolink from 'react-native-autolink';

const ICON_AMICALE = require('../assets/amicale.png');
const NAME_AMICALE = 'Amicale INSA Toulouse';
const DATA_URL = "https://etud.insa-toulouse.fr/~vergnet/appli-amicale/facebook_data.json";


/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining the app's home screen
 */
export default class HomeScreen extends FetchedDataSectionList {

    constructor() {
        super(DATA_URL, 0);
    }

    getHeaderTranslation() {
        return i18n.t("screens.home");
    }

    getUpdateToastTranslations() {
        return [i18n.t("homeScreen.listUpdated"), i18n.t("homeScreen.listUpdateFail")];
    }

    getKeyExtractor(item: Object) {
        return item !== undefined ? item.id : undefined;
    }

    createDataset(fetchedData: Object) {
        let data = [];
        if (fetchedData.data !== undefined)
            data = fetchedData.data;
        return [
            {
                title: '',
                data: data,
                extraData: super.state,
                keyExtractor: this.getKeyExtractor
            }
        ];
    }

    /**
     * Converts a dateString using Unix Timestamp to a formatted date
     * @param dateString {string} The Unix Timestamp representation of a date
     * @return {string} The formatted output date
     */
    static getFormattedDate(dateString: string) {
        let date = new Date(Number.parseInt(dateString) * 1000);
        return date.toLocaleString();
    }

    getRenderItem(item: Object, section: Object, data: Object) {
        return (
            <Card style={{
                flex: 0,
                marginLeft: 10,
                marginRight: 10
            }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={ICON_AMICALE}/>
                        <Body>
                            <Text>{NAME_AMICALE}</Text>
                            <Text note>{HomeScreen.getFormattedDate(item.created_time)}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        {item.full_picture !== '' && item.full_picture !== undefined ?
                            <TouchableOpacity onPress={() => openWebLink(item.full_picture)}
                                              style={{width: '100%', height: 250}}>
                                <Image source={{uri: item.full_picture}}
                                       style={{flex: 1, resizeMode: "contain"}}
                                       resizeMode="contain"
                                />
                            </TouchableOpacity>
                            : <View/>}
                        {item.message !== undefined ?
                            <Autolink
                                text={item.message}
                                hashtag="facebook"
                            /> : <View/>
                        }
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent
                                onPress={() => openWebLink(item.permalink_url)}>
                            <CustomMaterialIcon
                                icon="facebook"
                                color="#57aeff"
                                width={20}/>
                            <Text>En savoir plus</Text>
                        </Button>
                    </Left>
                </CardItem>
            </Card>
        );
    }

}
