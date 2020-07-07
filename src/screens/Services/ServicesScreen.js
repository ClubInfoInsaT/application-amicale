// @flow

import * as React from 'react';
import type {cardList} from "../../components/Lists/CardList/CardList";
import CardList from "../../components/Lists/CardList/CardList";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {withCollapsible} from "../../utils/withCollapsible";
import {Collapsible} from "react-navigation-collapsible";
import {Animated, View} from "react-native";
import {Avatar, Card, Divider, List, TouchableRipple, withTheme} from "react-native-paper";
import type {CustomTheme} from "../../managers/ThemeManager";
import i18n from 'i18n-js';
import MaterialHeaderButtons, {Item} from "../../components/Overrides/CustomHeaderButton";
import ConnectionManager from "../../managers/ConnectionManager";
import {StackNavigationProp} from "@react-navigation/stack";
import AvailableWebsites from "../../constants/AvailableWebsites";

type Props = {
    navigation: StackNavigationProp,
    collapsibleStack: Collapsible,
    theme: CustomTheme,
}

export type listItem = {
    title: string,
    description: string,
    image: string | number,
    shouldLogin: boolean,
    content: cardList,
}

const AMICALE_LOGO = require("../../../assets/amicale.png");

const CLUBS_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Clubs.png";
const PROFILE_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/ProfilAmicaliste.png";
const VOTE_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Vote.png";
const AMICALE_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/WebsiteAmicale.png";

const PROXIMO_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Proximo.png"
const WIKETUD_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Wiketud.png";
const EE_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/EEC.png";
const TUTORINSA_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/TutorINSA.png";

const BIB_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Bib.png";
const RU_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/RU.png";
const ROOM_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Salles.png";
const EMAIL_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Bluemind.png";
const ENT_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/ENT.png";
const ACCOUNT_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Account.png";

class ServicesScreen extends React.Component<Props> {

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
                onPress: () => this.onAmicaleServicePress("club-list"),
            },
            {
                title: i18n.t('screens.profile'),
                subtitle: i18n.t('servicesScreen.descriptions.profile'),
                image: PROFILE_IMAGE,
                onPress: () => this.onAmicaleServicePress("profile"),
            },
            {
                title: i18n.t('screens.amicaleWebsite'),
                subtitle: i18n.t('servicesScreen.descriptions.amicaleWebsite'),
                image: AMICALE_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.AMICALE, title: i18n.t('screens.amicaleWebsite')}),
            },
            {
                title: i18n.t('screens.vote'),
                subtitle: i18n.t('servicesScreen.descriptions.vote'),
                image: VOTE_IMAGE,
                onPress: () => this.onAmicaleServicePress("vote"),
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
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.WIKETUD, title: "Wiketud"}),
            },
            {
                title: "Élus Étudiants",
                subtitle: i18n.t('servicesScreen.descriptions.elusEtudiants'),
                image: EE_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.ELUS_ETUDIANTS, title: "Élus Étudiants"}),
            },
            {
                title: "Tutor'INSA",
                subtitle: i18n.t('servicesScreen.descriptions.tutorInsa'),
                image: TUTORINSA_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.TUTOR_INSA, title: "Tutor'INSA"})
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
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.AVAILABLE_ROOMS, title: i18n.t('screens.availableRooms')}),
            },
            {
                title: i18n.t('screens.bib'),
                subtitle: i18n.t('servicesScreen.descriptions.bib'),
                image: BIB_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.BIB, title: i18n.t('screens.bib')}),
            },
            {
                title: i18n.t('screens.bluemind'),
                subtitle: i18n.t('servicesScreen.descriptions.mails'),
                image: EMAIL_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.BLUEMIND, title: i18n.t('screens.bluemind')}),
            },
            {
                title: i18n.t('screens.ent'),
                subtitle: i18n.t('servicesScreen.descriptions.ent'),
                image: ENT_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.ENT, title: i18n.t('screens.ent')}),
            },
            {
                title: i18n.t('screens.insaAccount'),
                subtitle: i18n.t('servicesScreen.descriptions.insaAccount'),
                image: ACCOUNT_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.INSA_ACCOUNT, title: i18n.t('screens.insaAccount')}),
            },
        ];
        this.finalDataset = [
            {
                title: i18n.t("servicesScreen.amicale"),
                description: "LOGIN",
                image: AMICALE_LOGO,
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
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: this.getAboutButton,
        });
    }

    getAboutButton = () =>
        <MaterialHeaderButtons>
            <Item title="information" iconName="information" onPress={this.onAboutPress}/>
        </MaterialHeaderButtons>;

    onAboutPress = () => this.props.navigation.navigate('amicale-contact');

    /**
     * Gets the list title image for the list.
     *
     * If the source is a string, we are using an icon.
     * If the source is a number, we are using an internal image.
     *
     * @param props Props to pass to the component
     * @param source The source image to display. Can be a string for icons or a number for local images
     * @returns {*}
     */
    getListTitleImage(props, source: string | number) {
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

    /**
     * Redirects to the given route or to the login screen if user is not logged in.
     *
     * @param route The route to navigate to
     */
    onAmicaleServicePress(route: string) {
        if (ConnectionManager.getInstance().isLoggedIn())
            this.props.navigation.navigate(route);
        else
            this.props.navigation.navigate("login", {nextScreen: route});
    }

    /**
     * A list item showing a list of available services for the current category
     *
     * @param item
     * @returns {*}
     */
    renderItem = ({item}: { item: listItem }) => {
        return (
            <TouchableRipple
                style={{
                    margin: 5,
                    marginBottom: 20,
                }}
                onPress={() => this.props.navigation.navigate("services-section", {data: item})}
            >
                <View>
                    <Card.Title
                        title={item.title}
                        left={(props) => this.getListTitleImage(props, item.image)}
                        right={(props) => <List.Icon {...props} icon="chevron-right"/>}
                    />
                    <CardList
                        dataset={item.content}
                        isHorizontal={true}
                    />
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
