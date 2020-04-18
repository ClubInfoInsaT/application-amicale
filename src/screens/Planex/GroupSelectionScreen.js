// @flow

import * as React from 'react';
import {Platform} from "react-native";
import i18n from "i18n-js";
import {Searchbar, withTheme} from "react-native-paper";
import {stringMatchQuery} from "../../utils/Search";
import WebSectionList from "../../components/Screens/WebSectionList";
import GroupListAccordion from "../../components/Lists/PlanexGroups/GroupListAccordion";
import AsyncStorageManager from "../../managers/AsyncStorageManager";

const LIST_ITEM_HEIGHT = 70;

type Props = {
    navigation: Object,
    route: Object,
    theme: Object,
}

type State = {
    currentSearchString: string,
    favoriteGroups: Array<Object>,
};

function sortName(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
    return 0;
}

const GROUPS_URL = 'http://planex.insa-toulouse.fr/wsAdeGrp.php?projectId=1';
const REPLACE_REGEX = /_/g;

/**
 * Class defining proximo's article list of a certain category.
 */
class GroupSelectionScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            currentSearchString: '',
            favoriteGroups: JSON.parse(AsyncStorageManager.getInstance().preferences.planexFavoriteGroups.current),
        };
    }

    /**
     * Creates the header content
     */
    componentDidMount() {
        this.props.navigation.setOptions({
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
                placeholder={i18n.t('proximoScreen.search')}
                onChangeText={this.onSearchStringChange}
            />
        );
    };

    /**
     * Callback used when the search changes
     *
     * @param str The new search string
     */
    onSearchStringChange = (str: string) => {
        this.setState({currentSearchString: str})
    };

    /**
     * Callback used when clicking an article in the list.
     * It opens the modal to show detailed information about the article
     *
     * @param item The article pressed
     */
    onListItemPress = (item: Object) => {
        this.props.navigation.navigate("planex", {
            screen: "index",
            params: {group: item}
        });
    };

    onListFavoritePress = (item: Object) => {
        this.updateGroupFavorites(item);
    };

    isGroupInFavorites(group: Object) {
        let isFav = false;
        for (let i = 0; i < this.state.favoriteGroups.length; i++) {
            if (group.id === this.state.favoriteGroups[i].id) {
                isFav = true;
                break;
            }
        }
        return isFav;
    }

    removeGroupFromFavorites(favorites: Array<Object>, group: Object) {
        for (let i = 0; i < favorites.length; i++) {
            if (group.id === favorites[i].id) {
                favorites.splice(i, 1);
                break;
            }
        }
    }

    addGroupToFavorites(favorites: Array<Object>, group: Object) {
        group.isFav = true;
        favorites.push(group);
        favorites.sort(sortName);
    }

    updateGroupFavorites(group: Object) {
        let newFavorites = [...this.state.favoriteGroups]
        if (this.isGroupInFavorites(group))
            this.removeGroupFromFavorites(newFavorites, group);
        else
            this.addGroupToFavorites(newFavorites, group);
        this.setState({favoriteGroups: newFavorites})
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.planexFavoriteGroups.key,
            JSON.stringify(newFavorites));
    }

    shouldDisplayAccordion(item: Object) {
        let shouldDisplay = false;
        for (let i = 0; i < item.content.length; i++) {
            if (stringMatchQuery(item.content[i].name, this.state.currentSearchString)) {
                shouldDisplay = true;
                break;
            }
        }
        return shouldDisplay;
    }

    /**
     * Gets a render item for the given article
     *
     * @param item The article to render
     * @return {*}
     */
    renderItem = ({item}: Object) => {
        if (this.shouldDisplayAccordion(item)) {
            return (
                <GroupListAccordion
                    item={item}
                    onGroupPress={this.onListItemPress}
                    onFavoritePress={this.onListFavoritePress}
                    currentSearchString={this.state.currentSearchString}
                    favoriteNumber={this.state.favoriteGroups.length}
                    height={LIST_ITEM_HEIGHT}
                />
            );
        } else
            return null;
    };

    generateData(fetchedData: Object) {
        let data = [];
        for (let key in fetchedData) {
            this.formatGroups(fetchedData[key]);
            data.push(fetchedData[key]);
        }
        data.sort(sortName);
        data.unshift({name: "FAVORITES", id: "0", content: this.state.favoriteGroups});
        return data;
    }

    formatGroups(item: Object) {
        for (let i = 0; i < item.content.length; i++) {
            item.content[i].name = item.content[i].name.replace(REPLACE_REGEX, " ")
            item.content[i].isFav = this.isGroupInFavorites(item.content[i]);
        }
    }

    /**
     * Creates the dataset to be used in the FlatList
     *
     * @param fetchedData
     * @return {*}
     * */
    createDataset = (fetchedData: Object) => {
        return [
            {
                title: '',
                data: this.generateData(fetchedData)
            }
        ];
    }

    render() {
        return (
            <WebSectionList
                {...this.props}
                createDataset={this.createDataset}
                autoRefreshTime={0}
                refreshOnFocus={false}
                fetchUrl={GROUPS_URL}
                renderItem={this.renderItem}
                updateData={this.state.currentSearchString + this.state.favoriteGroups.length}
                itemHeight={LIST_ITEM_HEIGHT}
            />
        );
    }
}

export default withTheme(GroupSelectionScreen);
