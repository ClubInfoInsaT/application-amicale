// @flow

import * as React from 'react';
import {Container, Text, Content, ListItem, Left, Thumbnail, Right, Body, Icon} from 'native-base';
import CustomHeader from "../../components/CustomHeader";
import {FlatList} from "react-native";
import Touchable from 'react-native-platform-touchable';
import Menu, {MenuItem} from 'react-native-material-menu';
import i18n from "i18n-js";

const IMG_URL = "https://etud.insa-toulouse.fr/~vergnet/appli-amicale/img/";
const defaultImage = require('../../assets/image-missing.png');

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
    navigation: Object
}

type State = {
    navData: Array<Object>,
    currentSortMode: string,
    isSortReversed: boolean,
    sortPriceIcon: React.Node,
    sortNameIcon: React.Node,
};

/**
 * Class defining proximo's article list of a certain category.
 */
export default class ProximoListScreen extends React.Component<Props, State> {

    state = {
        navData: this.props.navigation.getParam('data', []).sort(sortPrice),
        currentSortMode: sortMode.price,
        isSortReversed: false,
        sortPriceIcon: '',
        sortNameIcon: '',
    };

    _menu: Menu;

    /**
     * Saves the reference to the sort menu for later use
     *
     * @param ref The menu reference
     */
    setMenuRef = (ref: Menu) => {
        this._menu = ref;
    };

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
        let data = this.state.navData;
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
        this.setState({
            navData: data,
        });
        this.setupSortIcons(mode, isReverse);
        this._menu.hide();
    }

    /**
     * Set the sort mode from state when components are ready
     */
    componentDidMount() {
        this.setSortMode(this.state.currentSortMode, this.state.isSortReversed);
    }

    /**
     * Set the sort menu icon based on the given mode.
     *
     * @param mode The string representing the mode
     * @param isReverse Whether to use a reversed icon
     */
    setupSortIcons(mode: string, isReverse: boolean) {
        const downSortIcon =
            <Icon
                active
                name={'sort-descending'}
                type={'MaterialCommunityIcons'}/>;
        const upSortIcon =
            <Icon
                active
                name={'sort-ascending'}
                type={'MaterialCommunityIcons'}/>;
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

    render() {
        const nav = this.props.navigation;
        const navType = nav.getParam('type', 'Empty');

        return (
            <Container>
                <CustomHeader backButton={true} navigation={nav} title={navType} rightMenu={
                    <Right>
                        <Menu
                            ref={this.setMenuRef}
                            button={
                                <Touchable
                                    style={{padding: 6}}
                                    onPress={() =>
                                        this._menu.show()
                                    }>
                                    <Icon
                                        style={{color: "#fff"}}
                                        name="sort"
                                        type={'MaterialCommunityIcons'}/>
                                </Touchable>
                            }
                        >
                            <MenuItem
                                onPress={() => this.sortModeSelected(sortMode.name)}>
                                {this.state.sortNameIcon}
                                {i18n.t('proximoScreen.sortName')}
                            </MenuItem>
                            <MenuItem
                                onPress={() => this.sortModeSelected(sortMode.price)}>
                                {this.state.sortPriceIcon}
                                {i18n.t('proximoScreen.sortPrice')}
                            </MenuItem>
                        </Menu>
                    </Right>
                }/>

                <Content>
                    <FlatList
                        data={this.state.navData}
                        extraData={this.state.navData}
                        keyExtractor={(item, index) => item.name}
                        style={{minHeight: 300, width: '100%'}}
                        renderItem={({item}) =>
                            <ListItem
                                thumbnail
                                onPress={() => {
                                    console.log(IMG_URL + item.name + '.jpg')
                                }}
                            >
                                <Left>
                                    <Thumbnail square source={{uri: IMG_URL + item.name + '.jpg'}}/>
                                </Left>
                                <Body>
                                    <Text style={{marginLeft: 20}}>
                                        {item.name}
                                    </Text>
                                </Body>
                                <Right style={{flex: 1}}>
                                    <Text>
                                        {item.price}€
                                    </Text>
                                </Right>
                            </ListItem>}
                    />
                </Content>
            </Container>
        );
    }
}
