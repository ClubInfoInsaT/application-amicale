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
import MaterialHeaderButtons, {Item} from "../../components/Overrides/CustomHeaderButton";

type Props = {
    navigation: Object,
    route: Object,
    collapsibleStack: Collapsible,
    theme: CustomTheme,
}

const CLUBS_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Clubs.png";
const PROFILE_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/ProfilAmicaliste.png";
const VOTE_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Vote.png";
const AMICALE_IMAGE = require("../../../assets/amicale.png");

const PROXIMO_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Proximo.png"
const WIKETUD_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Wiketud.png";
const EE_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/EEC.png";
const TUTORINSA_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/TutorINSA.png";

const BIB_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Bib.png";
const RU_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/RU.png";
const ROOM_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Salles.png";
const EMAIL_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Bluemind.png";
const ENT_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/ENT.png";

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
                subtitle: i18n.t('servicesScreen.descriptions.clubs'),
                image: CLUBS_IMAGE,
                onPress: () => nav.navigate("club-list"),
            },
            {
                title: i18n.t('screens.profile'),
                subtitle: i18n.t('servicesScreen.descriptions.profile'),
                image: PROFILE_IMAGE,
                onPress: () => nav.navigate("profile"),
            },
            {
                title: i18n.t('screens.amicaleWebsite'),
                subtitle: i18n.t('servicesScreen.descriptions.amicaleWebsite'),
                image: AMICALE_IMAGE,
                onPress: () => nav.navigate("amicale-website"),
            },
            {
                title: i18n.t('screens.vote'),
                subtitle: i18n.t('servicesScreen.descriptions.vote'),
                image: VOTE_IMAGE,
                onPress: () => nav.navigate("vote"),
            },
        ];
        this.studentsDataset = [
            {
                title: i18n.t('screens.proximo'),
                subtitle: i18n.t('servicesScreen.descriptions.proximo'),
                image: PROXIMO_IMAGE,
                onPress: () => nav.navigate("proximo"),
            },
            {
                title: "Wiketud",
                subtitle: i18n.t('servicesScreen.descriptions.wiketud'),
                image: WIKETUD_IMAGE,
                onPress: () => nav.navigate("wiketud"),
            },
            {
                title: "Élus Étudiants",
                subtitle: i18n.t('servicesScreen.descriptions.elusEtudiants'),
                image: EE_IMAGE,
                onPress: () => nav.navigate("elus-etudiants"),
            },
            {
                title: "Tutor'INSA",
                subtitle: i18n.t('servicesScreen.descriptions.tutorInsa'),
                image: TUTORINSA_IMAGE,
                onPress: () => nav.navigate("tutorinsa"),
            },
            {
                title: i18n.t('screens.amicaleWebsite'),
                subtitle: i18n.t('servicesScreen.descriptions.amicaleWebsite'),
                image: AMICALE_IMAGE,
                onPress: () => nav.navigate("amicale-website"),
            },
        ];
        this.insaDataset = [
            {
                title: i18n.t('screens.menuSelf'),
                subtitle: i18n.t('servicesScreen.descriptions.self'),
                image: RU_IMAGE,
                onPress: () => nav.navigate("self-menu"),
            },
            {
                title: i18n.t('screens.availableRooms'),
                subtitle: i18n.t('servicesScreen.descriptions.availableRooms'),
                image: ROOM_IMAGE,
                onPress: () => nav.navigate("available-rooms"),
            },
            {
                title: i18n.t('screens.bib'),
                subtitle: i18n.t('servicesScreen.descriptions.bib'),
                image: BIB_IMAGE,
                onPress: () => nav.navigate("bib"),
            },
            {
                title: i18n.t('screens.bluemind'),
                subtitle: i18n.t('servicesScreen.descriptions.mails'),
                image: EMAIL_IMAGE,
                onPress: () => nav.navigate("bluemind"),
            },
            {
                title: i18n.t('screens.ent'),
                subtitle: i18n.t('servicesScreen.descriptions.ent'),
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
        this.props.navigation.setOptions({
            headerRight: this.getAboutButton,
        });
    }

    getAboutButton = () =>
        <MaterialHeaderButtons>
            <Item title="information" iconName="information" onPress={this.onAboutPress}/>
        </MaterialHeaderButtons>;

    onAboutPress = () => this.props.navigation.navigate('amicale-contact');

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
                source={source}
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
                    {i18n.t("servicesScreen.notLoggedIn")}
                </Title>
                <Button
                    icon="login"
                    mode="contained"
                    onPress={() => this.props.navigation.navigate("login")}
                    style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                    {i18n.t("screens.login")}
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
