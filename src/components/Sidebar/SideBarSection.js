// @flow

import * as React from 'react';
import {FlatList} from "react-native";
import {Drawer, List, withTheme} from 'react-native-paper';
import {openBrowser} from "../../utils/WebBrowser";

type Props = {
    navigation: Object,
    startOpen: boolean,
    isLoggedIn: boolean,
    sectionName: string,
    activeRoute: string,
    listKey: string,
    listData: Array<Object>,
}

type State = {
    expanded: boolean
}

const LIST_ITEM_HEIGHT = 48;

class SideBarSection extends React.PureComponent<Props, State> {

    state = {
        expanded: this.props.startOpen,
    };

    colors: Object;
    shouldExpand: boolean;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    /**
     * Searches if the current route is contained in the given list data.
     * If this is the case and the list is collapsed, we should expand this list.
     *
     * @return boolean
     */
    shouldExpandList() {
        for (let i = 0; i < this.props.listData.length; i++) {
            if (this.props.listData[i].route === this.props.activeRoute) {
                return this.state.expanded === false;
            }
        }
        return false;
    }

    /**
     * Callback when a drawer item is pressed.
     * It will either navigate to the associated screen, or open the browser to the associated link
     *
     * @param item The item pressed
     */
    onListItemPress(item: Object) {
        if (item.link !== undefined)
            openBrowser(item.link, this.colors.primary);
        else if (item.action !== undefined)
            item.action();
        else
            this.props.navigation.navigate(item.route);
    }

    /**
     * Key extractor for list items
     *
     * @param item The item to extract the key from
     * @return {string} The extracted key
     */
    listKeyExtractor = (item: Object) => item.route;

    shouldHideItem(item: Object) {
        const onlyWhenLoggedOut = item.onlyWhenLoggedOut !== undefined && item.onlyWhenLoggedOut === true;
        const onlyWhenLoggedIn = item.onlyWhenLoggedIn !== undefined && item.onlyWhenLoggedIn === true;
        return (onlyWhenLoggedIn && !this.props.isLoggedIn || onlyWhenLoggedOut && this.props.isLoggedIn);
    }

    /**
     * Gets the render item for the given list item
     *
     * @param item The item to render
     * @return {*}
     */
    getRenderItem = ({item}: Object) => {
        const onListItemPress = this.onListItemPress.bind(this, item);
        if (this.shouldHideItem(item))
            return null;
        return (
            <Drawer.Item
                label={item.name}
                active={this.props.activeRoute === item.route}
                icon={item.icon}
                onPress={onListItemPress}
                style={{
                    height: LIST_ITEM_HEIGHT,
                    justifyContent: 'center',
                }}
            />
        );
    };

    toggleAccordion = () => {
        if ((!this.state.expanded && this.shouldExpand) || !this.shouldExpand)
            this.setState({expanded: !this.state.expanded})
    };

    shouldRenderAccordion() {
        let itemsToRender = 0;
        for (let i = 0; i < this.props.listData.length; i++) {
            if (!this.shouldHideItem(this.props.listData[i]))
                itemsToRender += 1;
        }
        return itemsToRender > 1;
    }

    itemLayout = (data, index) => ({length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index});

    getFlatList() {
        return (
            // $FlowFixMe
            <FlatList
                data={this.props.listData}
                extraData={this.props.isLoggedIn.toString() + this.props.activeRoute}
                renderItem={this.getRenderItem}
                keyExtractor={this.listKeyExtractor}
                listKey={this.props.listKey}
                // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
                getItemLayout={this.itemLayout}
            />
        );
    }

    render() {
        if (this.shouldRenderAccordion()) {
            this.shouldExpand = this.shouldExpandList();
            if (this.shouldExpand)
                this.toggleAccordion();
            return (
                <List.Accordion
                    title={this.props.sectionName}
                    expanded={this.state.expanded}
                    onPress={this.toggleAccordion}
                >
                    {this.getFlatList()}
                </List.Accordion>
            );
        } else
            return this.getFlatList();
    }
}

export default withTheme(SideBarSection);
