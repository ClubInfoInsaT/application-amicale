import React from "react";
import {Body, Button, Header, Icon, Left, Right, Title} from "native-base";
import {StyleSheet} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";
import Touchable from 'react-native-platform-touchable';


export default class CustomHeader extends React.Component {
    render() {
        let button;
        let rightMenu;
        if (this.props.backButton !== undefined && this.props.backButton === true)
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

        if (this.props.rightMenu)
            rightMenu = this.props.rightMenu;
        else
            rightMenu = <Right/>;

        return (
            <Header style={styles.header}>
                <Left>
                    {button}
                </Left>
                <Body>
                    <Title>{this.props.title}</Title>
                </Body>
                {rightMenu}
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
