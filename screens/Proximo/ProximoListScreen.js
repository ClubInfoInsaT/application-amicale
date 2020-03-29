// @flow

import * as React from 'react';
import {Image, Platform, ScrollView, View} from "react-native";
import i18n from "i18n-js";
import CustomModal from "../../components/CustomModal";
import {Avatar, IconButton, List, RadioButton, Searchbar, Subheading, Text, Title, withTheme} from "react-native-paper";
import PureFlatList from "../../components/PureFlatList";

function sortPrice(a, b) {
    return a.price - b.price;
}

function sortPriceReverse(a, b) {
    return b.price - a.price;
}

function sortName(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
    return 0;
}

function sortNameReverse(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase())
        return 1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
        return -1;
    return 0;
}

type Props = {
    navigation: Object,
    route: Object,
}

type State = {
    currentSortMode: number,
    modalCurrentDisplayItem: React.Node,
    currentlyDisplayedData: Array<Object>,
};

/**
 * Class defining proximo's article list of a certain category.
 */
class ProximoListScreen extends React.Component<Props, State> {

    modalRef: Object;
    originalData: Array<Object>;
    shouldFocusSearchBar: boolean;

    onSearchStringChange: Function;
    onSortMenuPress: Function;
    renderItem: Function;
    onModalRef: Function;

    colors: Object;

    constructor(props) {
        super(props);
        this.originalData = this.props.route.params['data']['data'];
        this.shouldFocusSearchBar = this.props.route.params['shouldFocusSearchBar'];
        this.state = {
            currentlyDisplayedData: this.originalData.sort(sortName),
            currentSortMode: 3,
            modalCurrentDisplayItem: null,
        };

        this.onSearchStringChange = this.onSearchStringChange.bind(this);
        this.onSortMenuPress = this.onSortMenuPress.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.onModalRef = this.onModalRef.bind(this);
        this.colors = props.theme.colors;
    }


    /**
     * Creates the header content
     */
    componentDidMount() {
        const button = this.getSortMenuButton.bind(this);
        const title = this.getSearchBar.bind(this);
        this.props.navigation.setOptions({
            headerRight: button,
            headerTitle: title,
            headerBackTitleVisible: false,
            headerTitleContainerStyle: Platform.OS === 'ios' ?
                {marginHorizontal: 0, width: '70%'} :
                {marginHorizontal: 0, right: 50, left: 50},
        });
    }

    /**
     * Gets the header search bar
     *
     * @return {*}
     */
    getSearchBar() {
        return (
            <Searchbar
                placeholder={i18n.t('proximoScreen.search')}
                onChangeText={this.onSearchStringChange}
            />
        );
    }

    /**
     * Gets the sort menu header button
     *
     * @return {*}
     */
    getSortMenuButton() {
        return (
            <IconButton
                icon="sort"
                color={this.colors.text}
                size={26}
                onPress={this.onSortMenuPress}
            />
        );
    }

    /**
     * Callback used when clicking on the sort menu button.
     * It will open the modal to show a sort selection
     */
    onSortMenuPress() {
        this.setState({
            modalCurrentDisplayItem: this.getModalSortMenu()
        });
        if (this.modalRef) {
            this.modalRef.open();
        }
    }

    /**
     * Sets the current sort mode.
     *
     * @param mode The number representing the mode
     */
    setSortMode(mode: number) {
        this.setState({
            currentSortMode: mode,
        });
        let data = this.state.currentlyDisplayedData;
        switch (mode) {
            case 1:
                data.sort(sortPrice);
                break;
            case 2:
                data.sort(sortPriceReverse);
                break;
            case 3:
                data.sort(sortName);
                break;
            case 4:
                data.sort(sortNameReverse);
                break;
        }
        if (this.modalRef && mode !== this.state.currentSortMode) {
            this.modalRef.close();
        }
    }

    /**
     * Gets a color depending on the quantity available
     *
     * @param availableStock The quantity available
     * @return
     */
    getStockColor(availableStock: number) {
        let color: string;
        if (availableStock > 3)
            color = this.colors.success;
        else if (availableStock > 0)
            color = this.colors.warning;
        else
            color = this.colors.danger;
        return color;
    }

    /**
     * Sanitizes the given string to improve search performance
     *
     * @param str The string to sanitize
     * @return {string} The sanitized string
     */
    sanitizeString(str: string): string {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Returns only articles whose name contains the given string.
     * Case and accents insensitive.
     *
     * @param str The string used to filter article names
     * @returns {[]}
     */
    filterData(str: string) {
        let filteredData = [];
        const testStr = this.sanitizeString(str);
        const articles = this.originalData;
        for (const article of articles) {
            const name = this.sanitizeString(article.name);
            if (name.includes(testStr)) {
                filteredData.push(article)
            }
        }
        return filteredData;
    }

    /**
     * Callback used when the search changes
     *
     * @param str The new search string
     */
    onSearchStringChange(str: string) {
        this.setState({
            currentlyDisplayedData: this.filterData(str)
        })
    }

    /**
     * Gets the modal content depending on the given article
     *
     * @param item The article to display
     * @return {*}
     */
    getModalItemContent(item: Object) {
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <Title>{item.name}</Title>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: 10,
                }}>
                    <Subheading style={{
                        color: this.getStockColor(parseInt(item.quantity)),
                    }}>
                        {item.quantity + ' ' + i18n.t('proximoScreen.inStock')}
                    </Subheading>
                    <Subheading style={{marginLeft: 'auto'}}>{item.price}€</Subheading>
                </View>

                <ScrollView>
                    <View style={{width: '100%', height: 150, marginTop: 20, marginBottom: 20}}>
                        <Image style={{flex: 1, resizeMode: "contain"}}
                               source={{uri: item.image}}/>
                    </View>
                    <Text>{item.description}</Text>
                </ScrollView>
            </View>
        );
    }

    /**
     * Gets the modal content to display a sort menu
     *
     * @return {*}
     */
    getModalSortMenu() {
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <Title style={{marginBottom: 10}}>{i18n.t('proximoScreen.sortOrder')}</Title>
                <RadioButton.Group
                    onValueChange={value => this.setSortMode(value)}
                    value={this.state.currentSortMode}
                >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <RadioButton value={1}/>
                        <Text>{i18n.t('proximoScreen.sortPrice')}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <RadioButton value={2}/>
                        <Text>{i18n.t('proximoScreen.sortPriceReverse')}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <RadioButton value={3}/>
                        <Text>{i18n.t('proximoScreen.sortName')}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <RadioButton value={4}/>
                        <Text>{i18n.t('proximoScreen.sortNameReverse')}</Text>
                    </View>
                </RadioButton.Group>
            </View>
        );
    }

    /**
     * Callback used when clicking an article in the list.
     * It opens the modal to show detailed information about the article
     *
     * @param item The article pressed
     */
    onListItemPress(item: Object) {
        this.setState({
            modalCurrentDisplayItem: this.getModalItemContent(item)
        });
        if (this.modalRef) {
            this.modalRef.open();
        }
    }

    /**
     * Gets a render item for the given article
     *
     * @param item The article to render
     * @return {*}
     */
    renderItem({item}: Object) {
        const onPress = this.onListItemPress.bind(this, item);
        return (
            <List.Item
                title={item.name}
                description={item.quantity + ' ' + i18n.t('proximoScreen.inStock')}
                descriptionStyle={{color: this.getStockColor(parseInt(item.quantity))}}
                onPress={onPress}
                left={() => <Avatar.Image style={{backgroundColor: 'transparent'}} size={64}
                                          source={{uri: item.image}}/>}
                right={() =>
                    <Text style={{fontWeight: "bold"}}>
                        {item.price}€
                    </Text>}
            />
        );
    }

    /**
     * Extracts a key for the given article
     *
     * @param item The article to extract the key from
     * @return {*} The extracted key
     */
    keyExtractor(item: Object) {
        return item.name + item.code;
    }

    /**
     * Callback used when receiving the modal ref
     *
     * @param ref
     */
    onModalRef(ref: Object) {
        this.modalRef = ref;
    }

    render() {
        return (
            <View style={{
                height: '100%'
            }}>
                <CustomModal onRef={this.onModalRef}>
                    {this.state.modalCurrentDisplayItem}
                </CustomModal>
                <PureFlatList
                    data={this.state.currentlyDisplayedData}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    updateData={this.state.currentSortMode}
                />
            </View>
        );
    }
}

export default withTheme(ProximoListScreen);
