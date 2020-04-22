// @flow

import * as React from 'react';
import type {cardList} from "../../components/Lists/CardList/CardList";
import CardList from "../../components/Lists/CardList/CardList";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {withCollapsible} from "../../utils/withCollapsible";
import {Collapsible} from "react-navigation-collapsible";
import {CommonActions} from "@react-navigation/native";
import {Animated, View} from "react-native";
import {Avatar, Button, Card, Divider, List, Title, TouchableRipple, withTheme} from "react-native-paper";
import type {CustomTheme} from "../../managers/ThemeManager";
import ConnectionManager from "../../managers/ConnectionManager";
import i18n from 'i18n-js';

type Props = {
    navigation: Object,
    route: Object,
    collapsibleStack: Collapsible,
    theme: CustomTheme,
}
const BIB_IMAGE = "https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/50695561_2124263197597162_2325349608210825216_n.jpg?_nc_cat=109&_nc_sid=8bfeb9&_nc_ohc=tmcV6FWO7_kAX9vfWHU&_nc_ht=scontent-cdg2-1.xx&oh=3b81c76e46b49f7c3a033ea3b07ec212&oe=5EC59B4D";
const RU_IMAGE = "https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/47123773_2041883702501779_5289372776166064128_o.jpg?_nc_cat=100&_nc_sid=cdbe9c&_nc_ohc=dpuBGlIIy_EAX8CyC0l&_nc_ht=scontent-cdg2-1.xx&oh=5c5bb4f0c7f12b554246f7c9b620a5f3&oe=5EC4DB31";
const ROOM_IMAGE = "https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/47041013_2043521689004647_316124496522117120_n.jpg?_nc_cat=103&_nc_sid=8bfeb9&_nc_ohc=bIp8OVJvvSEAX8mKnDZ&_nc_ht=scontent-cdt1-1.xx&oh=b4fef72a645804a849ad30e9e20fca12&oe=5EC29309";
const EMAIL_IMAGE = "https://etud-mel.insa-toulouse.fr/webmail/images/logo-bluemind.png";
const ENT_IMAGE = "https://ent.insa-toulouse.fr/media/org/jasig/portal/layout/tab-column/xhtml-theme/insa/institutional/LogoInsa.png";

const PROXIMO_IMAGE = require("../../../assets/proximo-logo.png");
const WIKETUD_LINK = "https://wiki.etud.insa-toulouse.fr/resources/assets/wiketud.png?ff051";
const AMICALE_IMAGE = require("../../../assets/amicale.png");
const EE_IMAGE = "https://etud.insa-toulouse.fr/~eeinsat/wp-content/uploads/2019/09/logo-blanc.png";
const TUTORINSA_IMAGE = "https://www.etud.insa-toulouse.fr/~tutorinsa/public/images/logo-gray.png";

export type listItem = {
    title: string,
    description: string,
    image: string | number,
    shouldLogin: boolean,
    content: cardList,
}

type State = {
    isLoggedIn: boolean,
}

class ServicesScreen extends React.Component<Props, State> {

    amicaleDataset: cardList;
    studentsDataset: cardList;
    insaDataset: cardList;

    finalDataset: Array<listItem>

    constructor(props) {
        super(props);
        const nav = props.navigation;
        this.amicaleDataset = [
            {
                title: i18n.t('screens.clubsAbout'),
                subtitle: "CLUB LIST",
                image: AMICALE_IMAGE,
                onPress: () => nav.navigate("club-list"),
            },
            {
                title: i18n.t('screens.profile'),
                subtitle: "PROFIL",
                image: AMICALE_IMAGE,
                onPress: () => nav.navigate("profile"),
            },
            {
                title: i18n.t('screens.amicaleAbout'),
                subtitle: "CONTACT",
                image: AMICALE_IMAGE,
                onPress: () => nav.navigate("amicale-contact"),
            },
            {
                title: i18n.t('screens.vote'),
                subtitle: "ELECTIONS",
                image: AMICALE_IMAGE,
                onPress: () => nav.navigate("vote"),
            },
        ];
        this.studentsDataset = [
            {
                title: i18n.t('screens.proximo'),
                subtitle: "proximo",
                image: PROXIMO_IMAGE,
                onPress: () => nav.navigate("proximo"),
            },
            {
                title: i18n.t('screens.amicaleWebsite'),
                subtitle: "AMICALE",
                image: AMICALE_IMAGE,
                onPress: () => nav.navigate("amicale-website"),
            },
            {
                title: "Wiketud",
                subtitle: "wiketud",
                image: WIKETUD_LINK,
                onPress: () => nav.navigate("wiketud"),
            },
            {
                title: "Élus Étudiants",
                subtitle: "ELUS ETUDIANTS",
                image: EE_IMAGE,
                onPress: () => nav.navigate("elus-etudiants"),
            },
            {
                title: "Tutor'INSA",
                subtitle: "TUTOR INSA",
                image: TUTORINSA_IMAGE,
                onPress: () => nav.navigate("tutorinsa"),
            },
        ];
        this.insaDataset = [
            {
                title: i18n.t('screens.menuSelf'),
                subtitle: "the ru",
                image: RU_IMAGE,
                onPress: () => nav.navigate("self-menu"),
            },
            {
                title: i18n.t('screens.availableRooms'),
                subtitle: "ROOMS",
                image: ROOM_IMAGE,
                onPress: () => nav.navigate("available-rooms"),
            },
            {
                title: i18n.t('screens.bib'),
                subtitle: "BIB",
                image: BIB_IMAGE,
                onPress: () => nav.navigate("bib"),
            },
            {
                title: i18n.t('screens.bluemind'),
                subtitle: "EMAIL",
                image: EMAIL_IMAGE,
                onPress: () => nav.navigate("bluemind"),
            },
            {
                title: i18n.t('screens.ent'),
                subtitle: "ENT",
                image: ENT_IMAGE,
                onPress: () => nav.navigate("ent"),
            },
        ];
        this.finalDataset = [
            {
                title: i18n.t("servicesScreen.amicale"),
                description: "LOGIN",
                image: AMICALE_IMAGE,
                shouldLogin: true,
                content: this.amicaleDataset
            },
            {
                title: i18n.t("servicesScreen.students"),
                description: "SERVICES OFFERED BY STUDENTS",
                image: 'account-group',
                shouldLogin: false,
                content: this.studentsDataset
            },
            {
                title: i18n.t("servicesScreen.insa"),
                description: "SERVICES OFFERED BY INSA",
                image: 'school',
                shouldLogin: false,
                content: this.insaDataset
            },
        ];
        this.state = {
            isLoggedIn: ConnectionManager.getInstance().isLoggedIn()
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', this.onFocus);

    }

    onFocus = () => {
        this.handleNavigationParams();
        this.setState({isLoggedIn: ConnectionManager.getInstance().isLoggedIn()})
    }

    handleNavigationParams() {
        if (this.props.route.params != null) {
            if (this.props.route.params.nextScreen != null) {
                this.props.navigation.navigate(this.props.route.params.nextScreen);
                // reset params to prevent infinite loop
                this.props.navigation.dispatch(CommonActions.setParams({nextScreen: null}));
            }
        }
    };

    getAvatar(props, source: string | number) {
        if (typeof source === "number")
            return <Avatar.Image
                {...props}
                size={48}
                source={AMICALE_IMAGE}
                style={{backgroundColor: 'transparent'}}
            />
        else
            return <Avatar.Icon
                {...props}
                size={48}
                icon={source}
                color={this.props.theme.colors.primary}
                style={{backgroundColor: 'transparent'}}
            />
    }

    getLoginMessage() {
        return (
            <View>
                <Title style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    NOT LOGGED IN
                </Title>
                <Button
                    icon="login"
                    mode="contained"
                    onPress={() => this.props.navigation.navigate("login")}
                    style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                    LOGIN
                </Button>
            </View>
        )
    }

    renderItem = ({item}: { item: listItem }) => {
        const shouldShowLogin = !this.state.isLoggedIn && item.shouldLogin;
        return (
            <TouchableRipple
                style={{
                    margin: 5,
                    marginBottom: 20,
                }}
                onPress={shouldShowLogin
                    ? undefined
                    : () => this.props.navigation.navigate("services-section", {data: item})}
            >
                <View>
                    <Card.Title
                        title={item.title}
                        left={(props) => this.getAvatar(props, item.image)}
                        right={shouldShowLogin
                            ? undefined
                            : (props) => <List.Icon {...props} icon="chevron-right"/>}
                    />
                    {
                        shouldShowLogin
                            ? this.getLoginMessage()
                            : <CardList
                                dataset={item.content}
                                isHorizontal={true}
                            />
                    }
                </View>
            </TouchableRipple>

        );
    };

    keyExtractor = (item: listItem) => {
        return item.title;
    }

    render() {
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        return <Animated.FlatList
            data={this.finalDataset}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            onScroll={onScroll}
            contentContainerStyle={{
                paddingTop: containerPaddingTop,
                paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20
            }}
            scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
            ItemSeparatorComponent={() => <Divider/>}
        />
    }
}

export default withCollapsible(withTheme(ServicesScreen));
