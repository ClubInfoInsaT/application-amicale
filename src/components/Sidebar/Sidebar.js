// @flow

import * as React from 'react';
import {Dimensions, FlatList, Image, StyleSheet, View,} from 'react-native';
import i18n from "i18n-js";
import {TouchableRipple} from "react-native-paper";
import ConnectionManager from "../../managers/ConnectionManager";
import LogoutDialog from "../Amicale/LogoutDialog";
import SideBarSection from "./SideBarSection";

const deviceWidth = Dimensions.get("window").width;

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

    /**
     * Generate the dataset
     *
     * @param props
     */
    constructor(props: Props) {
        super(props);
        // Dataset used to render the drawer
        const mainData = [
            {
                name: i18n.t('screens.home'),
                route: "Main",
                icon: "home",
            },
        ];
        const amicaleData = [
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
                name: i18n.t('screens.vote'),
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
        ];
        const servicesData = [
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
        ];
        const websitesData = [
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
        ];
        const othersData = [
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

        this.dataSet = [
            {
                key: '1',
                name: i18n.t('screens.home'),
                startOpen: true, // App always starts on Main
                data: mainData
            },
            {
                key: '2',
                name: i18n.t('sidenav.divider4'),
                startOpen: false, // TODO set by user preferences
                data: amicaleData
            },
            {
                key: '3',
                name: i18n.t('sidenav.divider2'),
                startOpen: false,
                data: servicesData
            },
            {
                key: '4',
                name: i18n.t('sidenav.divider1'),
                startOpen: false,
                data: websitesData
            },
            {
                key: '5',
                name: i18n.t('sidenav.divider3'),
                startOpen: false,
                data: othersData
            },
        ];
        ConnectionManager.getInstance().addLoginStateListener(this.onLoginStateChange);
        this.props.navigation.addListener('state', this.onRouteChange);
        this.state = {
            isLoggedIn: ConnectionManager.getInstance().isLoggedIn(),
            dialogVisible: false,
            activeRoute: 'Main',
        };
    }

    onRouteChange = (event: Object) => {
        try {
            const state = event.data.state.routes[0].state; // Get the Drawer's state if it exists
            // Get the current route name. This will only show Drawer routes.
            // Tab routes will be shown as 'Main'
            const routeName = state.routeNames[state.index];
            if (this.state.activeRoute !== routeName)
                this.setState({activeRoute: routeName});
        } catch (e) {
            this.setState({activeRoute: 'Main'});
        }

    };

    showDisconnectDialog = () => this.setState({dialogVisible: true});

    hideDisconnectDialog = () => this.setState({dialogVisible: false});

    onLoginStateChange = (isLoggedIn: boolean) => this.setState({isLoggedIn: isLoggedIn});

    /**
     * Gets the render item for the given list item
     *
     * @param item The item to render
     * @return {*}
     */
    getRenderItem = ({item}: Object) => {
        return <SideBarSection
            {...this.props}
            listKey={item.key}
            activeRoute={this.state.activeRoute}
            isLoggedIn={this.state.isLoggedIn}
            sectionName={item.name}
            startOpen={item.startOpen}
            listData={item.data}
        />
    };

    render() {
        return (
            <View style={{height: '100%'}}>
                <TouchableRipple
                    onPress={() => this.props.navigation.navigate("TetrisScreen")}
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
                    renderItem={this.getRenderItem}
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
});

export default SideBar;
