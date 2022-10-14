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
import type { FullDashboardType } from '../screens/Home/HomeScreen';
import Urls from '../constants/Urls';
import { MainRoutes } from '../navigation/MainNavigator';
import { TabRoutes } from '../navigation/TabNavigator';

/**
 * Gets the given services list without items of the given ids
 *
 * @param idList The ids of items to remove
 * @param sourceList The item list to use as source
 * @returns {[]}
 */
export default function getStrippedServicesList<T extends { key: string }>(
  sourceList: Array<T>,
  idList?: Array<string>
) {
  if (idList) {
    return sourceList.filter((item) => !idList.includes(item.key));
  } else {
    return sourceList;
  }
}

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
  YEARLY_PLANNING: 'yearly_planning',
  RU: 'ru',
  AVAILABLE_ROOMS: 'available_rooms',
  BIB: 'bib',
  EMAIL: 'email',
  ENT: 'ent',
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

function getAmicaleOnPress(
  route: MainRoutes,
  onPress: (route: MainRoutes, params?: { [key: string]: any }) => void,
  isLoggedIn: boolean
) {
  if (isLoggedIn) {
    return () => onPress(route);
  } else {
    return () => onPress(MainRoutes.Login, { nextScreen: route });
  }
}

export function getAmicaleServices(
  onPress: (route: MainRoutes, params?: { [key: string]: any }) => void,
  isLoggedIn: boolean,
  excludedItems?: Array<string>
): Array<ServiceItemType> {
  const amicaleDataset = [
    {
      key: SERVICES_KEY.CLUBS,
      title: i18n.t('screens.clubs.title'),
      subtitle: i18n.t('screens.services.descriptions.clubs'),
      image: Urls.images.clubs,
      onPress: getAmicaleOnPress(MainRoutes.ClubList, onPress, isLoggedIn),
    },
    {
      key: SERVICES_KEY.PROFILE,
      title: i18n.t('screens.profile.title'),
      subtitle: i18n.t('screens.services.descriptions.profile'),
      image: Urls.images.profile,
      onPress: getAmicaleOnPress(MainRoutes.Profile, onPress, isLoggedIn),
    },
    {
      key: SERVICES_KEY.EQUIPMENT,
      title: i18n.t('screens.equipment.title'),
      subtitle: i18n.t('screens.services.descriptions.equipment'),
      image: Urls.images.equipment,
      onPress: getAmicaleOnPress(MainRoutes.EquipmentList, onPress, isLoggedIn),
    },
    {
      key: SERVICES_KEY.AMICALE_WEBSITE,
      title: i18n.t('screens.websites.amicale'),
      subtitle: i18n.t('screens.services.descriptions.amicaleWebsite'),
      image: Urls.images.amicale,
      onPress: () =>
        onPress(MainRoutes.Website, {
          host: Urls.websites.amicale,
          title: i18n.t('screens.websites.amicale'),
        }),
    },
    {
      key: SERVICES_KEY.VOTE,
      title: i18n.t('screens.vote.title'),
      subtitle: i18n.t('screens.services.descriptions.vote'),
      image: Urls.images.vote,
      onPress: () => onPress(MainRoutes.Vote),
    },
  ];
  return getStrippedServicesList(amicaleDataset, excludedItems);
}

export function getStudentServices(
  onPress: (route: MainRoutes, params?: { [key: string]: any }) => void,
  excludedItems?: Array<string>
): Array<ServiceItemType> {
  const studentsDataset = [
    {
      key: SERVICES_KEY.PROXIMO,
      title: i18n.t('screens.proximo.title'),
      subtitle: i18n.t('screens.services.descriptions.proximo'),
      image: Urls.images.proximo,
      onPress: () => onPress(MainRoutes.Proximo),
      badgeFunction: (dashboard: FullDashboardType): number =>
        dashboard.proximo_articles,
    },
    {
      key: SERVICES_KEY.WIKETUD,
      title: 'Wiketud',
      subtitle: i18n.t('screens.services.descriptions.wiketud'),
      image: Urls.images.wiketud,
      onPress: () =>
        onPress(MainRoutes.Website, {
          host: Urls.websites.wiketud,
          title: 'Wiketud',
        }),
    },
    {
      key: SERVICES_KEY.ELUS_ETUDIANTS,
      title: 'Élus Étudiants',
      subtitle: i18n.t('screens.services.descriptions.elusEtudiants'),
      image: Urls.images.elusEtudiants,
      onPress: () =>
        onPress(MainRoutes.Website, {
          host: Urls.websites.elusEtudiants,
          title: 'Élus Étudiants',
        }),
    },
    {
      key: SERVICES_KEY.TUTOR_INSA,
      title: "Tutor'INSA",
      subtitle: i18n.t('screens.services.descriptions.tutorInsa'),
      image: Urls.images.tutorInsa,
      onPress: () =>
        onPress(MainRoutes.Website, {
          host: Urls.websites.tutorInsa,
          title: "Tutor'INSA",
        }),
      badgeFunction: (dashboard: FullDashboardType): number =>
        dashboard.available_tutorials,
    },
    {
      key: SERVICES_KEY.YEARLY_PLANNING,
      title: i18n.t('screens.services.titles.yearlyPlanning'),
      subtitle: i18n.t('screens.services.descriptions.yearlyPlanning'),
      image: Urls.images.availableRooms,
      onPress: () =>
        onPress(MainRoutes.Website, {
          host: Urls.websites.yearlyPlanning,
          title: "Planning de l'année",
        }),
    },
  ];
  return getStrippedServicesList(studentsDataset, excludedItems);
}

export function getINSAServices(
  onPress: (route: MainRoutes, params?: { [key: string]: any }) => void,
  excludedItems?: Array<string>
): Array<ServiceItemType> {
  const insaDataset = [
    {
      key: SERVICES_KEY.RU,
      title: i18n.t('screens.menu.title'),
      subtitle: i18n.t('screens.services.descriptions.self'),
      image: Urls.images.menu,
      onPress: () => onPress(MainRoutes.SelfMenu),
      badgeFunction: (dashboard: FullDashboardType): number =>
        dashboard.today_menu.length,
    },
    {
      key: SERVICES_KEY.AVAILABLE_ROOMS,
      title: i18n.t('screens.websites.rooms'),
      subtitle: i18n.t('screens.services.descriptions.availableRooms'),
      image: Urls.images.availableRooms,
      onPress: () =>
        onPress(MainRoutes.Website, {
          host: Urls.websites.availableRooms,
          title: i18n.t('screens.websites.rooms'),
        }),
    },
    {
      key: SERVICES_KEY.BIB,
      title: i18n.t('screens.websites.bib'),
      subtitle: i18n.t('screens.services.descriptions.bib'),
      image: Urls.images.bib,
      onPress: () =>
        onPress(MainRoutes.Website, {
          host: Urls.websites.bib,
          title: i18n.t('screens.websites.bib'),
        }),
    },
    {
      key: SERVICES_KEY.EMAIL,
      title: i18n.t('screens.websites.mails'),
      subtitle: i18n.t('screens.services.descriptions.mails'),
      image: Urls.images.bluemind,
      onPress: () =>
        onPress(MainRoutes.Website, {
          host: Urls.websites.bluemind,
          title: i18n.t('screens.websites.mails'),
        }),
    },
    {
      key: SERVICES_KEY.ENT,
      title: i18n.t('screens.websites.ent'),
      subtitle: i18n.t('screens.services.descriptions.ent'),
      image: Urls.images.ent,
      onPress: () =>
        onPress(MainRoutes.Website, {
          host: Urls.websites.ent,
          title: i18n.t('screens.websites.ent'),
        }),
    },
    {
      key: SERVICES_KEY.ENT,
      title: i18n.t('screens.websites.schooling'),
      subtitle: i18n.t('screens.services.descriptions.schooling'),
      image: Urls.images.tutorInsa,
      onPress: () =>
        onPress(MainRoutes.Website, {
          host: Urls.websites.schooling,
          title: i18n.t('screens.websites.schooling'),
        }),
    },
  ];
  return getStrippedServicesList(insaDataset, excludedItems);
}

export function getSpecialServices(
  onPress: (
    route: MainRoutes | TabRoutes,
    params?: { [key: string]: any }
  ) => void,
  excludedItems?: Array<string>
): Array<ServiceItemType> {
  const specialDataset = [
    {
      key: SERVICES_KEY.WASHERS,
      title: i18n.t('screens.proxiwash.washers'),
      subtitle: i18n.t('screens.services.descriptions.washers'),
      image: Urls.images.washer,
      onPress: () => onPress(TabRoutes.Proxiwash),
      badgeFunction: (dashboard: FullDashboardType): number =>
        dashboard.available_washers,
    },
    {
      key: SERVICES_KEY.DRYERS,
      title: i18n.t('screens.proxiwash.dryers'),
      subtitle: i18n.t('screens.services.descriptions.washers'),
      image: Urls.images.dryer,
      onPress: () => onPress(TabRoutes.Proxiwash),
      badgeFunction: (dashboard: FullDashboardType): number =>
        dashboard.available_dryers,
    },
  ];
  return getStrippedServicesList(specialDataset, excludedItems);
}

export function getCategories(
  onPress: (
    route: MainRoutes | TabRoutes,
    params?: { [key: string]: any }
  ) => void,
  isLoggedIn: boolean,
  excludedItems?: Array<string>
): Array<ServiceCategoryType> {
  const categoriesDataset = [
    {
      key: SERVICES_CATEGORIES_KEY.AMICALE,
      title: i18n.t('screens.services.categories.amicale'),
      subtitle: i18n.t('screens.services.more'),
      image: AMICALE_LOGO,
      content: getAmicaleServices(onPress, isLoggedIn),
    },
    {
      key: SERVICES_CATEGORIES_KEY.STUDENTS,
      title: i18n.t('screens.services.categories.students'),
      subtitle: i18n.t('screens.services.more'),
      image: 'account-group',
      content: getStudentServices(onPress),
    },
    {
      key: SERVICES_CATEGORIES_KEY.INSA,
      title: i18n.t('screens.services.categories.insa'),
      subtitle: i18n.t('screens.services.more'),
      image: 'school',
      content: getINSAServices(onPress),
    },
    {
      key: SERVICES_CATEGORIES_KEY.SPECIAL,
      title: i18n.t('screens.services.categories.special'),
      subtitle: i18n.t('screens.services.categories.special'),
      image: 'star',
      content: getSpecialServices(onPress),
    },
  ];
  return getStrippedServicesList(categoriesDataset, excludedItems);
}
