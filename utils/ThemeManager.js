// @flow

import AsyncStorageManager from "./AsyncStorageManager";
// import {DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme} from '@react-navigation/native';
import {DarkTheme, DefaultTheme} from 'react-native-paper';
/**
 * Singleton class used to manage themes
 */
export default class ThemeManager {

    static instance: ThemeManager | null = null;
    updateThemeCallback: Function;

    constructor() {
        this.updateThemeCallback = null;
    }

    static getWhiteTheme() {
        return {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                primary: '#be1522',
                accent: '#be1522',
                card: "rgb(255, 255, 255)",
                dividerBackground: '#e2e2e2',
                textDisabled: '#c1c1c1',
                icon: '#5d5d5d',
                success: "#5cb85c",
                warning: "#f0ad4e",
                danger: "#d9534f",

                // Calendar/Agenda
                agendaBackgroundColor: '#f3f3f4',
                agendaDayTextColor: '#636363',

                // PROXIWASH
                proxiwashFinishedColor: "rgba(54,165,22,0.31)",
                proxiwashReadyColor: "transparent",
                proxiwashRunningColor: "rgba(94,104,241,0.3)",
                proxiwashRunningBgColor: "rgba(99,109,255,0.14)",
                proxiwashBrokenColor: "rgba(162,162,162,0.31)",
                proxiwashErrorColor: "rgba(204,7,0,0.31)",

                // Screens
                planningColor: '#d9b10a',
                proximoColor: '#ec5904',
                proxiwashColor: '#1fa5ee',
                menuColor: '#e91314',
                tutorinsaColor: '#f93943',
            },
        };
    }

    static getDarkTheme() {
        return {
            ...DarkTheme,
            colors: {
                ...DarkTheme.colors,
                primary: '#be1522',
                accent: '#be1522',
                card: "rgb(18, 18, 18)",
                dividerBackground: '#222222',
                textDisabled: '#5b5b5b',
                icon: '#b3b3b3',
                success: "#5cb85c",
                warning: "#f0ad4e",
                danger: "#d9534f",

                // Calendar/Agenda
                agendaBackgroundColor: '#171717',
                agendaDayTextColor: '#6d6d6d',

                // PROXIWASH
                proxiwashFinishedColor: "rgba(17,149,32,0.53)",
                proxiwashReadyColor: "transparent",
                proxiwashRunningColor: "rgba(29,59,175,0.65)",
                proxiwashRunningBgColor: "rgba(99,109,255,0.14)",
                proxiwashBrokenColor: "#000000",
                proxiwashErrorColor: "rgba(213,8,0,0.57)",

                // Screens
                planningColor: '#d99e09',
                proximoColor: '#ec5904',
                proxiwashColor: '#1fa5ee',
                menuColor: '#b81213',
                tutorinsaColor: '#f93943',
            },
        };
    }

    /**
     * Get this class instance or create one if none is found
     * @returns {ThemeManager}
     */
    static getInstance(): ThemeManager {
        return ThemeManager.instance === null ?
            ThemeManager.instance = new ThemeManager() :
            ThemeManager.instance;
    }

    /**
     * @returns {boolean} Night mode state
     */
    static getNightMode(): boolean {
        return AsyncStorageManager.getInstance().preferences.nightMode.current === '1';
    }

    /**
     * Get the current theme based on night mode
     * @returns {Object}
     */
    static getCurrentTheme(): Object {
        if (ThemeManager.getNightMode())
            return ThemeManager.getDarkTheme();
        else
            return ThemeManager.getWhiteTheme();
    }

    /**
     * Get the variables contained in the current theme
     * @returns {Object}
     */
    static getCurrentThemeVariables(): Object {
        return ThemeManager.getCurrentTheme().colors;
    }

    /**
     * Set the function to be called when the theme is changed (allows for general reload of the app)
     * @param callback Function to call after theme change
     */
    setUpdateThemeCallback(callback: ?Function) {
        this.updateThemeCallback = callback;
    }

    /**
     * Set night mode and save it to preferences
     *
     * @param isNightMode Whether to enable night mode
     */
    setNightMode(isNightMode: boolean) {
        let nightModeKey = AsyncStorageManager.getInstance().preferences.nightMode.key;
        AsyncStorageManager.getInstance().savePref(nightModeKey, isNightMode ? '1' : '0');
        if (this.updateThemeCallback !== null)
            this.updateThemeCallback();
    }

};
