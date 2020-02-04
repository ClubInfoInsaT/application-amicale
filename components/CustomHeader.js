// @flow

import * as React from "react";
import {Body, Header, Input, Item, Left, Right, Title} from "native-base";
import {Platform, StyleSheet, View} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";
import Touchable from 'react-native-platform-touchable';
import ThemeManager from "../utils/ThemeManager";
import CustomMaterialIcon from "./CustomMaterialIcon";
import i18n from "i18n-js";
import { NavigationActions } from 'react-navigation';

type Props = {
    hasBackButton: boolean,
    hasSearchField: boolean,
    searchCallback: Function,
    shouldFocusSearchBar: boolean,
    leftButton: React.Node,
    rightButton: React.Node,
    title: string,
    navigation: Object,
    hasTabs: boolean,
};

/**
 * Custom component defining a header using native base
 *
 * @prop hasBackButton {boolean} Whether to show a back button or a burger menu. Use burger if unspecified
 * @prop rightMenu {React.Node} Element to place at the right of the header. Use nothing if unspecified
 * @prop title {string} This header title
 * @prop navigation {Object} The navigation object from react navigation
 */
export default class CustomHeader extends React.Component<Props> {

    static defaultProps = {
        hasBackButton: false,
        hasSearchField: false,
        searchCallback: () => null,
        shouldFocusSearchBar: false,
        title: '',
        leftButton: <View/>,
        rightButton: <View/>,
        hasTabs: false,
    };

    componentDidMount() {
        if (this.refs.searchInput !== undefined && this.refs.searchInput._root !== undefined && this.props.shouldFocusSearchBar) {
            // does not work if called to early for some reason...
            setTimeout(() => this.refs.searchInput._root.focus(), 500);
        }
    }

    getSearchBar() {
        return (
            <Item
                style={{
                    width: '100%',
                    marginBottom: 7
                }}>
                <CustomMaterialIcon
                    icon={'magnify'}
                    color={ThemeManager.getCurrentThemeVariables().toolbarBtnColor}/>
                <Input
                    ref="searchInput"
                    placeholder={i18n.t('proximoScreen.search')}
                    placeholderTextColor={ThemeManager.getCurrentThemeVariables().toolbarPlaceholderColor}
                    onChangeText={(text) => this.props.searchCallback(text)}/>
            </Item>
        );
    }

    render() {
        let button;
        // Does the app have a back button or a burger menu ?
        if (this.props.hasBackButton)
            button =
                <Touchable
                    style={{padding: 6}}
                    onPress={() => {
                        const backAction = NavigationActions.back();
                        this.props.navigation.dispatch(backAction);
                    }}>
                    <CustomMaterialIcon
                        color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                        icon={Platform.OS === 'chevron-left' ? "" : "arrow-left"}/>
                </Touchable>;
        else
            button = this.props.leftButton;

        return (
            <Header style={styles.header}
                    hasTabs={this.props.hasTabs}>
                <Left style={{flex: 0}}>
                    {button}
                </Left>
                <Body>
                    {this.props.hasSearchField ?
                        this.getSearchBar() :
                        <Title style={{
                            paddingLeft: 10,
                            color: ThemeManager.getCurrentThemeVariables().toolbarTextColor
                        }}>{this.props.title}</Title>}
                </Body>
                <Right style={{flex: this.props.hasSearchField ? 0 : 1}}>
                    {this.props.rightButton}
                </Right>
            </Header>);
    }
};


// Fix header in status bar on Android
const styles = StyleSheet.create({
    header: {
        paddingTop: getStatusBarHeight(),
        height: 54 + getStatusBarHeight(),
    },
});
