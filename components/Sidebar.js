// @flow

import * as React from 'react';
import {Dimensions, FlatList, Image,Platform, StyleSheet} from 'react-native';
import {Container, Left, ListItem, Text} from "native-base";
import i18n from "i18n-js";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import ThemeManager from "../utils/ThemeManager";
import * as WebBrowser from 'expo-web-browser';

const deviceWidth = Dimensions.get("window").width;

type Props = {
    navigation: Object,
};

type State = {
    active: string,
};

/**
 * Class used to define a navigation drawer
 */
export default class SideBar extends React.Component<Props, State> {

    dataSet: Array<Object>;

    state = {
        active: 'Home',
    };

    getRenderItem: Function;

    /**
     * Generate the datasets
     *
     * @param props
     */
    constructor(props: Props) {
        super(props);
        // Dataset used to render the drawer
        this.dataSet = [
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
                name: i18n.t('sidenav.divider2'),
                route: "Divider2"
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
                name: i18n.t('screens.availableRooms'),
                route: "AvailableRoomScreen",
                icon: "calendar-check",
            },
            {
                name: i18n.t('screens.menuSelf'),
                route: "SelfMenuScreen",
                icon: "silverware-fork-knife",
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

    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        return nextState.active !== this.state.active;
    }


    onListItemPress(item: Object) {
        if (item.link === undefined)
            this.props.navigation.navigate(item.route);
        else
            WebBrowser.openBrowserAsync(item.link);
    }


    listKeyExtractor(item: Object) {
        return item.route;
    }


    getRenderItem({item}: Object) {
        const onListItemPress = this.onListItemPress.bind(this, item);
        // return <View/>;
        if (item.icon !== undefined) {
            return (
                <ListItem
                    button
                    noBorder
                    selected={this.state.active === item.route}
                    onPress={onListItemPress}
                >
                    <Left>
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={26}
                            color={ThemeManager.getCurrentThemeVariables().customMaterialIconColor}
                        />
                        <Text style={styles.text}>
                            {item.name}
                        </Text>
                    </Left>
                </ListItem>
            );
        } else {
            return (
                <ListItem itemDivider>
                    <Text>{item.name}</Text>
                </ListItem>
            );
        }

    }

    render() {
        console.log("rendering SideBar");
        return (
            <Container style={{
                backgroundColor: ThemeManager.getCurrentThemeVariables().sideMenuBgColor,
            }}>
                <Image source={require("../assets/drawer-cover.png")} style={styles.drawerCover}/>
                <FlatList
                    data={this.dataSet}
                    extraData={this.state}
                    keyExtractor={this.listKeyExtractor}
                    renderItem={this.getRenderItem}
                />
            </Container>
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
