// @flow

import * as React from 'react';
import {Dimensions, FlatList, Image, Linking, Platform, StyleSheet} from 'react-native';
import {Badge, Container, Content, Left, ListItem, Right, Text} from "native-base";
import i18n from "i18n-js";
import CustomMaterialIcon from '../components/CustomMaterialIcon';

const deviceHeight = Dimensions.get("window").height;

const drawerCover = require("../assets/drawer-cover.png");

const WIKETUD_LINK = "https://www.etud.insa-toulouse.fr/wiketud";
const Amicale_LINK = "https://www.etud.insa-toulouse.fr/~amicale";
const TIMETABLE_LINK = "http://planex.insa-toulouse.fr";

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

    /**
     * Generate the datasets
     *
     * @param props
     */
    constructor(props: Props) {
        super(props);
        // Dataset used to render the drawer
        // If the link field is defined, clicking on the item will open the link
        this.dataSet = [
            {
                name: i18n.t('screens.home'),
                route: "Home",
                icon: "home",
            },
            {
                name: i18n.t('screens.planning'),
                route: "Planning",
                icon: "calendar-range",
            },
            {
                name: "Proxiwash",
                route: "Proxiwash",
                icon: "washing-machine",
            },
            {
                name: "Proximo",
                route: "Proximo",
                icon: "shopping",
            },
            {
                name: "Amicale",
                route: "amicale",
                icon: "web",
                link: Amicale_LINK
            },
            {
                name: i18n.t('screens.timetable'),
                route: "timetable",
                icon: "timetable",
                link: TIMETABLE_LINK
            },
            {
                name: "Wiketud",
                route: "wiketud",
                icon: "wikipedia",
                link: WIKETUD_LINK
            },
            {
                name: i18n.t('screens.settings'),
                route: "Settings",
                icon: "settings",
            },
            {
                name: i18n.t('screens.about'),
                route: "About",
                icon: "information",
            },
        ];
    }

    /**
     * Navigate to the selected route, close the drawer, and mark the correct item as selected
     * @param route {string} The route name to navigate to
     */
    navigateToScreen(route: string) {
        this.props.navigation.navigate(route);
        this.props.navigation.closeDrawer();
        this.setState({active: route});
    };

    render() {
        return (
            <Container>
                <Content
                    bounces={false}
                    style={{flex: 1, top: -1}}
                >
                    <Image source={drawerCover} style={styles.drawerCover}/>

                    <FlatList
                        data={this.dataSet}
                        extraData={this.state}
                        keyExtractor={(item) => item.route}
                        renderItem={({item}) =>
                            <ListItem
                                button
                                noBorder={item.name !== 'Wiketud' && item.name !== 'Proximo'} // Display a separator before settings and Amicale
                                selected={this.state.active === item.route}
                                onPress={() => {
                                    if (item.link !== undefined)
                                        Linking.openURL(item.link).catch((err) => console.error('Error opening link', err));
                                    else
                                        this.navigateToScreen(item.route);
                                }}
                            >
                                <Left>
                                    <CustomMaterialIcon
                                        icon={item.icon}
                                        active={this.state.active === item.route}
                                    />
                                    <Text style={styles.text}>
                                        {item.name}
                                    </Text>
                                </Left>
                                {item.types &&
                                <Right style={{flex: 1}}>
                                    <Badge
                                        style={{
                                            borderRadius: 3,
                                            height: 25,
                                            width: 72,
                                            backgroundColor: item.bg
                                        }}
                                    >
                                        <Text
                                            style={styles.badgeText}
                                        >{`${item.types} Types`}</Text>
                                    </Badge>
                                </Right>}
                            </ListItem>}
                    />
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    drawerCover: {
        alignSelf: "stretch",
        height: deviceHeight / 4,
        width: null,
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
