// @flow

import * as React from 'react';
import {Dimensions, FlatList, Image, Platform, StyleSheet, View,} from 'react-native';
import i18n from "i18n-js";
import {openBrowser} from "../../utils/WebBrowser";
import {Drawer, TouchableRipple, withTheme} from "react-native-paper";
import ConnectionManager from "../../managers/ConnectionManager";
import LogoutDialog from "../Amicale/LogoutDialog";

const deviceWidth = Dimensions.get("window").width;
const LIST_ITEM_HEIGHT = 48;

type Props = {
    navigation: Object,
    state: Object,
    theme: Object,
};

type State = {
    isLoggedIn: boolean,
    dialogVisible: boolean,
    activeRoute: string;
};

/**
 * Component used to render the drawer menu content
 */
class SideBar extends React.Component<Props, State> {

    dataSet: Array<Object>;

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
                name: i18n.t('sidenav.divider4'),
                route: "Divider4"
            },
            {
                name: i18n.t('screens.login'),
                route: "LoginScreen",
                icon: "login",
                onlyWhenLoggedOut: true,
                shouldEmphasis: true,
            },
            {
                name: i18n.t('screens.profile'),
                route: "ProfileScreen",
                icon: "account",
                onlyWhenLoggedIn: true,
            },
            {
                name: i18n.t('clubs.clubList'),
                route: "ClubListScreen",
                icon: "account-group",
                onlyWhenLoggedIn: true,
            },
            {
                name: "VOTE",
                route: "VoteScreen",
                icon: "vote",
                onlyWhenLoggedIn: true,
            },
            {
                name: i18n.t('screens.logout'),
                route: 'disconnect',
                action: this.showDisconnectDialog,
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
        this.colors = props.theme.colors;
        ConnectionManager.getInstance().addLoginStateListener(this.onLoginStateChange);
        this.props.navigation.addListener('state', this.onRouteChange);
        this.state = {
            isLoggedIn: ConnectionManager.getInstance().isLoggedIn(),
            dialogVisible: false,
            activeRoute: 'Main',
        };
    }

    onRouteChange = (event) => {
        try {
            const state = event.data.state.routes[0].state; // Get the Drawer's state if it exists
            // Get the current route name. This will only show Drawer routes.
            // Tab routes will be shown as 'Main'
            const routeName = state.routeNames[state.index];
            if (this.state.activeRoute !== routeName)
                this.setState({activeRoute: routeName});
        } catch(e) {
            this.setState({activeRoute: 'Main'});
        }

    };

    showDisconnectDialog = () => this.setState({dialogVisible: true});

    hideDisconnectDialog = () => this.setState({dialogVisible: false});


    onLoginStateChange = (isLoggedIn: boolean) => this.setState({isLoggedIn: isLoggedIn});

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
    getRenderItem = ({item}: Object) => {
        const onListItemPress = this.onListItemPress.bind(this, item);
        const onlyWhenLoggedOut = item.onlyWhenLoggedOut !== undefined && item.onlyWhenLoggedOut === true;
        const onlyWhenLoggedIn = item.onlyWhenLoggedIn !== undefined && item.onlyWhenLoggedIn === true;
        const shouldEmphasis = item.shouldEmphasis !== undefined && item.shouldEmphasis === true;
        if (onlyWhenLoggedIn && !this.state.isLoggedIn || onlyWhenLoggedOut && this.state.isLoggedIn)
            return null;
        else if (item.icon !== undefined) {
            return (
                <Drawer.Item
                    label={item.name}
                    active={this.state.activeRoute === item.route}
                    icon={item.icon}
                    onPress={onListItemPress}
                    style={{
                        height: LIST_ITEM_HEIGHT,
                        justifyContent: 'center',
                    }}
                />
            );
        } else {
            return (
                <Drawer.Item
                    label={item.name}
                    style={{
                        height: LIST_ITEM_HEIGHT,
                        justifyContent: 'center',
                    }}
                />
            );
        }
    };

    itemLayout = (data, index) => ({length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index});

    render() {
        const onPress = this.onListItemPress.bind(this, {route: 'TetrisScreen'});
        return (
            <View style={{height: '100%'}}>
                <TouchableRipple
                    onPress={onPress}
                >
                    <Image
                        source={require("../../../assets/drawer-cover.png")}
                        style={styles.drawerCover}
                    />
                </TouchableRipple>
                {/*$FlowFixMe*/}
                <FlatList
                    data={this.dataSet}
                    extraData={this.state.isLoggedIn.toString() + this.state.activeRoute}
                    keyExtractor={this.listKeyExtractor}
                    renderItem={this.getRenderItem}
                    // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
                    getItemLayout={this.itemLayout}
                />
                <LogoutDialog
                    {...this.props}
                    visible={this.state.dialogVisible}
                    onDismiss={this.hideDisconnectDialog}
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
