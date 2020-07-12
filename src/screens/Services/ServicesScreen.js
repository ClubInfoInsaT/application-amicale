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
import {MASCOT_STYLE} from "../../components/Mascot/Mascot";
import MascotPopup from "../../components/Mascot/MascotPopup";
import AsyncStorageManager from "../../managers/AsyncStorageManager";

type Props = {
    navigation: StackNavigationProp,
    collapsibleStack: Collapsible,
    theme: CustomTheme,
}

type State = {
    mascotDialogVisible: boolean,
}


export type listItem = {
    title: string,
    description: string,
    image: string | number,
    content: cardList,
}

const AMICALE_LOGO = require("../../../assets/amicale.png");

const CLUBS_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Clubs.png";
const PROFILE_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/ProfilAmicaliste.png";
const EQUIPMENT_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Materiel.png";
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

class ServicesScreen extends React.Component<Props, State> {

    amicaleDataset: cardList;
    studentsDataset: cardList;
    insaDataset: cardList;

    finalDataset: Array<listItem>

    state = {
        mascotDialogVisible: AsyncStorageManager.getInstance().preferences.servicesShowBanner.current === "1"
    }

    constructor(props) {
        super(props);
        const nav = props.navigation;
        this.amicaleDataset = [
            {
                title: i18n.t('screens.clubs.title'),
                subtitle: i18n.t('screens.services.descriptions.clubs'),
                image: CLUBS_IMAGE,
                onPress: () => this.onAmicaleServicePress("club-list"),
            },
            {
                title: i18n.t('screens.profile.title'),
                subtitle: i18n.t('screens.services.descriptions.profile'),
                image: PROFILE_IMAGE,
                onPress: () => this.onAmicaleServicePress("profile"),
            },
            {
                title: i18n.t('screens.equipment.title'),
                subtitle: i18n.t('screens.services.descriptions.equipment'),
                image: EQUIPMENT_IMAGE,
                onPress: () => this.onAmicaleServicePress("equipment-list"),
            },
            {
                title: i18n.t('screens.websites.amicale'),
                subtitle: i18n.t('screens.services.descriptions.amicaleWebsite'),
                image: AMICALE_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.AMICALE, title: i18n.t('screens.websites.amicale')}),
            },
            {
                title: i18n.t('screens.vote.title'),
                subtitle: i18n.t('screens.services.descriptions.vote'),
                image: VOTE_IMAGE,
                onPress: () => this.onAmicaleServicePress("vote"),
            },
        ];
        this.studentsDataset = [
            {
                title: i18n.t('screens.proximo.title'),
                subtitle: i18n.t('screens.services.descriptions.proximo'),
                image: PROXIMO_IMAGE,
                onPress: () => nav.navigate("proximo"),
            },
            {
                title: "Wiketud",
                subtitle: i18n.t('screens.services.descriptions.wiketud'),
                image: WIKETUD_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.WIKETUD, title: "Wiketud"}),
            },
            {
                title: "Élus Étudiants",
                subtitle: i18n.t('screens.services.descriptions.elusEtudiants'),
                image: EE_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.ELUS_ETUDIANTS, title: "Élus Étudiants"}),
            },
            {
                title: "Tutor'INSA",
                subtitle: i18n.t('screens.services.descriptions.tutorInsa'),
                image: TUTORINSA_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.TUTOR_INSA, title: "Tutor'INSA"})
            },
        ];
        this.insaDataset = [
            {
                title: i18n.t('screens.menu.title'),
                subtitle: i18n.t('screens.services.descriptions.self'),
                image: RU_IMAGE,
                onPress: () => nav.navigate("self-menu"),
            },
            {
                title: i18n.t('screens.websites.rooms'),
                subtitle: i18n.t('screens.services.descriptions.availableRooms'),
                image: ROOM_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.AVAILABLE_ROOMS, title: i18n.t('screens.websites.rooms')}),
            },
            {
                title: i18n.t('screens.websites.bib'),
                subtitle: i18n.t('screens.services.descriptions.bib'),
                image: BIB_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.BIB, title: i18n.t('screens.websites.bib')}),
            },
            {
                title: i18n.t('screens.websites.mails'),
                subtitle: i18n.t('screens.services.descriptions.mails'),
                image: EMAIL_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.BLUEMIND, title: i18n.t('screens.websites.mails')}),
            },
            {
                title: i18n.t('screens.websites.ent'),
                subtitle: i18n.t('screens.services.descriptions.ent'),
                image: ENT_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.ENT, title: i18n.t('screens.websites.ent')}),
            },
            {
                title: i18n.t('screens.insaAccount.title'),
                subtitle: i18n.t('screens.services.descriptions.insaAccount'),
                image: ACCOUNT_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.INSA_ACCOUNT, title: i18n.t('screens.insaAccount.title')}),
            },
        ];
        this.finalDataset = [
            {
                title: i18n.t("screens.services.categories.amicale"),
                description: i18n.t("screens.services.more"),
                image: AMICALE_LOGO,
                content: this.amicaleDataset
            },
            {
                title: i18n.t("screens.services.categories.students"),
                description: i18n.t("screens.services.more"),
                image: 'account-group',
                content: this.studentsDataset
            },
            {
                title: i18n.t("screens.services.categories.insa"),
                description: i18n.t("screens.services.more"),
                image: 'school',
                content: this.insaDataset
            },
        ];
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: this.getAboutButton,
        });
    }


    /**
     * Callback used when closing the banner.
     * This hides the banner and saves to preferences to prevent it from reopening
     */
    onHideMascotDialog = () => {
        this.setState({mascotDialogVisible: false});
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.servicesShowBanner.key,
            '0'
        );
    };

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
                        subtitle={item.description}
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
        return (
            <View>
                <Animated.FlatList
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
                <MascotPopup
                    visible={this.state.mascotDialogVisible}
                    title={i18n.t("screens.services.mascotDialog.title")}
                    message={i18n.t("screens.services.mascotDialog.message")}
                    icon={"cloud-question"}
                    buttons={{
                        action: null,
                        cancel: {
                            message: i18n.t("screens.services.mascotDialog.button"),
                            icon: "check",
                            onPress: this.onHideMascotDialog,
                        }
                    }}
                    emotion={MASCOT_STYLE.WINK}
                />
            </View>
        );
    }
}

export default withCollapsible(withTheme(ServicesScreen));
