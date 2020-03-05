// @flow

import * as React from 'react';
import {Platform, View} from 'react-native'
import {Body, Left, ListItem, Right, Text} from 'native-base';
import i18n from "i18n-js";
import CustomMaterialIcon from "../../components/CustomMaterialIcon";
import ThemeManager from "../../utils/ThemeManager";
import Touchable from "react-native-platform-touchable";
import BaseContainer from "../../components/BaseContainer";
import WebSectionList from "../../components/WebSectionList";

const DATA_URL = "https://etud.insa-toulouse.fr/~proximo/data/stock-v2.json";

type Props = {
    navigation: Object,
}

type State = {
    fetchedData: Object,
}

/**
 * Class defining the main proximo screen. This screen shows the different categories of articles
 * offered by proximo.
 */
export default class ProximoMainScreen extends React.Component<Props, State> {

    articles: Object;

    onPressSearchBtn: Function;
    onPressAboutBtn: Function;
    getRenderItem: Function;
    createDataset: Function;

    constructor() {
        super();
        this.onPressSearchBtn = this.onPressSearchBtn.bind(this);
        this.onPressAboutBtn = this.onPressAboutBtn.bind(this);
        this.getRenderItem = this.getRenderItem.bind(this);
        this.createDataset = this.createDataset.bind(this);
    }

    static sortFinalData(a: Object, b: Object) {
        let str1 = a.type.name.toLowerCase();
        let str2 = b.type.name.toLowerCase();

        // Make 'All' category with id -1 stick to the top
        if (a.type.id === -1)
            return -1;
        if (b.type.id === -1)
            return 1;

        // Sort others by name ascending
        if (str1 < str2)
            return -1;
        if (str1 > str2)
            return 1;
        return 0;
    }

    getKeyExtractor(item: Object) {
        return item !== undefined ? item.type['id'] : undefined;
    }

    createDataset(fetchedData: Object) {
        return [
            {
                title: '',
                data: this.generateData(fetchedData),
                extraData: this.state,
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
    generateData(fetchedData: Object) {
        let finalData = [];
        this.articles = undefined;
        if (fetchedData.types !== undefined && fetchedData.articles !== undefined) {
            let types = fetchedData.types;
            this.articles = fetchedData.articles;
            finalData.push({
                type: {
                    id: -1,
                    name: i18n.t('proximoScreen.all'),
                    icon: 'star'
                },
                data: this.getAvailableArticles(this.articles, undefined)
            });
            for (let i = 0; i < types.length; i++) {
                finalData.push({
                    type: types[i],
                    data: this.getAvailableArticles(this.articles, types[i])
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
    getAvailableArticles(articles: Array<Object>, type: ?Object) {
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

    onPressSearchBtn() {
        let searchScreenData = {
            shouldFocusSearchBar: true,
            data: {
                type: {
                    id: "0",
                    name: i18n.t('proximoScreen.all'),
                    icon: 'star'
                },
                data: this.articles !== undefined ?
                    this.getAvailableArticles(this.articles, undefined) : []
            },
        };
        this.props.navigation.navigate('ProximoListScreen', searchScreenData);
    }

    onPressAboutBtn() {
        this.props.navigation.navigate('ProximoAboutScreen');
    }

    getRightButton() {
        return (
            <View
                style={{
                    flexDirection: 'row'
                }}>
                <Touchable
                    style={{padding: 6}}
                    onPress={this.onPressSearchBtn}>
                    <CustomMaterialIcon
                        color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                        icon="magnify"/>
                </Touchable>
                <Touchable
                    style={{padding: 6}}
                    onPress={this.onPressAboutBtn}>
                    <CustomMaterialIcon
                        color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                        icon="information"/>
                </Touchable>
            </View>
        );
    }

    getRenderItem({item}: Object) {
        let dataToSend = {
            shouldFocusSearchBar: false,
            data: item,
        };
        const onPress = this.props.navigation.navigate.bind(this, 'ProximoListScreen', dataToSend);
        if (item.data.length > 0) {
            return (
                <ListItem
                    button
                    thumbnail
                    onPress={onPress}
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
        } else
            return <View/>;
    }

    render() {
        const nav = this.props.navigation;
        return (
            <BaseContainer
                navigation={nav}
                headerTitle={i18n.t('screens.proximo')}
                headerRightButton={this.getRightButton()}>
                <WebSectionList
                    createDataset={this.createDataset}
                    navigation={nav}
                    refreshTime={0}
                    fetchUrl={DATA_URL}
                    renderItem={this.getRenderItem}
                    updateErrorText={i18n.t("homeScreen.listUpdateFail")}/>
            </BaseContainer>
        );
    }
}

