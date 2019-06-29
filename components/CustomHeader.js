// @flow

import * as React from "react";
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import {StyleSheet} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";
import Touchable from 'react-native-platform-touchable';

type Props = {
    backButton: boolean,
    rightMenu: React.Node,
    title: string,
    navigation: Object,
};

/**
 * Custom component defining a header using native base
 *
 * @prop backButton {boolean} Whether to show a back button or a burger menu. Use burger if unspecified
 * @prop rightMenu {React.Node} Element to place at the right of the header. Use nothing if unspecified
 * @prop title {string} This header title
 * @prop navigation {Object} The navigation object from react navigation
 */
export default class CustomHeader extends React.Component<Props> {

    static defaultProps = {
        backButton: false,
        rightMenu: <Right/>,
    };

    render() {
        let button;
        if (this.props.backButton)
            button =
                <Touchable
                    style={{padding: 6}}
                    onPress={() => this.props.navigation.goBack()}>
                    <Icon
                        style={{color: "#fff"}}
                        name="arrow-left"
                        type={'MaterialCommunityIcons'}/>
                </Touchable>;
        else
            button =
                <Touchable
                    style={{padding: 6}}
                    onPress={() => this.props.navigation.toggleDrawer()}>
                    <Icon
                        style={{color: "#fff"}}
                        name="menu"
                        type={'MaterialCommunityIcons'}/>
                </Touchable>;

        return (
            <Header style={styles.header}>
                <Left>
                    {button}
                </Left>
                <Body>
                    <Title>{this.props.title}</Title>
                </Body>
                {this.props.rightMenu}
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
