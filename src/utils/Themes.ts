import { DarkTheme, DefaultTheme } from 'react-native-paper';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      primary: string;
      accent: string;
      border: string;
      tabIcon: string;
      card: string;
      dividerBackground: string;
      ripple: string;
      textDisabled: string;
      icon: string;
      subtitle: string;
      success: string;
      warning: string;
      danger: string;

      // Calendar/Agenda
      agendaBackgroundColor: string;
      agendaDayTextColor: string;

      // PROXIWASH
      proxiwashFinishedColor: string;
      proxiwashReadyColor: string;
      proxiwashRunningColor: string;
      proxiwashRunningNotStartedColor: string;
      proxiwashRunningBgColor: string;
      proxiwashBrokenColor: string;
      proxiwashErrorColor: string;
      proxiwashUnknownColor: string;

      // Screens
      planningColor: string;
      proximoColor: string;
      proxiwashColor: string;
      menuColor: string;
      tutorinsaColor: string;

      // Tetris
      tetrisBackground: string;
      tetrisScore: string;
      tetrisI: string;
      tetrisO: string;
      tetrisT: string;
      tetrisS: string;
      tetrisZ: string;
      tetrisJ: string;
      tetrisL: string;

      gameGold: string;
      gameSilver: string;
      gameBronze: string;

      // Mascot Popup
      mascotMessageArrow: string;
    }
  }
}

const semaineClimatEnergie =
  new Date(2025, 9, 9).getTime() < Date.now() && // Months are 0-indexed
  new Date(2025, 9, 11).getTime() > Date.now();

export const CustomWhiteTheme: ReactNativePaper.Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: semaineClimatEnergie ? '#1ca81c' : '#be1522',
    accent: semaineClimatEnergie ? '#1ca81c' : '#be1522',
    border: '#e2e2e2',
    tabIcon: '#929292',
    card: '#fff',
    dividerBackground: '#e2e2e2',
    ripple: 'rgba(0,0,0,0.2)',
    textDisabled: '#c1c1c1',
    icon: '#5d5d5d',
    subtitle: '#707070',
    success: '#5cb85c',
    warning: '#f0ad4e',
    danger: '#d9534f',

    // Calendar/Agenda
    agendaBackgroundColor: '#f3f3f4',
    agendaDayTextColor: '#636363',

    // PROXIWASH
    proxiwashFinishedColor: '#a5dc9d',
    proxiwashReadyColor: 'transparent',
    proxiwashRunningColor: '#a0ceff',
    proxiwashRunningNotStartedColor: '#c9e0ff',
    proxiwashRunningBgColor: '#c7e3ff',
    proxiwashBrokenColor: '#ffa8a2',
    proxiwashErrorColor: '#ffa8a2',
    proxiwashUnknownColor: '#b6b6b6',

    // Screens
    planningColor: '#d9b10a',
    proximoColor: '#ec5904',
    proxiwashColor: '#1fa5ee',
    menuColor: '#e91314',
    tutorinsaColor: '#f93943',

    // Tetris
    tetrisBackground: '#f0f0f0',
    tetrisScore: '#e2bd33',
    tetrisI: '#be1522',
    tetrisO: '#EB6C1F',
    tetrisT: '#5cb85c',
    tetrisS: '#5294E2',
    tetrisZ: '#dede00',
    tetrisJ: '#69009d',
    tetrisL: '#553716',

    gameGold: '#ffd610',
    gameSilver: '#7b7b7b',
    gameBronze: '#a15218',

    // Mascot Popup
    mascotMessageArrow: '#dedede',
  },
};

export const CustomDarkTheme: ReactNativePaper.Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: semaineClimatEnergie ? '#1ca81c' : '#be1522',
    accent: semaineClimatEnergie ? '#1ca81c' : '#be1522',
    border: '#222222',
    tabIcon: '#6d6d6d',
    card: 'rgb(18,18,18)',
    dividerBackground: '#222222',
    ripple: 'rgba(255,255,255,0.2)',
    textDisabled: '#5b5b5b',
    icon: '#b3b3b3',
    subtitle: '#aaaaaa',
    success: '#5cb85c',
    warning: '#f0ad4e',
    danger: '#d9534f',

    // Calendar/Agenda
    agendaBackgroundColor: '#171717',
    agendaDayTextColor: '#6d6d6d',

    // PROXIWASH
    proxiwashFinishedColor: '#31682c',
    proxiwashReadyColor: 'transparent',
    proxiwashRunningColor: '#213c79',
    proxiwashRunningNotStartedColor: '#1e263e',
    proxiwashRunningBgColor: '#1a2033',
    proxiwashBrokenColor: '#7e2e2f',
    proxiwashErrorColor: '#7e2e2f',
    proxiwashUnknownColor: '#535353',

    // Screens
    planningColor: '#d99e09',
    proximoColor: '#ec5904',
    proxiwashColor: '#1fa5ee',
    menuColor: '#b81213',
    tutorinsaColor: '#f93943',

    // Tetris
    tetrisBackground: '#181818',
    tetrisScore: '#e2d707',
    tetrisI: '#be1522',
    tetrisO: '#EB6C1F',
    tetrisT: '#5cb85c',
    tetrisS: '#5294E2',
    tetrisZ: '#dede00',
    tetrisJ: '#69009d',
    tetrisL: '#553716',

    gameGold: '#ffd610',
    gameSilver: '#7b7b7b',
    gameBronze: '#a15218',

    // Mascot Popup
    mascotMessageArrow: '#323232',
  },
};
