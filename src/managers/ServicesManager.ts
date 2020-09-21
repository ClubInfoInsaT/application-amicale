/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import AvailableWebsites from '../constants/AvailableWebsites';
import ConnectionManager from './ConnectionManager';
import type {FullDashboardType} from '../screens/Home/HomeScreen';
import getStrippedServicesList from '../utils/Services';

// AMICALE
const CLUBS_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/Clubs.png';
const PROFILE_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/ProfilAmicaliste.png';
const EQUIPMENT_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/Materiel.png';
const VOTE_IMAGE = 'https://etud.insa-toulouse.fr/~amicale_app/images/Vote.png';
const AMICALE_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/WebsiteAmicale.png';

// STUDENTS
const PROXIMO_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/Proximo.png';
const WIKETUD_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/Wiketud.png';
const EE_IMAGE = 'https://etud.insa-toulouse.fr/~amicale_app/images/EEC.png';
const TUTORINSA_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/TutorINSA.png';

// INSA
const BIB_IMAGE = 'https://etud.insa-toulouse.fr/~amicale_app/images/Bib.png';
const RU_IMAGE = 'https://etud.insa-toulouse.fr/~amicale_app/images/RU.png';
const ROOM_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/Salles.png';
const EMAIL_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/Bluemind.png';
const ENT_IMAGE = 'https://etud.insa-toulouse.fr/~amicale_app/images/ENT.png';
const ACCOUNT_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/Account.png';

// SPECIAL
const WASHER_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/ProxiwashLaveLinge.png';
const DRYER_IMAGE =
  'https://etud.insa-toulouse.fr/~amicale_app/images/ProxiwashSecheLinge.png';

const AMICALE_LOGO = require('../../assets/amicale.png');

export const SERVICES_KEY = {
  CLUBS: 'clubs',
  PROFILE: 'profile',
  EQUIPMENT: 'equipment',
  AMICALE_WEBSITE: 'amicale_website',
  VOTE: 'vote',
  PROXIMO: 'proximo',
  WIKETUD: 'wiketud',
  ELUS_ETUDIANTS: 'elus_etudiants',
  TUTOR_INSA: 'tutor_insa',
  RU: 'ru',
  AVAILABLE_ROOMS: 'available_rooms',
  BIB: 'bib',
  EMAIL: 'email',
  ENT: 'ent',
  INSA_ACCOUNT: 'insa_account',
  WASHERS: 'washers',
  DRYERS: 'dryers',
};

export const SERVICES_CATEGORIES_KEY = {
  AMICALE: 'amicale',
  STUDENTS: 'students',
  INSA: 'insa',
  SPECIAL: 'special',
};

export type ServiceItemType = {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  onPress: () => void;
  badgeFunction?: (dashboard: FullDashboardType) => number;
};

export type ServiceCategoryType = {
  key: string;
  title: string;
  subtitle: string;
  image: string | number;
  content: Array<ServiceItemType>;
};

export default class ServicesManager {
  navigation: StackNavigationProp<any>;

  amicaleDataset: Array<ServiceItemType>;

  studentsDataset: Array<ServiceItemType>;

  insaDataset: Array<ServiceItemType>;

  specialDataset: Array<ServiceItemType>;

  categoriesDataset: Array<ServiceCategoryType>;

  constructor(nav: StackNavigationProp<any>) {
    this.navigation = nav;
    this.amicaleDataset = [
      {
        key: SERVICES_KEY.CLUBS,
        title: i18n.t('screens.clubs.title'),
        subtitle: i18n.t('screens.services.descriptions.clubs'),
        image: CLUBS_IMAGE,
        onPress: (): void => this.onAmicaleServicePress('club-list'),
      },
      {
        key: SERVICES_KEY.PROFILE,
        title: i18n.t('screens.profile.title'),
        subtitle: i18n.t('screens.services.descriptions.profile'),
        image: PROFILE_IMAGE,
        onPress: (): void => this.onAmicaleServicePress('profile'),
      },
      {
        key: SERVICES_KEY.EQUIPMENT,
        title: i18n.t('screens.equipment.title'),
        subtitle: i18n.t('screens.services.descriptions.equipment'),
        image: EQUIPMENT_IMAGE,
        onPress: (): void => this.onAmicaleServicePress('equipment-list'),
      },
      {
        key: SERVICES_KEY.AMICALE_WEBSITE,
        title: i18n.t('screens.websites.amicale'),
        subtitle: i18n.t('screens.services.descriptions.amicaleWebsite'),
        image: AMICALE_IMAGE,
        onPress: (): void =>
          nav.navigate('website', {
            host: AvailableWebsites.websites.AMICALE,
            title: i18n.t('screens.websites.amicale'),
          }),
      },
      {
        key: SERVICES_KEY.VOTE,
        title: i18n.t('screens.vote.title'),
        subtitle: i18n.t('screens.services.descriptions.vote'),
        image: VOTE_IMAGE,
        onPress: (): void => this.onAmicaleServicePress('vote'),
      },
    ];
    this.studentsDataset = [
      {
        key: SERVICES_KEY.PROXIMO,
        title: i18n.t('screens.proximo.title'),
        subtitle: i18n.t('screens.services.descriptions.proximo'),
        image: PROXIMO_IMAGE,
        onPress: (): void => nav.navigate('proximo'),
        badgeFunction: (dashboard: FullDashboardType): number =>
          dashboard.proximo_articles,
      },
      {
        key: SERVICES_KEY.WIKETUD,
        title: 'Wiketud',
        subtitle: i18n.t('screens.services.descriptions.wiketud'),
        image: WIKETUD_IMAGE,
        onPress: (): void =>
          nav.navigate('website', {
            host: AvailableWebsites.websites.WIKETUD,
            title: 'Wiketud',
          }),
      },
      {
        key: SERVICES_KEY.ELUS_ETUDIANTS,
        title: 'Élus Étudiants',
        subtitle: i18n.t('screens.services.descriptions.elusEtudiants'),
        image: EE_IMAGE,
        onPress: (): void =>
          nav.navigate('website', {
            host: AvailableWebsites.websites.ELUS_ETUDIANTS,
            title: 'Élus Étudiants',
          }),
      },
      {
        key: SERVICES_KEY.TUTOR_INSA,
        title: "Tutor'INSA",
        subtitle: i18n.t('screens.services.descriptions.tutorInsa'),
        image: TUTORINSA_IMAGE,
        onPress: (): void =>
          nav.navigate('website', {
            host: AvailableWebsites.websites.TUTOR_INSA,
            title: "Tutor'INSA",
          }),
        badgeFunction: (dashboard: FullDashboardType): number =>
          dashboard.available_tutorials,
      },
    ];
    this.insaDataset = [
      {
        key: SERVICES_KEY.RU,
        title: i18n.t('screens.menu.title'),
        subtitle: i18n.t('screens.services.descriptions.self'),
        image: RU_IMAGE,
        onPress: (): void => nav.navigate('self-menu'),
        badgeFunction: (dashboard: FullDashboardType): number =>
          dashboard.today_menu.length,
      },
      {
        key: SERVICES_KEY.AVAILABLE_ROOMS,
        title: i18n.t('screens.websites.rooms'),
        subtitle: i18n.t('screens.services.descriptions.availableRooms'),
        image: ROOM_IMAGE,
        onPress: (): void =>
          nav.navigate('website', {
            host: AvailableWebsites.websites.AVAILABLE_ROOMS,
            title: i18n.t('screens.websites.rooms'),
          }),
      },
      {
        key: SERVICES_KEY.BIB,
        title: i18n.t('screens.websites.bib'),
        subtitle: i18n.t('screens.services.descriptions.bib'),
        image: BIB_IMAGE,
        onPress: (): void =>
          nav.navigate('website', {
            host: AvailableWebsites.websites.BIB,
            title: i18n.t('screens.websites.bib'),
          }),
      },
      {
        key: SERVICES_KEY.EMAIL,
        title: i18n.t('screens.websites.mails'),
        subtitle: i18n.t('screens.services.descriptions.mails'),
        image: EMAIL_IMAGE,
        onPress: (): void =>
          nav.navigate('website', {
            host: AvailableWebsites.websites.BLUEMIND,
            title: i18n.t('screens.websites.mails'),
          }),
      },
      {
        key: SERVICES_KEY.ENT,
        title: i18n.t('screens.websites.ent'),
        subtitle: i18n.t('screens.services.descriptions.ent'),
        image: ENT_IMAGE,
        onPress: (): void =>
          nav.navigate('website', {
            host: AvailableWebsites.websites.ENT,
            title: i18n.t('screens.websites.ent'),
          }),
      },
      {
        key: SERVICES_KEY.INSA_ACCOUNT,
        title: i18n.t('screens.insaAccount.title'),
        subtitle: i18n.t('screens.services.descriptions.insaAccount'),
        image: ACCOUNT_IMAGE,
        onPress: (): void =>
          nav.navigate('website', {
            host: AvailableWebsites.websites.INSA_ACCOUNT,
            title: i18n.t('screens.insaAccount.title'),
          }),
      },
    ];
    this.specialDataset = [
      {
        key: SERVICES_KEY.WASHERS,
        title: i18n.t('screens.proxiwash.washers'),
        subtitle: i18n.t('screens.services.descriptions.washers'),
        image: WASHER_IMAGE,
        onPress: (): void => nav.navigate('proxiwash'),
        badgeFunction: (dashboard: FullDashboardType): number =>
          dashboard.available_washers,
      },
      {
        key: SERVICES_KEY.DRYERS,
        title: i18n.t('screens.proxiwash.dryers'),
        subtitle: i18n.t('screens.services.descriptions.washers'),
        image: DRYER_IMAGE,
        onPress: (): void => nav.navigate('proxiwash'),
        badgeFunction: (dashboard: FullDashboardType): number =>
          dashboard.available_dryers,
      },
    ];
    this.categoriesDataset = [
      {
        key: SERVICES_CATEGORIES_KEY.AMICALE,
        title: i18n.t('screens.services.categories.amicale'),
        subtitle: i18n.t('screens.services.more'),
        image: AMICALE_LOGO,
        content: this.amicaleDataset,
      },
      {
        key: SERVICES_CATEGORIES_KEY.STUDENTS,
        title: i18n.t('screens.services.categories.students'),
        subtitle: i18n.t('screens.services.more'),
        image: 'account-group',
        content: this.studentsDataset,
      },
      {
        key: SERVICES_CATEGORIES_KEY.INSA,
        title: i18n.t('screens.services.categories.insa'),
        subtitle: i18n.t('screens.services.more'),
        image: 'school',
        content: this.insaDataset,
      },
      {
        key: SERVICES_CATEGORIES_KEY.SPECIAL,
        title: i18n.t('screens.services.categories.special'),
        subtitle: i18n.t('screens.services.categories.special'),
        image: 'star',
        content: this.specialDataset,
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
    if (ConnectionManager.getInstance().isLoggedIn()) {
      this.navigation.navigate(route);
    } else {
      this.navigation.navigate('login', {nextScreen: route});
    }
  }

  /**
   * Gets the list of amicale's services
   *
   * @param excludedItems Ids of items to exclude from the returned list
   * @returns {Array<ServiceItemType>}
   */
  getAmicaleServices(excludedItems?: Array<string>): Array<ServiceItemType> {
    if (excludedItems != null) {
      return getStrippedServicesList(excludedItems, this.amicaleDataset);
    }
    return this.amicaleDataset;
  }

  /**
   * Gets the list of students' services
   *
   * @param excludedItems Ids of items to exclude from the returned list
   * @returns {Array<ServiceItemType>}
   */
  getStudentServices(excludedItems?: Array<string>): Array<ServiceItemType> {
    if (excludedItems != null) {
      return getStrippedServicesList(excludedItems, this.studentsDataset);
    }
    return this.studentsDataset;
  }

  /**
   * Gets the list of INSA's services
   *
   * @param excludedItems Ids of items to exclude from the returned list
   * @returns {Array<ServiceItemType>}
   */
  getINSAServices(excludedItems?: Array<string>): Array<ServiceItemType> {
    if (excludedItems != null) {
      return getStrippedServicesList(excludedItems, this.insaDataset);
    }
    return this.insaDataset;
  }

  /**
   * Gets the list of special services
   *
   * @param excludedItems Ids of items to exclude from the returned list
   * @returns {Array<ServiceItemType>}
   */
  getSpecialServices(excludedItems?: Array<string>): Array<ServiceItemType> {
    if (excludedItems != null) {
      return getStrippedServicesList(excludedItems, this.specialDataset);
    }
    return this.specialDataset;
  }

  /**
   * Gets all services sorted by category
   *
   * @param excludedItems Ids of categories to exclude from the returned list
   * @returns {Array<ServiceCategoryType>}
   */
  getCategories(excludedItems?: Array<string>): Array<ServiceCategoryType> {
    if (excludedItems != null) {
      return getStrippedServicesList(excludedItems, this.categoriesDataset);
    }
    return this.categoriesDataset;
  }
}
