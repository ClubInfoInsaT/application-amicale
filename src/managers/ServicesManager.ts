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
import { StackNavigationProp } from '@react-navigation/stack';
import ConnectionManager from './ConnectionManager';
import type { FullDashboardType } from '../screens/Home/HomeScreen';
import getStrippedServicesList from '../utils/Services';
import Urls from '../constants/Urls';

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
  image: string | number;
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
        image: Urls.images.clubs,
        onPress: (): void => this.onAmicaleServicePress('club-list'),
      },
      {
        key: SERVICES_KEY.PROFILE,
        title: i18n.t('screens.profile.title'),
        subtitle: i18n.t('screens.services.descriptions.profile'),
        image: Urls.images.profile,
        onPress: (): void => this.onAmicaleServicePress('profile'),
      },
      {
        key: SERVICES_KEY.EQUIPMENT,
        title: i18n.t('screens.equipment.title'),
        subtitle: i18n.t('screens.services.descriptions.equipment'),
        image: Urls.images.equipment,
        onPress: (): void => this.onAmicaleServicePress('equipment-list'),
      },
      {
        key: SERVICES_KEY.AMICALE_WEBSITE,
        title: i18n.t('screens.websites.amicale'),
        subtitle: i18n.t('screens.services.descriptions.amicaleWebsite'),
        image: Urls.images.amicale,
        onPress: (): void =>
          nav.navigate('website', {
            host: Urls.websites.amicale,
            title: i18n.t('screens.websites.amicale'),
          }),
      },
      {
        key: SERVICES_KEY.VOTE,
        title: i18n.t('screens.vote.title'),
        subtitle: i18n.t('screens.services.descriptions.vote'),
        image: Urls.images.vote,
        onPress: (): void => this.onAmicaleServicePress('vote'),
      },
    ];
    this.studentsDataset = [
      {
        key: SERVICES_KEY.PROXIMO,
        title: i18n.t('screens.proximo.title'),
        subtitle: i18n.t('screens.services.descriptions.proximo'),
        image: Urls.images.proximo,
        onPress: (): void => nav.navigate('proximo'),
        badgeFunction: (dashboard: FullDashboardType): number =>
          dashboard.proximo_articles,
      },
      {
        key: SERVICES_KEY.WIKETUD,
        title: 'Wiketud',
        subtitle: i18n.t('screens.services.descriptions.wiketud'),
        image: Urls.images.wiketud,
        onPress: (): void =>
          nav.navigate('website', {
            host: Urls.websites.wiketud,
            title: 'Wiketud',
          }),
      },
      {
        key: SERVICES_KEY.ELUS_ETUDIANTS,
        title: 'Élus Étudiants',
        subtitle: i18n.t('screens.services.descriptions.elusEtudiants'),
        image: Urls.images.elusEtudiants,
        onPress: (): void =>
          nav.navigate('website', {
            host: Urls.websites.elusEtudiants,
            title: 'Élus Étudiants',
          }),
      },
      {
        key: SERVICES_KEY.TUTOR_INSA,
        title: "Tutor'INSA",
        subtitle: i18n.t('screens.services.descriptions.tutorInsa'),
        image: Urls.images.tutorInsa,
        onPress: (): void =>
          nav.navigate('website', {
            host: Urls.websites.tutorInsa,
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
        image: Urls.images.menu,
        onPress: (): void => nav.navigate('self-menu'),
        badgeFunction: (dashboard: FullDashboardType): number =>
          dashboard.today_menu.length,
      },
      {
        key: SERVICES_KEY.AVAILABLE_ROOMS,
        title: i18n.t('screens.websites.rooms'),
        subtitle: i18n.t('screens.services.descriptions.availableRooms'),
        image: Urls.images.availableRooms,
        onPress: (): void =>
          nav.navigate('website', {
            host: Urls.websites.availableRooms,
            title: i18n.t('screens.websites.rooms'),
          }),
      },
      {
        key: SERVICES_KEY.BIB,
        title: i18n.t('screens.websites.bib'),
        subtitle: i18n.t('screens.services.descriptions.bib'),
        image: Urls.images.bib,
        onPress: (): void =>
          nav.navigate('website', {
            host: Urls.websites.bib,
            title: i18n.t('screens.websites.bib'),
          }),
      },
      {
        key: SERVICES_KEY.EMAIL,
        title: i18n.t('screens.websites.mails'),
        subtitle: i18n.t('screens.services.descriptions.mails'),
        image: Urls.images.bluemind,
        onPress: (): void =>
          nav.navigate('website', {
            host: Urls.websites.bluemind,
            title: i18n.t('screens.websites.mails'),
          }),
      },
      {
        key: SERVICES_KEY.ENT,
        title: i18n.t('screens.websites.ent'),
        subtitle: i18n.t('screens.services.descriptions.ent'),
        image: Urls.images.ent,
        onPress: (): void =>
          nav.navigate('website', {
            host: Urls.websites.ent,
            title: i18n.t('screens.websites.ent'),
          }),
      },
      {
        key: SERVICES_KEY.INSA_ACCOUNT,
        title: i18n.t('screens.insaAccount.title'),
        subtitle: i18n.t('screens.services.descriptions.insaAccount'),
        image: Urls.images.insaAccount,
        onPress: (): void =>
          nav.navigate('website', {
            host: Urls.websites.insaAccount,
            title: i18n.t('screens.insaAccount.title'),
          }),
      },
    ];
    this.specialDataset = [
      {
        key: SERVICES_KEY.WASHERS,
        title: i18n.t('screens.proxiwash.washers'),
        subtitle: i18n.t('screens.services.descriptions.washers'),
        image: Urls.images.washer,
        onPress: (): void => nav.navigate('proxiwash'),
        badgeFunction: (dashboard: FullDashboardType): number =>
          dashboard.available_washers,
      },
      {
        key: SERVICES_KEY.DRYERS,
        title: i18n.t('screens.proxiwash.dryers'),
        subtitle: i18n.t('screens.services.descriptions.washers'),
        image: Urls.images.dryer,
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
      this.navigation.navigate('login', { nextScreen: route });
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
