// @flow

import * as React from "react";
import {Body, Header, Input, Item, Left, Right, Subtitle, Title} from "native-base";
import {Platform, StyleSheet, View} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";
import Touchable from 'react-native-platform-touchable';
import ThemeManager from "../utils/ThemeManager";
import CustomMaterialIcon from "./CustomMaterialIcon";
import i18n from "i18n-js";
import {NavigationActions} from 'react-navigation';

type Props = {
    hasBackButton: boolean,
    hasSearchField: boolean,
    searchCallback: Function,
    shouldFocusSearchBar: boolean,
    leftButton: React.Node,
    rightButton: React.Node,
    title: string,
    subtitle: string,
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
        subtitle: '',
        leftButton: <View/>,
        rightButton: <View/>,
        hasTabs: false,
    };

    constructor() {
        super();
        this.onPressBack = this.onPressBack.bind(this);
    }

    shouldComponentUpdate(nextProps: Props): boolean {
        return nextProps.title !== this.props.title ||
            nextProps.subtitle !== this.props.subtitle ||
            nextProps.hasBackButton !== this.props.hasBackButton ||
            nextProps.hasSearchField !== this.props.hasSearchField ||
            nextProps.shouldFocusSearchBar !== this.props.shouldFocusSearchBar ||
            nextProps.hasTabs !== this.props.hasTabs ||
            nextProps.rightButton !== this.props.rightButton ||
            nextProps.leftButton !== this.props.leftButton;
    }

    componentDidMount() {
        if (this.refs.searchInput !== undefined && this.refs.searchInput._root !== undefined && this.props.shouldFocusSearchBar) {
            // does not work if called too early for some reason...
            setTimeout(() => this.refs.searchInput._root.focus(), 500);
        }
    }

    getSearchBar() {
        return (
            <Body>
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
                        onChangeText={this.props.searchCallback}/>
                </Item>
            </Body>
        );
    }

    getHeaderTitle() {
        return (
            <Body>
                <Title style={{
                    color: ThemeManager.getCurrentThemeVariables().toolbarTextColor
                }}>
                    {this.props.title}
                </Title>
                {this.props.subtitle !== '' ? <Subtitle>{this.props.subtitle}</Subtitle> : null}
            </Body>
        );
    }


    onPressBack() {
        const backAction = NavigationActions.back();
        this.props.navigation.dispatch(backAction);
    }

    render() {
        // console.log("rendering CustomHeader");
        let button;
        // Does the app have a back button or a burger menu ?
        if (this.props.hasBackButton)
            button =
                <Touchable
                    style={{padding: 6}}
                    onPress={this.onPressBack}>
                    <CustomMaterialIcon
                        color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                        icon={Platform.OS === 'ios' ? 'chevron-left' : "arrow-left"}/>
                </Touchable>;
        else
            button = this.props.leftButton;

        return (
            <Header style={styles.header}
                    hasTabs={this.props.hasTabs}>
                <Left style={{flex: 0}}>
                    {button}
                </Left>
                {this.props.hasSearchField ?
                    this.getSearchBar() :
                    this.getHeaderTitle()}
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
