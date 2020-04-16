// @flow

import * as React from 'react';
import {Platform, View} from "react-native";
import i18n from "i18n-js";
import {Searchbar, withTheme} from "react-native-paper";
import {stringMatchQuery} from "../utils/Search";
import WebSectionList from "../components/Lists/WebSectionList";
import GroupListAccordion from "../components/Lists/GroupListAccordion";

const LIST_ITEM_HEIGHT = 70;

type Props = {
    navigation: Object,
    route: Object,
    theme: Object,
    collapsibleStack: Object,
}

type State = {
    currentSearchString: string,
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
                    currentSearchString={this.state.currentSearchString}
                    height={LIST_ITEM_HEIGHT}
                />
            );
        } else
            return null;
    };

    generateData(fetchedData: Object) {
        let data = [];
        for (let key in fetchedData) {
            this.formatGroupNames(fetchedData[key]);
            data.push(fetchedData[key]);
        }
        data.sort(sortName);
        return data;
    }

    formatGroupNames(item: Object) {
        for (let i = 0; i < item.content.length; i++) {
            item.content[i].name = item.content[i].name.replace(REPLACE_REGEX, " ")
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
            <View style={{
                height: '100%'
            }}>
                <WebSectionList
                    {...this.props}
                    createDataset={this.createDataset}
                    autoRefreshTime={0}
                    refreshOnFocus={false}
                    fetchUrl={GROUPS_URL}
                    renderItem={this.renderItem}
                    updateData={this.state.currentSearchString}
                    itemHeight={LIST_ITEM_HEIGHT}
                />
            </View>
        );
    }
}

export default withTheme(GroupSelectionScreen);
