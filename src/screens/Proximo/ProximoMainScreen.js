// @flow

import * as React from 'react';
import {View} from 'react-native'
import i18n from "i18n-js";
import WebSectionList from "../../components/Lists/WebSectionList";
import {List, withTheme} from 'react-native-paper';
import MaterialHeaderButtons, {Item} from "../../components/Custom/HeaderButton";
import AnimatedFocusView from "../../components/Custom/AnimatedFocusView";

const DATA_URL = "https://etud.insa-toulouse.fr/~proximo/data/stock-v2.json";
const LIST_ITEM_HEIGHT = 84;

type Props = {
    navigation: Object,
    route: Object,
}

type State = {
    fetchedData: Object,
}

/**
 * Class defining the main proximo screen.
 * This screen shows the different categories of articles offered by proximo.
 */
class ProximoMainScreen extends React.Component<Props, State> {

    articles: Object;

    onPressSearchBtn: Function;
    onPressAboutBtn: Function;
    getRenderItem: Function;
    createDataset: Function;

    colors: Object;

    constructor(props) {
        super(props);
        this.onPressSearchBtn = this.onPressSearchBtn.bind(this);
        this.onPressAboutBtn = this.onPressAboutBtn.bind(this);
        this.getRenderItem = this.getRenderItem.bind(this);
        this.createDataset = this.createDataset.bind(this);
        this.colors = props.theme.colors;
    }

    /**
     * Function used to sort items in the list.
     * Makes the All category stick to the top and sorts the others by name ascending
     *
     * @param a
     * @param b
     * @return {number}
     */
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

    /**
     * Creates header button
     */
    componentDidMount() {
        const rightButton = this.getHeaderButtons.bind(this);
        this.props.navigation.setOptions({
            headerRight: rightButton,
        });
    }

    /**
     * Callback used when the search button is pressed.
     * This will open a new ProximoListScreen with all items displayed
     */
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
        this.props.navigation.navigate('proximo-list', searchScreenData);
    }

    /**
     * Callback used when the about button is pressed.
     * This will open the ProximoAboutScreen
     */
    onPressAboutBtn() {
        this.props.navigation.navigate('proximo-about');
    }

    /**
     * Gets the header buttons
     * @return {*}
     */
    getHeaderButtons() {
        return <MaterialHeaderButtons>
            <Item title="magnify" iconName="magnify" onPress={this.onPressSearchBtn}/>
            <Item title="information" iconName="information" onPress={this.onPressAboutBtn}/>
        </MaterialHeaderButtons>;
    }

    /**
     * Extracts a key for the given category
     *
     * @param item The category to extract the key from
     * @return {*} The extracted key
     */
    getKeyExtractor(item: Object) {
        return item !== undefined ? item.type['id'] : undefined;
    }

    /**
     * Creates the dataset to be used in the FlatList
     *
     * @param fetchedData
     * @return {*}
     * */
    createDataset(fetchedData: Object) {
        return [
            {
                title: '',
                data: this.generateData(fetchedData),
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

    /**
     * Gets the given category render item
     *
     * @param item The category to render
     * @return {*}
     */
    getRenderItem({item}: Object) {
        let dataToSend = {
            shouldFocusSearchBar: false,
            data: item,
        };
        const subtitle = item.data.length + " " + (item.data.length > 1 ? i18n.t('proximoScreen.articles') : i18n.t('proximoScreen.article'));
        const onPress = this.props.navigation.navigate.bind(this, 'proximo-list', dataToSend);
        if (item.data.length > 0) {
            return (
                <List.Item
                    title={item.type.name}
                    description={subtitle}
                    onPress={onPress}
                    left={props => <List.Icon
                        {...props}
                        icon={item.type.icon}
                        color={this.colors.primary}/>}
                    right={props => <List.Icon {...props} icon={'chevron-right'}/>}
                    style={{
                        height: LIST_ITEM_HEIGHT,
                        justifyContent: 'center',
                    }}
                />
            );
        } else
            return <View/>;
    }

    render() {
        const nav = this.props.navigation;
        return (
            <AnimatedFocusView
                {...this.props}
            >
                <WebSectionList
                    createDataset={this.createDataset}
                    navigation={nav}
                    autoRefreshTime={0}
                    refreshOnFocus={false}
                    fetchUrl={DATA_URL}
                    renderItem={this.getRenderItem}/>
            </AnimatedFocusView>
        );
    }
}

export default withTheme(ProximoMainScreen);
