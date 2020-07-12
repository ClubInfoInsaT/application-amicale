// @flow

import * as React from 'react';
import {Animated, Platform} from "react-native";
import {Searchbar} from 'react-native-paper';
import AuthenticatedScreen from "../../../components/Amicale/AuthenticatedScreen";
import i18n from "i18n-js";
import ClubListItem from "../../../components/Lists/Clubs/ClubListItem";
import {isItemInCategoryFilter, stringMatchQuery} from "../../../utils/Search";
import ClubListHeader from "../../../components/Lists/Clubs/ClubListHeader";
import MaterialHeaderButtons, {Item} from "../../../components/Overrides/CustomHeaderButton";
import {withCollapsible} from "../../../utils/withCollapsible";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import {Collapsible} from "react-navigation-collapsible";

export type category = {
    id: number,
    name: string,
};

export type club = {
    id: number,
    name: string,
    description: string,
    logo: string,
    email: string | null,
    category: [number, number],
    responsibles: Array<string>,
};

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
    collapsibleStack: Collapsible,
}

type State = {
    currentlySelectedCategories: Array<number>,
    currentSearchString: string,
}

const LIST_ITEM_HEIGHT = 96;

class ClubListScreen extends React.Component<Props, State> {

    state = {
        currentlySelectedCategories: [],
        currentSearchString: '',
    };

    categories: Array<category>;

    /**
     * Creates the header content
     */
    componentDidMount() {
        this.props.navigation.setOptions({
            headerTitle: this.getSearchBar,
            headerRight: this.getHeaderButtons,
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
     * Gets the header button
     * @return {*}
     */
    getHeaderButtons = () => {
        const onPress = () => this.props.navigation.navigate("club-about");
        return <MaterialHeaderButtons>
            <Item title="main" iconName="information" onPress={onPress}/>
        </MaterialHeaderButtons>;
    };

    /**
     * Callback used when the search changes
     *
     * @param str The new search string
     */
    onSearchStringChange = (str: string) => {
        this.updateFilteredData(str, null);
    };

    keyExtractor = (item: club) => item.id.toString();

    itemLayout = (data, index) => ({length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index});

    getScreen = (data: Array<{ categories: Array<category>, clubs: Array<club> } | null>) => {
        let categoryList = [];
        let clubList = [];
        if (data[0] != null) {
            categoryList = data[0].categories;
            clubList = data[0].clubs;
        }
        this.categories = categoryList;
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        return (
            <Animated.FlatList
                data={clubList}
                keyExtractor={this.keyExtractor}
                renderItem={this.getRenderItem}
                ListHeaderComponent={this.getListHeader()}
                // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
                removeClippedSubviews={true}
                getItemLayout={this.itemLayout}
                // Animations
                onScroll={onScroll}
                contentContainerStyle={{paddingTop: containerPaddingTop}}
                scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
            />
        )
    };

    onChipSelect = (id: number) => this.updateFilteredData(null, id);

    /**
     * Updates the search string and category filter, saving them to the State.
     *
     * If the given category is already in the filter, it removes it.
     * Otherwise it adds it to the filter.
     *
     * @param filterStr The new filter string to use
     * @param categoryId The category to add/remove from the filter
     */
    updateFilteredData(filterStr: string | null, categoryId: number | null) {
        let newCategoriesState = [...this.state.currentlySelectedCategories];
        let newStrState = this.state.currentSearchString;
        if (filterStr !== null)
            newStrState = filterStr;
        if (categoryId !== null) {
            let index = newCategoriesState.indexOf(categoryId);
            if (index === -1)
                newCategoriesState.push(categoryId);
            else
                newCategoriesState.splice(index, 1);
        }
        if (filterStr !== null || categoryId !== null)
            this.setState({
                currentSearchString: newStrState,
                currentlySelectedCategories: newCategoriesState,
            })
    }

    /**
     * Gets the list header, with controls to change the categories filter
     *
     * @returns {*}
     */
    getListHeader() {
        return <ClubListHeader
            categories={this.categories}
            selectedCategories={this.state.currentlySelectedCategories}
            onChipSelect={this.onChipSelect}
        />;
    }

    /**
     * Gets the category object of the given ID
     *
     * @param id The ID of the category to find
     * @returns {*}
     */
    getCategoryOfId = (id: number) => {
        for (let i = 0; i < this.categories.length; i++) {
            if (id === this.categories[i].id)
                return this.categories[i];
        }
    };

    /**
     * Checks if the given item should be rendered according to current name and category filters
     *
     * @param item The club to check
     * @returns {boolean}
     */
    shouldRenderItem(item: club) {
        let shouldRender = this.state.currentlySelectedCategories.length === 0
            || isItemInCategoryFilter(this.state.currentlySelectedCategories, item.category);
        if (shouldRender)
            shouldRender = stringMatchQuery(item.name, this.state.currentSearchString);
        return shouldRender;
    }

    getRenderItem = ({item}: { item: club }) => {
        const onPress = this.onListItemPress.bind(this, item);
        if (this.shouldRenderItem(item)) {
            return (
                <ClubListItem
                    categoryTranslator={this.getCategoryOfId}
                    item={item}
                    onPress={onPress}
                    height={LIST_ITEM_HEIGHT}
                />
            );
        } else
            return null;
    };

    /**
     * Callback used when clicking an article in the list.
     * It opens the modal to show detailed information about the article
     *
     * @param item The article pressed
     */
    onListItemPress(item: club) {
        this.props.navigation.navigate("club-information", {data: item, categories: this.categories});
    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
                requests={[
                    {
                        link: 'clubs/list',
                        params: {},
                        mandatory: true,
                    }
                ]}
                renderFunction={this.getScreen}
            />
        );
    }
}

export default withCollapsible(ClubListScreen);
