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

// @flow

import {DarkTheme, DefaultTheme} from 'react-native-paper';
import {Appearance} from 'react-native-appearance';
import AsyncStorageManager from './AsyncStorageManager';
import AprilFoolsManager from './AprilFoolsManager';

const colorScheme = Appearance.getColorScheme();

export type CustomThemeType = {
  ...DefaultTheme,
  colors: {
    primary: string,
    accent: string,
    tabIcon: string,
    card: string,
    dividerBackground: string,
    ripple: string,
    textDisabled: string,
    icon: string,
    subtitle: string,
    success: string,
    warning: string,
    danger: string,

    // Calendar/Agenda
    agendaBackgroundColor: string,
    agendaDayTextColor: string,

    // PROXIWASH
    proxiwashFinishedColor: string,
    proxiwashReadyColor: string,
    proxiwashRunningColor: string,
    proxiwashRunningNotStartedColor: string,
    proxiwashRunningBgColor: string,
    proxiwashBrokenColor: string,
    proxiwashErrorColor: string,
    proxiwashUnknownColor: string,

    // Screens
    planningColor: string,
    proximoColor: string,
    proxiwashColor: string,
    menuColor: string,
    tutorinsaColor: string,

    // Tetris
    tetrisBackground: string,
    tetrisBorder: string,
    tetrisScore: string,
    tetrisI: string,
    tetrisO: string,
    tetrisT: string,
    tetrisS: string,
    tetrisZ: string,
    tetrisJ: string,
    tetrisL: string,

    gameGold: string,
    gameSilver: string,
    gameBronze: string,

    // Mascot Popup
    mascotMessageArrow: string,
  },
};

/**
 * Singleton class used to manage themes
 */
export default class ThemeManager {
  static instance: ThemeManager | null = null;

  updateThemeCallback: null | (() => void);

  constructor() {
    this.updateThemeCallback = null;
  }

  /**
   * Gets the light theme
   *
   * @return {CustomThemeType} Object containing theme variables
   * */
  static getWhiteTheme(): CustomThemeType {
    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: '#be1522',
        accent: '#be1522',
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
        cc: 'dst',

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
        tetrisI: '#3cd9e6',
        tetrisO: '#ffdd00',
        tetrisT: '#a716e5',
        tetrisS: '#09c528',
        tetrisZ: '#ff0009',
        tetrisJ: '#2a67e3',
        tetrisL: '#da742d',

        gameGold: '#ffd610',
        gameSilver: '#7b7b7b',
        gameBronze: '#a15218',

        // Mascot Popup
        mascotMessageArrow: '#dedede',
      },
    };
  }

  /**
   * Gets the dark theme
   *
   * @return {CustomThemeType} Object containing theme variables
   * */
  static getDarkTheme(): CustomThemeType {
    return {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: '#be1522',
        accent: '#be1522',
        tabBackground: '#181818',
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
        tetrisI: '#30b3be',
        tetrisO: '#c1a700',
        tetrisT: '#9114c7',
        tetrisS: '#08a121',
        tetrisZ: '#b50008',
        tetrisJ: '#0f37b9',
        tetrisL: '#b96226',

        gameGold: '#ffd610',
        gameSilver: '#7b7b7b',
        gameBronze: '#a15218',

        // Mascot Popup
        mascotMessageArrow: '#323232',
      },
    };
  }

  /**
   * Get this class instance or create one if none is found
   *
   * @returns {ThemeManager}
   */
  static getInstance(): ThemeManager {
    if (ThemeManager.instance == null)
      ThemeManager.instance = new ThemeManager();
    return ThemeManager.instance;
  }

  /**
   * Gets night mode status.
   * If Follow System Preferences is enabled, will first use system theme.
   * If disabled or not available, will use value stored din preferences
   *
   * @returns {boolean} Night mode state
   */
  static getNightMode(): boolean {
    return (
      (AsyncStorageManager.getBool(
        AsyncStorageManager.PREFERENCES.nightMode.key,
      ) &&
        (!AsyncStorageManager.getBool(
          AsyncStorageManager.PREFERENCES.nightModeFollowSystem.key,
        ) ||
          colorScheme === 'no-preference')) ||
      (AsyncStorageManager.getBool(
        AsyncStorageManager.PREFERENCES.nightModeFollowSystem.key,
      ) &&
        colorScheme === 'dark')
    );
  }

  /**
   * Get the current theme based on night mode and events
   *
   * @returns {CustomThemeType} The current theme
   */
  static getCurrentTheme(): CustomThemeType {
    if (AprilFoolsManager.getInstance().isAprilFoolsEnabled())
      return AprilFoolsManager.getAprilFoolsTheme(ThemeManager.getWhiteTheme());
    return ThemeManager.getBaseTheme();
  }

  /**
   * Get the theme based on night mode
   *
   * @return {CustomThemeType} The theme
   */
  static getBaseTheme(): CustomThemeType {
    if (ThemeManager.getNightMode()) return ThemeManager.getDarkTheme();
    return ThemeManager.getWhiteTheme();
  }

  /**
   * Sets the function to be called when the theme is changed (allows for general reload of the app)
   *
   * @param callback Function to call after theme change
   */
  setUpdateThemeCallback(callback: () => void) {
    this.updateThemeCallback = callback;
  }

  /**
   * Set night mode and save it to preferences
   *
   * @param isNightMode True to enable night mode, false to disable
   */
  setNightMode(isNightMode: boolean) {
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.nightMode.key,
      isNightMode,
    );
    if (this.updateThemeCallback != null) this.updateThemeCallback();
  }
}
