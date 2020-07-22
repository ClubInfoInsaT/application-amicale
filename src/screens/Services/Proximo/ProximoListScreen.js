// @flow

import * as React from 'react';
import {Image, Platform, ScrollView, View} from "react-native";
import i18n from "i18n-js";
import CustomModal from "../../../components/Overrides/CustomModal";
import {RadioButton, Searchbar, Subheading, Text, Title, withTheme} from "react-native-paper";
import {stringMatchQuery} from "../../../utils/Search";
import ProximoListItem from "../../../components/Lists/Proximo/ProximoListItem";
import MaterialHeaderButtons, {Item} from "../../../components/Overrides/CustomHeaderButton";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import CollapsibleFlatList from "../../../components/Collapsible/CollapsibleFlatList";

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

const LIST_ITEM_HEIGHT = 84;

type Props = {
    navigation: StackNavigationProp,
    route: { params: { data: { data: Object }, shouldFocusSearchBar: boolean } },
    theme: CustomTheme,
}

type State = {
    currentSortMode: number,
    modalCurrentDisplayItem: React.Node,
    currentSearchString: string,
};

/**
 * Class defining proximo's article list of a certain category.
 */
class ProximoListScreen extends React.Component<Props, State> {

    modalRef: Object;
    listData: Array<Object>;
    shouldFocusSearchBar: boolean;

    constructor(props) {
        super(props);
        this.listData = this.props.route.params['data']['data'].sort(sortName);
        this.shouldFocusSearchBar = this.props.route.params['shouldFocusSearchBar'];
        this.state = {
            currentSearchString: '',
            currentSortMode: 3,
            modalCurrentDisplayItem: null,
        };
    }


    /**
     * Creates the header content
     */
    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: this.getSortMenuButton,
            headerTitle: this.getSearchBar,
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
    getSearchBar = () => {
        return (
            <Searchbar
                placeholder={i18n.t('screens.proximo.search')}
                onChangeText={this.onSearchStringChange}
            />
        );
    };

    /**
     * Gets the sort menu header button
     *
     * @return {*}
     */
    getSortMenuButton = () => {
        return <MaterialHeaderButtons>
            <Item title="main" iconName="sort" onPress={this.onSortMenuPress}/>
        </MaterialHeaderButtons>;
    };

    /**
     * Callback used when clicking on the sort menu button.
     * It will open the modal to show a sort selection
     */
    onSortMenuPress = () => {
        this.setState({
            modalCurrentDisplayItem: this.getModalSortMenu()
        });
        if (this.modalRef) {
            this.modalRef.open();
        }
    };

    /**
     * Sets the current sort mode.
     *
     * @param mode The number representing the mode
     */
    setSortMode(mode: number) {
        this.setState({
            currentSortMode: mode,
        });
        switch (mode) {
            case 1:
                this.listData.sort(sortPrice);
                break;
            case 2:
                this.listData.sort(sortPriceReverse);
                break;
            case 3:
                this.listData.sort(sortName);
                break;
            case 4:
                this.listData.sort(sortNameReverse);
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
            color = this.props.theme.colors.success;
        else if (availableStock > 0)
            color = this.props.theme.colors.warning;
        else
            color = this.props.theme.colors.danger;
        return color;
    }

    /**
     * Callback used when the search changes
     *
     * @param str The new search string
     */
    onSearchStringChange = (str: string) => {
        this.setState({currentSearchString: str})
    };

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
                        {item.quantity + ' ' + i18n.t('screens.proximo.inStock')}
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
                <Title style={{marginBottom: 10}}>{i18n.t('screens.proximo.sortOrder')}</Title>
                <RadioButton.Group
                    onValueChange={value => this.setSortMode(value)}
                    value={this.state.currentSortMode}
                >
                    <RadioButton.Item label={i18n.t('screens.proximo.sortPrice')} value={1}/>
                    <RadioButton.Item label={i18n.t('screens.proximo.sortPriceReverse')} value={2}/>
                    <RadioButton.Item label={i18n.t('screens.proximo.sortName')} value={3}/>
                    <RadioButton.Item label={i18n.t('screens.proximo.sortNameReverse')} value={4}/>
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
    renderItem = ({item}: Object) => {
        if (stringMatchQuery(item.name, this.state.currentSearchString)) {
            const onPress = this.onListItemPress.bind(this, item);
            const color = this.getStockColor(parseInt(item.quantity));
            return (
                <ProximoListItem
                    item={item}
                    onPress={onPress}
                    color={color}
                    height={LIST_ITEM_HEIGHT}
                />
            );
        } else
            return null;
    };

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
    onModalRef = (ref: Object) => {
        this.modalRef = ref;
    };

    itemLayout = (data, index) => ({length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index});

    render() {
        return (
            <View style={{
                height: '100%'
            }}>
                <CustomModal onRef={this.onModalRef}>
                    {this.state.modalCurrentDisplayItem}
                </CustomModal>
                <CollapsibleFlatList
                    data={this.listData}
                    extraData={this.state.currentSearchString + this.state.currentSortMode}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
                    removeClippedSubviews={true}
                    getItemLayout={this.itemLayout}
                    initialNumToRender={10}
                />
            </View>
        );
    }
}

export default withTheme(ProximoListScreen);
