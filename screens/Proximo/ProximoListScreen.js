// @flow

import * as React from 'react';
import {FlatList, Image, ScrollView, View} from "react-native";
import i18n from "i18n-js";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import ThemeManager from "../../utils/ThemeManager";
import {Modalize} from 'react-native-modalize';
import {Avatar, Divider, IconButton, List, Menu, Searchbar, Subheading, Text, Title} from "react-native-paper";

const sortMode = {
    price: "0",
    name: '1',
};

function sortPrice(a, b) {
    return a.price - b.price;
}

function sortPriceReverse(a, b) {
    return b.price - a.price;
}

function sortName(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function sortNameReverse(a, b) {
    if (a.name < b.name)
        return 1;
    if (a.name > b.name)
        return -1;
    return 0;
}

type Props = {
    navigation: Object,
    route: Object,
}

type State = {
    currentSortMode: string,
    isSortReversed: boolean,
    sortPriceIcon: React.Node,
    sortNameIcon: React.Node,
    modalCurrentDisplayItem: Object,
    currentlyDisplayedData: Array<Object>,
    menuVisible: boolean,
};

/**
 * Class defining proximo's article list of a certain category.
 */
export default class ProximoListScreen extends React.Component<Props, State> {

    modalRef: { current: null | Modalize };
    originalData: Array<Object>;
    shouldFocusSearchBar: boolean;

    onSearchStringChange: Function;
    onSelectSortModeName: Function;
    onSelectSortModePrice: Function;
    onSortMenuPress: Function;
    onSortMenuDismiss: Function;
    renderItem: Function;

    constructor(props: any) {
        super(props);
        this.modalRef = React.createRef();
        this.originalData = this.props.route.params['data']['data'];
        this.shouldFocusSearchBar = this.props.route.params['shouldFocusSearchBar'];
        this.state = {
            currentlyDisplayedData: this.originalData,
            currentSortMode: sortMode.price,
            isSortReversed: false,
            sortPriceIcon: '',
            sortNameIcon: '',
            modalCurrentDisplayItem: {},
            menuVisible: false,
        };

        this.onSearchStringChange = this.onSearchStringChange.bind(this);
        this.onSelectSortModeName = this.onSelectSortModeName.bind(this);
        this.onSelectSortModePrice = this.onSelectSortModePrice.bind(this);
        this.onSortMenuPress = this.onSortMenuPress.bind(this);
        this.onSortMenuDismiss = this.onSortMenuPress.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }


    /**
     * Sets the sort mode based on the one selected.
     * If the selected mode is the current one, reverse it.
     *
     * @param mode The string representing the mode
     */
    sortModeSelected(mode: string) {
        let isReverse = this.state.isSortReversed;
        if (mode === this.state.currentSortMode) // reverse mode
            isReverse = !isReverse; // this.state not updating on this function cycle
        else
            isReverse = false;
        this.setSortMode(mode, isReverse);
    }

    /**
     * Set the current sort mode.
     *
     * @param mode The string representing the mode
     * @param isReverse Whether to use a reverse sort
     */
    setSortMode(mode: string, isReverse: boolean) {
        this.setState({
            currentSortMode: mode,
            isSortReversed: isReverse
        });
        let data = this.state.currentlyDisplayedData;
        switch (mode) {
            case sortMode.price:
                if (isReverse) {
                    data.sort(sortPriceReverse);
                } else {
                    data.sort(sortPrice);
                }
                break;
            case sortMode.name:
                if (isReverse) {
                    data.sort(sortNameReverse);
                } else {
                    data.sort(sortName);
                }
                break;
        }
        this.setupSortIcons(mode, isReverse);
    }

    /**
     * Set the sort mode from state when components are ready
     */
    componentDidMount() {
        const button = this.getSortMenu.bind(this);
        const title = this.getSearchBar.bind(this);
        this.props.navigation.setOptions({
            headerRight: button,
            headerTitle: title,
        });
        this.setSortMode(this.state.currentSortMode, this.state.isSortReversed);
    }

    getSearchBar() {
        return (
            <Searchbar
                placeholder={i18n.t('proximoScreen.search')}
                onChangeText={this.onSearchStringChange}
            />
        );
    }

    /**
     * get color depending on quantity available
     *
     * @param availableStock
     * @return
     */
    getStockColor(availableStock: number) {
        let color: string;
        if (availableStock > 3)
            color = ThemeManager.getCurrentThemeVariables().success;
        else if (availableStock > 0)
            color = ThemeManager.getCurrentThemeVariables().warning;
        else
            color = ThemeManager.getCurrentThemeVariables().danger;
        return color;
    }

    /**
     * Set the sort menu icon based on the given mode.
     *
     * @param mode The string representing the mode
     * @param isReverse Whether to use a reversed icon
     */
    setupSortIcons(mode: string, isReverse: boolean) {
        const downSortIcon =
            <MaterialCommunityIcons
                name={'sort-descending'}
                size={26}/>;
        const upSortIcon =
            <MaterialCommunityIcons
                name={'sort-ascending'}
                size={26}/>;
        switch (mode) {
            case sortMode.price:
                this.setState({sortNameIcon: ''});
                if (isReverse) {
                    this.setState({sortPriceIcon: upSortIcon});
                } else {
                    this.setState({sortPriceIcon: downSortIcon});
                }
                break;
            case sortMode.name:
                this.setState({sortPriceIcon: ''});
                if (isReverse) {
                    this.setState({sortNameIcon: upSortIcon});
                } else {
                    this.setState({sortNameIcon: downSortIcon});
                }
                break;
        }
    }


    sanitizeString(str: string) {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Returns only the articles whose name contains str. Case and accents insensitive.
     * @param str
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

    onSearchStringChange(str: string) {
        this.setState({
            currentlyDisplayedData: this.filterData(str)
        })
    }

    getModalContent() {
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <Title>{this.state.modalCurrentDisplayItem.name}</Title>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: 10,
                }}>
                    <Subheading style={{
                        color: this.getStockColor(parseInt(this.state.modalCurrentDisplayItem.quantity)),
                    }}>
                        {this.state.modalCurrentDisplayItem.quantity + ' ' + i18n.t('proximoScreen.inStock')}
                    </Subheading>
                    <Subheading style={{marginLeft: 'auto'}}>{this.state.modalCurrentDisplayItem.price}€</Subheading>
                </View>

                <ScrollView>
                    <View style={{width: '100%', height: 150, marginTop: 20, marginBottom: 20}}>
                        <Image style={{flex: 1, resizeMode: "contain"}}
                               source={{uri: this.state.modalCurrentDisplayItem.image}}/>
                    </View>
                    <Text>{this.state.modalCurrentDisplayItem.description}</Text>
                </ScrollView>
            </View>
        );
    }

    onListItemPress(item: Object) {
        this.setState({
            modalCurrentDisplayItem: item
        });
        if (this.modalRef.current) {
            this.modalRef.current.open();
        }
    }

    onSelectSortModeName() {
        this.sortModeSelected(sortMode.name);
    }

    onSelectSortModePrice() {
        this.sortModeSelected(sortMode.price);
    }

    onSortMenuPress() {
        this.setState({menuVisible: true});
        console.log('pressed');
    }

    onSortMenuDismiss() {
        this.setState({menuVisible: false});
    }

    getSortMenu() {
        return (
            <Menu
                visible={this.state.menuVisible}
                onDismiss={this.onSortMenuDismiss}
                anchor={
                    <IconButton
                        icon="sort"
                        color={ThemeManager.getCurrentThemeVariables().text}
                        size={26}
                        onPress={this.onSortMenuPress}
                    />
                }
            >
                <Menu.Item onPress={this.onSelectSortModeName} title={i18n.t('proximoScreen.sortName')}/>
                <Divider/>
                <Menu.Item onPress={this.onSelectSortModePrice} title={i18n.t('proximoScreen.sortPrice')}/>
            </Menu>
        );
    }

    renderItem({item}: Object) {
        const onPress = this.onListItemPress.bind(this, item);
        return (
            <List.Item
                title={item.name}
                description={item.quantity + ' ' + i18n.t('proximoScreen.inStock')}
                descriptionStyle={{color: this.getStockColor(parseInt(item.quantity))}}
                onPress={onPress}
                left={props => <Avatar.Image style={{backgroundColor: 'transparent'}} size={64} source={{uri: item.image}}/>}
                right={props =>
                    <Text style={{fontWeight: "bold"}}>
                        {item.price}€
                    </Text>}
            />
        );
    }

    keyExtractor(item: Object) {
        return item.name + item.code;
    }

    render() {
        // console.log("rendering ProximoListScreen");
        return (
            <View>
                <Modalize ref={this.modalRef}
                          adjustToContentHeight
                          modalStyle={{backgroundColor: ThemeManager.getCurrentThemeVariables().card}}>
                    {this.getModalContent()}
                </Modalize>
                <FlatList
                    data={this.state.currentlyDisplayedData}
                    extraData={this.state.currentlyDisplayedData}
                    keyExtractor={this.keyExtractor}
                    style={{minHeight: 300, width: '100%'}}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}
