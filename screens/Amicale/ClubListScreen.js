// @flow

import * as React from 'react';
import {FlatList, Platform, View} from "react-native";
import {Chip, Searchbar, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../components/Amicale/AuthenticatedScreen";
import i18n from "i18n-js";
import ClubListItem from "../../components/Lists/ClubListItem";

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {
    currentlySelectedCategories: Array<string>,
    currentSearchString: string,
}

class ClubListScreen extends React.Component<Props, State> {

    state = {
        currentlySelectedCategories: [],
        currentSearchString: '',
    };

    colors: Object;

    getRenderItem: Function;
    originalData: Array<Object>;
    categories: Array<Object>;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    /**
     * Creates the header content
     */
    componentDidMount() {
        const title = this.getSearchBar.bind(this);
        this.props.navigation.setOptions({
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
     * Callback used when the search changes
     *
     * @param str The new search string
     */
    onSearchStringChange = (str: string) => {
        this.updateFilteredData(this.sanitizeString(str), null);
    };

    /**
     * Sanitizes the given string to improve search performance
     *
     * @param str The string to sanitize
     * @return {string} The sanitized string
     */
    sanitizeString(str: string): string {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    keyExtractor = (item: Object) => {
        return item.name + item.logo;
    };

    getScreen = (data: Object) => {
        this.categories = data.categories;
        return (
            <FlatList
                data={data.clubs}
                keyExtractor={this.keyExtractor}
                renderItem={this.getRenderItem}
                ListHeaderComponent={this.getListHeader()}
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
                newCategoriesState.splice(index);
        }
        if (filterStr !== null || categoryId !== null)
            this.setState({
                currentSearchString: newStrState,
                currentlySelectedCategories: newCategoriesState,
            })
    }

    isItemInCategoryFilter(categories: Array<string>) {
        for (const category of categories) {
            if (this.state.currentlySelectedCategories.indexOf(category) !== -1)
                return true;
        }
        return false;
    }

    getChipRender = (category: Object) => {
        const onPress = this.onChipSelect.bind(this, category.id);
        return <Chip
            selected={this.isItemInCategoryFilter([category.id])}
            mode={'outlined'}
            onPress={onPress}
            style={{marginRight: 5, marginBottom: 5}}
        >
            {category.name}
        </Chip>;
    };

    getListHeader() {
        let final = [];
        for (let i = 0; i < this.categories.length; i++) {
            final.push(this.getChipRender(this.categories[i]));
        }
        return <View style={{
            justifyContent: 'space-around',
            flexDirection: 'row',
            flexWrap: 'wrap',
            margin: 10,
        }}>{final}</View>;
    }

    getCategoryOfId = (id: number) => {
        for (let i = 0; i < this.categories.length; i++) {
            if (id === this.categories[i].id)
                return this.categories[i];
        }
    };

    shouldRenderItem(item) {
        let shouldRender = this.state.currentlySelectedCategories.length === 0
            || this.isItemInCategoryFilter(item.category);
        if (shouldRender)
            shouldRender = this.sanitizeString(item.name).includes(this.state.currentSearchString);
        return shouldRender;
    }

    getRenderItem = ({item}: Object) => {
        const onPress = this.onListItemPress.bind(this, item);
        if (this.shouldRenderItem(item)) {
            return (
                <ClubListItem
                    categoryTranslator={this.getCategoryOfId}
                    chipRender={this.getChipRender}
                    item={item}
                    onPress={onPress}
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
                link={'https://www.amicale-insat.fr/api/clubs/list'}
                renderFunction={this.getScreen}
            />
        );
    }
}

export default withTheme(ClubListScreen);
