// @flow

import * as React from 'react';
import {FlatList, Image, ScrollView, View} from "react-native";
import i18n from "i18n-js";
import ThemeManager from "../../utils/ThemeManager";
import CustomModal from "../../components/CustomModal";
import {Avatar, IconButton, List, RadioButton, Searchbar, Subheading, Text, Title} from "react-native-paper";

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
export default class ProximoListScreen extends React.Component<Props, State> {

    modalRef: Object;
    originalData: Array<Object>;
    shouldFocusSearchBar: boolean;

    onSearchStringChange: Function;
    onSortMenuPress: Function;
    renderItem: Function;
    onModalRef: Function;

    constructor(props: any) {
        super(props);
        this.originalData = this.props.route.params['data']['data'];
        this.shouldFocusSearchBar = this.props.route.params['shouldFocusSearchBar'];
        this.state = {
            currentlyDisplayedData: this.originalData.sort(sortPrice),
            currentSortMode: 1,
            modalCurrentDisplayItem: null,
        };

        this.onSearchStringChange = this.onSearchStringChange.bind(this);
        this.onSortMenuPress = this.onSortMenuPress.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.onModalRef = this.onModalRef.bind(this);
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
            headerTitleContainerStyle: {marginHorizontal: 0, right: 50, left: 50},
        });
    }

    /**
     * Set the current sort mode.
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

    getModalSortMenu() {
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <Title>Sort Order</Title>
                <RadioButton.Group
                    onValueChange={value => this.setSortMode(value)}
                    value={this.state.currentSortMode}
                >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{i18n.t('proximoScreen.sortPrice')}</Text>
                        <RadioButton value={1}/>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{i18n.t('proximoScreen.sortPriceReverse')}</Text>
                        <RadioButton value={2}/>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{i18n.t('proximoScreen.sortName')}</Text>
                        <RadioButton value={3}/>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{i18n.t('proximoScreen.sortNameReverse')}</Text>
                        <RadioButton value={4}/>
                    </View>
                </RadioButton.Group>
            </View>
        );
    }

    onListItemPress(item: Object) {
        this.setState({
            modalCurrentDisplayItem: this.getModalItemContent(item)
        });
        if (this.modalRef) {
            this.modalRef.open();
        }
    }

    onSortMenuPress() {
        this.setState({
            modalCurrentDisplayItem: this.getModalSortMenu()
        });
        if (this.modalRef) {
            this.modalRef.open();
        }
    }

    getSortMenu() {
        return (
            <IconButton
                icon="sort"
                color={ThemeManager.getCurrentThemeVariables().text}
                size={26}
                onPress={this.onSortMenuPress}
            />
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
                left={() => <Avatar.Image style={{backgroundColor: 'transparent'}} size={64}
                                             source={{uri: item.image}}/>}
                right={() =>
                    <Text style={{fontWeight: "bold"}}>
                        {item.price}€
                    </Text>}
            />
        );
    }

    keyExtractor(item: Object) {
        return item.name + item.code;
    }

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
