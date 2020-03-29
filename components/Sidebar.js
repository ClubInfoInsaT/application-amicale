// @flow

import * as React from 'react';
import {Dimensions, FlatList, Image, Platform, StyleSheet, View} from 'react-native';
import i18n from "i18n-js";
import * as WebBrowser from 'expo-web-browser';
import SidebarDivider from "./SidebarDivider";
import SidebarItem from "./SidebarItem";
import {TouchableRipple} from "react-native-paper";

const deviceWidth = Dimensions.get("window").width;

type Props = {
    navigation: Object,
    state: Object,
};

type State = {
    active: string,
};

/**
 * Component used to render the drawer menu content
 */
export default class SideBar extends React.PureComponent<Props, State> {

    dataSet: Array<Object>;

    state = {
        active: 'Home',
    };

    getRenderItem: Function;

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
    }

    /**
     * Callback when a drawer item is pressed.
     * It will either navigate to the associated screen, or open the browser to the associated link
     *
     * @param item The item pressed
     */
    onListItemPress(item: Object) {
        if (item.link === undefined)
            this.props.navigation.navigate(item.route);
        else
            WebBrowser.openBrowserAsync(item.link);
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
        if (item.icon !== undefined) {
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
