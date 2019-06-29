// @flow

import {AsyncStorage} from 'react-native'
import platform from '../native-base-theme/variables/platform';
import platformDark from '../native-base-theme/variables/platformDark';
import getTheme from '../native-base-theme/components';

const nightModeKey = 'nightMode';

/**
 * Singleton class used to manage themes
 */
export default class ThemeManager {

    static instance: ThemeManager | null = null;
    nightMode: boolean;
    updateThemeCallback: Function;

    constructor() {
        this.nightMode = false;
        this.updateThemeCallback = null;
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
     * Set the function to be called when the theme is changed (allows for general reload of the app)
     * @param callback Function to call after theme change
     */
    setUpdateThemeCallback(callback: ?Function) {
        this.updateThemeCallback = callback;
    }

    /**
     * Read async storage to get preferences
     * @returns {Promise<void>}
     */
    async getDataFromPreferences(): Promise<void> {
        let result: string = await AsyncStorage.getItem(nightModeKey);

        if (result === '1')
            this.nightMode = true;
        // console.log('nightmode: ' + this.nightMode);
    }

    /**
     * Set night mode and save it to preferences
     *
     * @param isNightMode Whether to enable night mode
     */
    setNightMode(isNightMode: boolean) {
        this.nightMode = isNightMode;
        AsyncStorage.setItem(nightModeKey, isNightMode ? '1' : '0');
        if (this.updateThemeCallback !== null)
            this.updateThemeCallback();
    }

    /**
     * @returns {boolean} Night mode state
     */
    getNightMode(): boolean {
        return this.nightMode;
    }

    /**
     * Get the current theme based on night mode
     * @returns {Object}
     */
    getCurrentTheme(): Object {
        if (this.nightMode)
            return getTheme(platformDark);
        else
            return getTheme(platform);
    }

    /**
     * Get the variables contained in the current theme
     * @returns {Object}
     */
    getCurrentThemeVariables(): Object {
        return this.getCurrentTheme().variables;
    }

};
