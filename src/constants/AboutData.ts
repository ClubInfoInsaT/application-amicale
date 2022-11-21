import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'i18n-js';
import { Linking, Platform } from 'react-native';
import { ListItemType } from '../components/About/AboutCardItem';
import { MainRoutes } from '../navigation/MainNavigator';
import Urls from './Urls';

export type MemberItemType = {
  name: string;
  message: string;
  icon: string;
  trollLink?: string;
  linkedin?: string;
  mail?: string;
};

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
export function openWebLink(link: string) {
  Linking.openURL(link);
}

export const majorContributors: Array<MemberItemType> = [
  {
    name: 'Paul Alnet',
    message: i18n.t('screens.about.user.paul'),
    icon: 'crown',
    linkedin: 'https://www.linkedin.com/in/paul-alnet/',
    mail:
      'mailto:alnet@insa-toulouse.fr?' +
      'subject=' +
      'Application Amicale INSA Toulouse' +
      '&body=' +
      'Coucou !\n\n',
  },
  {
    name: 'Arnaud Vergnet',
    message: i18n.t('screens.about.user.arnaud'),
    icon: 'bed',
    trollLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    linkedin: 'https://www.linkedin.com/in/arnaud-vergnet-434ba5179/',
    mail:
      'mailto:vergnet@etud.insa-toulouse.fr?' +
      'subject=' +
      'Application Amicale INSA Toulouse' +
      '&body=' +
      'Coucou !\n\n',
  },
  {
    name: 'Gérald Leban',
    message: i18n.t('screens.about.user.gerald'),
    icon: 'xml',
    linkedin: 'https://www.linkedin.com/in/g%C3%A9rald-leban-6806081a2/',
    mail:
      'mailto:leban@insa-toulouse.fr?' +
      'subject=' +
      'Application Amicale INSA Toulouse' +
      '&body=' +
      'Coucou !\n\n',
  },
  {
    name: 'Raphaël Lacroix',
    message: i18n.t('screens.about.user.raphael'),
    icon: 'xml',
    linkedin: 'https://www.linkedin.com/in/rapha%C3%ABl-lacroix-783010197/',
    mail:
      'mailto:rlacroix@insa-toulouse.fr?' +
      'subject=' +
      'Application Amicale INSA Toulouse' +
      '&body=' +
      'Coucou !\n\n',
  },
];

export const helpfulUsers: Array<MemberItemType> = [
  {
    name: 'Béranger Quintana Y Arciosana',
    message: i18n.t('screens.about.user.beranger'),
    icon: 'account-heart',
  },
  {
    name: 'Céline Tassin',
    message: i18n.t('screens.about.user.celine'),
    icon: 'brush',
  },
  {
    name: 'Damien Molina',
    message: i18n.t('screens.about.user.damien'),
    icon: 'web',
  },
  {
    name: 'Titouan Labourdette',
    message: i18n.t('screens.about.user.titouan'),
    icon: 'shield-bug',
  },
  {
    name: 'Théo Tami',
    message: i18n.t('screens.about.user.theo'),
    icon: 'food-apple',
  },
];

const getMemberData = (
  data: Array<MemberItemType>,
  onContributorListItemPress: (user: MemberItemType) => void
): Array<ListItemType> => {
  const final: Array<ListItemType> = [];
  data.forEach((item) => {
    final.push({
      onPressCallback: () => onContributorListItemPress(item),
      icon: item.icon,
      text: item.name,
      showChevron: false,
    });
  });
  return final;
};

export const getTeamData = (
  navigation: StackNavigationProp<any>,
  onPress: (user: MemberItemType) => void
) => [
  ...getMemberData(majorContributors, onPress),
  {
    onPressCallback: () => {
      navigation.navigate(MainRoutes.Feedback);
    },
    icon: 'hand-pointing-right',
    text: i18n.t('screens.about.user.you'),
    showChevron: true,
  },
];

export const getThanksData = (onPress: (user: MemberItemType) => void) =>
  getMemberData(helpfulUsers, onPress);

export const getAppData = (
  navigation: StackNavigationProp<any>
): Array<ListItemType> => [
  {
    onPressCallback: () => {
      openWebLink(
        Platform.OS === 'ios' ? Urls.about.appstore : Urls.about.playstore
      );
    },
    icon: Platform.OS === 'ios' ? 'apple' : 'google-play',
    text:
      Platform.OS === 'ios'
        ? i18n.t('screens.about.appstore')
        : i18n.t('screens.about.playstore'),
    showChevron: true,
  },
  {
    onPressCallback: () => {
      navigation.navigate(MainRoutes.Feedback);
    },
    icon: 'bug',
    text: i18n.t('screens.feedback.homeButtonTitle'),
    showChevron: true,
  },
  {
    onPressCallback: () => {
      openWebLink(Urls.about.git);
    },
    icon: 'git',
    text: 'Git',
    showChevron: true,
  },
  {
    onPressCallback: () => {
      openWebLink(Urls.about.changelog);
    },
    icon: 'refresh',
    text: i18n.t('screens.about.changelog'),
    showChevron: true,
  },
  {
    onPressCallback: () => {
      openWebLink(Urls.about.license);
    },
    icon: 'file-document',
    text: i18n.t('screens.about.license'),
    showChevron: true,
  },
];

export const getTechnoData = (
  navigation: StackNavigationProp<any>
): Array<ListItemType> => [
  {
    onPressCallback: () => {
      openWebLink(Urls.about.react);
    },
    icon: 'react',
    text: i18n.t('screens.about.reactNative'),
    showChevron: true,
  },
  {
    onPressCallback: () => {
      navigation.navigate(MainRoutes.Dependencies);
    },
    icon: 'developer-board',
    text: i18n.t('screens.about.libs'),
    showChevron: true,
  },
];
