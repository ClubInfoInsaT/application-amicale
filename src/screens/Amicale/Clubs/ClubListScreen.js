// @flow

import * as React from 'react';
import {FlatList, Platform} from "react-native";
import {Chip, Searchbar, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../../components/Amicale/AuthenticatedScreen";
import i18n from "i18n-js";
import ClubListItem from "../../../components/Lists/ClubListItem";
import {isItemInCategoryFilter, stringMatchQuery} from "../../../utils/Search";
import ClubListHeader from "../../../components/Lists/ClubListHeader";
import HeaderButton from "../../../components/Custom/HeaderButton";

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {
    currentlySelectedCategories: Array<string>,
    currentSearchString: string,
}

const LIST_ITEM_HEIGHT = 96;

class ClubListScreen extends React.Component<Props, State> {

    state = {
        currentlySelectedCategories: [],
        currentSearchString: '',
    };

    colors: Object;

    categories: Array<Object>;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

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
                placeholder={i18n.t('proximoScreen.search')}
                onChangeText={this.onSearchStringChange}
            />
        );
    };

    /**
     * Gets the header button
     * @return {*}
     */
    getHeaderButtons = () => {
        const onPress = () => this.props.navigation.navigate("ClubAboutScreen");
        return <HeaderButton icon={'information'} onPress={onPress}/>;
    };

    /**
     * Callback used when the search changes
     *
     * @param str The new search string
     */
    onSearchStringChange = (str: string) => {
        this.updateFilteredData(str, null);
    };

    keyExtractor = (item: Object) => {
        return item.id.toString();
    };

    itemLayout = (data, index) => ({length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index});

    getScreen = (data: Object) => {
        this.categories = data[0].categories;
        return (
            //$FlowFixMe
            <FlatList
                data={data[0].clubs}
                keyExtractor={this.keyExtractor}
                renderItem={this.getRenderItem}
                ListHeaderComponent={this.getListHeader()}
                // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
                removeClippedSubviews={true}
                getItemLayout={this.itemLayout}
            />
        )
    };

    onChipSelect(id: string) {
        this.updateFilteredData(null, id);
    }

    updateFilteredData(filterStr: string | null, categoryId: string | null) {
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

    getChipRender = (category: Object, key: string) => {
        const onPress = this.onChipSelect.bind(this, category.id);
        return <Chip
            selected={isItemInCategoryFilter(this.state.currentlySelectedCategories, [category.id])}
            mode={'outlined'}
            onPress={onPress}
            style={{marginRight: 5, marginBottom: 5}}
            key={key}
        >
            {category.name}
        </Chip>;
    };

    getListHeader() {
        return <ClubListHeader
            categories={this.categories}
            categoryRender={this.getChipRender}
        />;
    }

    getCategoryOfId = (id: number) => {
        for (let i = 0; i < this.categories.length; i++) {
            if (id === this.categories[i].id)
                return this.categories[i];
        }
    };

    shouldRenderItem(item) {
        let shouldRender = this.state.currentlySelectedCategories.length === 0
            || isItemInCategoryFilter(this.state.currentlySelectedCategories, item.category);
        if (shouldRender)
            shouldRender = stringMatchQuery(item.name, this.state.currentSearchString);
        return shouldRender;
    }

    getRenderItem = ({item}: Object) => {
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
    onListItemPress(item: Object) {
        this.props.navigation.navigate("ClubDisplayScreen", {data: item, categories: this.categories});
    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
                links={[
                    {
                        link: 'clubs/list',
                        mandatory: true,
                    }
                ]}
                renderFunction={this.getScreen}
            />
        );
    }
}

export default withTheme(ClubListScreen);
