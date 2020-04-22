// @flow

import * as React from 'react';
import {Avatar, Card, List, withTheme} from 'react-native-paper';
import {StyleSheet} from "react-native";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import type {CustomTheme} from "../../managers/ThemeManager";
import i18n from 'i18n-js';

const ICON_AMICALE = require("../../../assets/amicale.png");

type Props = {
    navigation: DrawerNavigationProp,
    theme: CustomTheme,
    isLoggedIn: boolean,
}

class ActionsDashBoardItem extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Props): boolean {
        return (nextProps.theme.dark !== this.props.theme.dark)
        || (nextProps.isLoggedIn !== this.props.isLoggedIn);
    }

    render() {
        const isLoggedIn = this.props.isLoggedIn;
        return (
            <Card style={{
                ...styles.card,
                borderColor: this.props.theme.colors.primary,
            }}>
                <List.Item
                    title={i18n.t("homeScreen.dashboard.amicaleTitle")}
                    description={isLoggedIn
                        ? i18n.t("homeScreen.dashboard.amicaleConnected")
                        : i18n.t("homeScreen.dashboard.amicaleConnect")}
                    left={props => <Avatar.Image
                        {...props}
                        size={40}
                        source={ICON_AMICALE}
                        style={styles.avatar}/>}
                    right={props => <List.Icon {...props} icon={isLoggedIn
                        ? "chevron-right"
                        : "login"}/>}
                    onPress={isLoggedIn
                        ? () => this.props.navigation.navigate("services", {
                            screen: 'index'
                        })
                        : () => this.props.navigation.navigate("login")}
                    style={styles.list}
                />
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        width: 'auto',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderWidth: 1,
    },
    avatar: {
        backgroundColor: 'transparent',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    list: {
        // height: 50,
        paddingTop: 0,
        paddingBottom: 0,
    }
});

export default withTheme(ActionsDashBoardItem);
