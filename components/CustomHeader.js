// @flow

import * as React from "react";
import {Body, Header, Left, Right, Title} from "native-base";
import {Platform, StyleSheet, View} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";
import Touchable from 'react-native-platform-touchable';
import ThemeManager from "../utils/ThemeManager";
import CustomMaterialIcon from "./CustomMaterialIcon";

type Props = {
    hasBackButton: boolean,
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
        leftButton: <View/>,
        rightButton: <View/>,
        hasTabs: false,
    };

    render() {
        let button;
        // Does the app have a back button or a burger menu ?
        if (this.props.hasBackButton)
            button =
                <Touchable
                    style={{padding: 6}}
                    onPress={() => this.props.navigation.goBack()}>
                    <CustomMaterialIcon
                        color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                        icon="arrow-left"/>
                </Touchable>;
        else
            button = this.props.leftButton;

        return (
            <Header style={styles.header}>
                <Left>
                    {button}
                </Left>
                <Body>
                    <Title>{this.props.title}</Title>
                </Body>
                <Right>
                    {this.props.rightButton}
                    {this.props.hasBackButton ? <View/> :
                    <Touchable
                        style={{padding: 6}}
                        onPress={() => this.props.navigation.navigate('SettingsScreen')}>
                        <CustomMaterialIcon
                            color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                            icon="settings"/>
                    </Touchable>}
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
