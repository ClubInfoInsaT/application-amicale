import React from "react";
import {Body, Button, Header, Icon, Left, Right, Title} from "native-base";
import {StyleSheet} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";

export default class CustomHeader extends React.Component {
    render() {
        return (
            <Header style={styles.header}>
                <Left>
                    <Button
                        transparent
                        onPress={() => this.props.navigation.toggleDrawer()}
                    >
                        <Icon name="menu"/>
                    </Button>
                </Left>
                <Body>
                    <Title>{this.props.title}</Title>
                </Body>
                <Right/>
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