// @flow

import * as React from 'react';
import {Alert, Dimensions, FlatList, Image, Platform, StyleSheet, View} from 'react-native';
import i18n from "i18n-js";
import {openBrowser} from "../utils/WebBrowser";
import SidebarDivider from "./SidebarDivider";
import SidebarItem from "./SidebarItem";
import {TouchableRipple, withTheme} from "react-native-paper";
import ConnectionManager from "../managers/ConnectionManager";

const deviceWidth = Dimensions.get("window").width;

type Props = {
    navigation: Object,
    state: Object,
    theme: Object,
};

type State = {
    active: string,
    isLoggedIn: boolean,
};

/**
 * Component used to render the drawer menu content
 */
class SideBar extends React.PureComponent<Props, State> {

    dataSet: Array<Object>;

    getRenderItem: Function;
    colors: Object;

    /**
     * Generate the dataset
     *
     * @param props
     */
    constructor(props: Props) {
        super(props);
        // Dataset used to render the drawer
        this.dataSet = [
            {
                name: i18n.t('screens.home'),
                route: "Main",
                icon: "home",
            },
            {
                name: "AMICALE",
                route: "Divider4"
            },
            {
                name: i18n.t('screens.login'),
                route: "LoginScreen",
                icon: "login",
                onlyWhenLoggedOut: true,
            },
            {
                name: i18n.t('screens.profile'),
                route: "ProfileScreen",
                icon: "account",
                onlyWhenLoggedIn: true,
            },
            {
                name: i18n.t('screens.logout'),
                route: 'disconnect',
                action: () => this.onClickDisconnect(),
                icon: "logout",
                onlyWhenLoggedIn: true,
            },
            {
                name: i18n.t('sidenav.divider2'),
                route: "Divider2"
            },
            {
                name: i18n.t('screens.menuSelf'),
                route: "SelfMenuScreen",
                icon: "silverware-fork-knife",
            },
            {
                name: i18n.t('screens.availableRooms'),
                route: "AvailableRoomScreen",
                icon: "calendar-check",
            },
            {
                name: i18n.t('screens.bib'),
                route: "BibScreen",
                icon: "book",
            },
            {
                name: i18n.t('screens.bluemind'),
                route: "BlueMindScreen",
                link: "https://etud-mel.insa-toulouse.fr/webmail/",
                icon: "email",
            },
            {
                name: i18n.t('screens.ent'),
                route: "EntScreen",
                link: "https://ent.insa-toulouse.fr/",
                icon: "notebook",
            },
            {
                name: i18n.t('sidenav.divider1'),
                route: "Divider1"
            },
            {
                name: "Amicale",
                route: "AmicaleScreen",
                link: "https://amicale-insat.fr/",
                icon: "alpha-a-box",
            },
            {
                name: "Élus Étudiants",
                route: "ElusEtudScreen",
                link: "https://etud.insa-toulouse.fr/~eeinsat/",
                icon: "alpha-e-box",
            },
            {
                name: "Wiketud",
                route: "WiketudScreen",
                link: "https://wiki.etud.insa-toulouse.fr",
                icon: "wikipedia",
            },
            {
                name: "Tutor'INSA",
                route: "TutorInsaScreen",
                link: "https://www.etud.insa-toulouse.fr/~tutorinsa/",
                icon: "school",
            },
            {
                name: i18n.t('sidenav.divider3'),
                route: "Divider3"
            },
            {
                name: i18n.t('screens.settings'),
                route: "SettingsScreen",
                icon: "settings",
            },
            {
                name: i18n.t('screens.about'),
                route: "AboutScreen",
                icon: "information",
            },
        ];
        this.getRenderItem = this.getRenderItem.bind(this);
        this.colors = props.theme.colors;
        ConnectionManager.getInstance().setLoginCallback((value) => this.onLoginStateChange(value));
        this.state = {
            active: 'Home',
            isLoggedIn: false,
        };
        ConnectionManager.getInstance().isLoggedIn()
    }

    onClickDisconnect() {
        Alert.alert(
            'DISCONNECT',
            'DISCONNECT?',
            [
                {
                    text: 'YES', onPress: () => {
                        ConnectionManager.getInstance().disconnect()
                            .then(() => {
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [{name: 'Main'}],
                                });
                            });
                    }
                },
                {text: 'NO', undefined},
            ],
            {cancelable: false},
        );
    }

    onLoginStateChange(isLoggedIn: boolean) {
        this.setState({isLoggedIn: isLoggedIn});
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
    listKeyExtractor(item: Object): string {
        return item.route;
    }

    /**
     * Gets the render item for the given list item
     *
     * @param item The item to render
     * @return {*}
     */
    getRenderItem({item}: Object) {
        const onListItemPress = this.onListItemPress.bind(this, item);
        const onlyWhenLoggedOut = item.onlyWhenLoggedOut !== undefined && item.onlyWhenLoggedOut === true;
        const onlyWhenLoggedIn = item.onlyWhenLoggedIn !== undefined && item.onlyWhenLoggedIn === true;
        if (onlyWhenLoggedIn && !this.state.isLoggedIn || onlyWhenLoggedOut && this.state.isLoggedIn)
            return null;
        else if (item.icon !== undefined) {
            return (
                <SidebarItem
                    title={item.name}
                    icon={item.icon}
                    onPress={onListItemPress}
                />
            );
        } else {
            return (
                <SidebarDivider title={item.name}/>
            );
        }

    }

    render() {
        const onPress = this.onListItemPress.bind(this, {route: 'TetrisScreen'});
        return (
            <View style={{height: '100%'}}>
                <TouchableRipple
                    onPress={onPress}
                >
                    <Image
                        source={require("../assets/drawer-cover.png")}
                        style={styles.drawerCover}
                    />
                </TouchableRipple>
                <FlatList
                    data={this.dataSet}
                    extraData={this.state}
                    keyExtractor={this.listKeyExtractor}
                    renderItem={this.getRenderItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    drawerCover: {
        height: deviceWidth / 3,
        width: 2 * deviceWidth / 3,
        position: "relative",
        marginBottom: 10,
        marginTop: 20
    },
    text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        marginLeft: 20
    },
    badgeText: {
        fontSize: Platform.OS === "ios" ? 13 : 11,
        fontWeight: "400",
        textAlign: "center",
        marginTop: Platform.OS === "android" ? -3 : undefined
    }
});

export default withTheme(SideBar);
