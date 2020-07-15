// @flow

import type {cardList} from "../components/Lists/CardList/CardList";
import i18n from "i18n-js";
import AvailableWebsites from "../constants/AvailableWebsites";
import {StackNavigationProp} from "@react-navigation/stack";
import ConnectionManager from "./ConnectionManager";

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

export const SERVICES_KEY = {
    CLUBS: "clubs",
    PROFILE:"profile",
    EQUIPMENT: "equipment",
    AMICALE_WEBSITE: "amicale_website",
    VOTE: "vote",
    PROXIMO: "proximo",
    WIKETUD: "wiketud",
    ELUS_ETUDIANTS: "elus_etudiants",
    TUTOR_INSA: "tutor_insa",
    RU: "ru",
    AVAILABLE_ROOMS: "available_rooms",
    BIB: "bib",
    EMAIL: "email",
    ENT: "ent",
    INSA_ACCOUNT: "insa_account",
}

export default class ServicesManager {

    navigation: StackNavigationProp;

    amicaleDataset: cardList;
    studentsDataset: cardList;
    insaDataset: cardList;

    constructor(nav: StackNavigationProp) {
        this.navigation = nav;
        this.amicaleDataset = [
            {
                key: SERVICES_KEY.CLUBS,
                title: i18n.t('screens.clubs.title'),
                subtitle: i18n.t('screens.services.descriptions.clubs'),
                image: CLUBS_IMAGE,
                onPress: () => this.onAmicaleServicePress("club-list"),
            },
            {
                key: SERVICES_KEY.PROFILE,
                title: i18n.t('screens.profile.title'),
                subtitle: i18n.t('screens.services.descriptions.profile'),
                image: PROFILE_IMAGE,
                onPress: () => this.onAmicaleServicePress("profile"),
            },
            {
                key: SERVICES_KEY.EQUIPMENT,
                title: i18n.t('screens.equipment.title'),
                subtitle: i18n.t('screens.services.descriptions.equipment'),
                image: EQUIPMENT_IMAGE,
                onPress: () => this.onAmicaleServicePress("equipment-list"),
            },
            {
                key: SERVICES_KEY.AMICALE_WEBSITE,
                title: i18n.t('screens.websites.amicale'),
                subtitle: i18n.t('screens.services.descriptions.amicaleWebsite'),
                image: AMICALE_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.AMICALE, title: i18n.t('screens.websites.amicale')}),
            },
            {
                key: SERVICES_KEY.VOTE,
                title: i18n.t('screens.vote.title'),
                subtitle: i18n.t('screens.services.descriptions.vote'),
                image: VOTE_IMAGE,
                onPress: () => this.onAmicaleServicePress("vote"),
            },
        ];
        this.studentsDataset = [
            {
                key: SERVICES_KEY.PROXIMO,
                title: i18n.t('screens.proximo.title'),
                subtitle: i18n.t('screens.services.descriptions.proximo'),
                image: PROXIMO_IMAGE,
                onPress: () => nav.navigate("proximo"),
            },
            {
                key: SERVICES_KEY.WIKETUD,
                title: "Wiketud",
                subtitle: i18n.t('screens.services.descriptions.wiketud'),
                image: WIKETUD_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.WIKETUD, title: "Wiketud"}),
            },
            {
                key: SERVICES_KEY.ELUS_ETUDIANTS,
                title: "Élus Étudiants",
                subtitle: i18n.t('screens.services.descriptions.elusEtudiants'),
                image: EE_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.WIKETUD, title: "Wiketud"}),
            },
            {
                key: SERVICES_KEY.TUTOR_INSA,
                title: "Tutor'INSA",
                subtitle: i18n.t('screens.services.descriptions.tutorInsa'),
                image: TUTORINSA_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.TUTOR_INSA, title: "Tutor'INSA"})
            },
        ];
        this.insaDataset = [
            {
                key: SERVICES_KEY.RU,
                title: i18n.t('screens.menu.title'),
                subtitle: i18n.t('screens.services.descriptions.self'),
                image: RU_IMAGE,
                onPress: () => nav.navigate("self-menu"),
            },
            {
                key: SERVICES_KEY.AVAILABLE_ROOMS,
                title: i18n.t('screens.websites.rooms'),
                subtitle: i18n.t('screens.services.descriptions.availableRooms'),
                image: ROOM_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.AVAILABLE_ROOMS, title: i18n.t('screens.websites.rooms')}),
            },
            {
                key: SERVICES_KEY.BIB,
                title: i18n.t('screens.websites.bib'),
                subtitle: i18n.t('screens.services.descriptions.bib'),
                image: BIB_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.BIB, title: i18n.t('screens.websites.bib')}),
            },
            {
                key: SERVICES_KEY.EMAIL,
                title: i18n.t('screens.websites.mails'),
                subtitle: i18n.t('screens.services.descriptions.mails'),
                image: EMAIL_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.BLUEMIND, title: i18n.t('screens.websites.mails')}),
            },
            {
                key: SERVICES_KEY.ENT,
                title: i18n.t('screens.websites.ent'),
                subtitle: i18n.t('screens.services.descriptions.ent'),
                image: ENT_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.ENT, title: i18n.t('screens.websites.ent')}),
            },
            {
                key: SERVICES_KEY.INSA_ACCOUNT,
                title: i18n.t('screens.insaAccount.title'),
                subtitle: i18n.t('screens.services.descriptions.insaAccount'),
                image: ACCOUNT_IMAGE,
                onPress: () => nav.navigate("website", {host: AvailableWebsites.websites.INSA_ACCOUNT, title: i18n.t('screens.insaAccount.title')}),
            },
        ];
    }

    /**
     * Redirects the user to the login screen if he is not logged in
     *
     * @param route
     * @returns {null}
     */
    onAmicaleServicePress(route: string) {
        if (ConnectionManager.getInstance().isLoggedIn())
            this.navigation.navigate(route);
        else
            this.navigation.navigate("login", {nextScreen: route});
    }

    /**
     * Gets the given services list without items of the given ids
     *
     * @param idList The ids of items to remove
     * @param sourceList The item list to use as source
     * @returns {[]}
     */
    getStrippedList(idList: Array<string>, sourceList: cardList) {
        let newArray = [];
        for (let i = 0; i < sourceList.length; i++) {
            const item = sourceList[i];
            if (!(idList.includes(item.key)))
                newArray.push(item);
        }
        return newArray;
    }

    /**
     * Gets a services list of items with the given ids only
     *
     * @param idList The ids of items to find
     * @returns {[]}
     */
    getServicesOfId(idList: Array<string>) {
        const allServices = [
            ...this.amicaleDataset,
            ...this.studentsDataset,
            ...this.insaDataset,
        ]
        let servicesFound = [];
        for (let i = 0; i < allServices.length; i++) {
            const item = allServices[i];
            if (idList.includes(item.key)) {
                servicesFound.push(item);
                if (servicesFound.length === idList.length)
                    break;
            }
        }
        return servicesFound;
    }

    /**
     * Gets the list of amicale's services
     *
     * @param excludedItems Ids of items to exclude from the returned list
     * @returns {cardList|*[]}
     */
    getAmicaleServices(excludedItems?: Array<string>) {
        if (excludedItems != null)
            return this.getStrippedList(excludedItems, this.amicaleDataset)
        else
            return this.amicaleDataset;
    }

    /**
     * Gets the list of students' services
     *
     * @param excludedItems Ids of items to exclude from the returned list
     * @returns {cardList|*[]}
     */
    getStudentServices(excludedItems?: Array<string>) {
        if (excludedItems != null)
            return this.getStrippedList(excludedItems, this.studentsDataset)
        else
            return this.studentsDataset;
    }

    /**
     * Gets the list of INSA's services
     *
     * @param excludedItems Ids of items to exclude from the returned list
     * @returns {cardList|*[]}
     */
    getINSAServices(excludedItems?: Array<string>) {
        if (excludedItems != null)
            return this.getStrippedList(excludedItems, this.insaDataset)
        else
            return this.insaDataset;
    }

}
