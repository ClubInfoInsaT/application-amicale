// @flow

import platform from '../native-base-theme/variables/platform';
import platformDark from '../native-base-theme/variables/platformDark';
import getTheme from '../native-base-theme/components';
import AsyncStorageManager from "./AsyncStorageManager";

/**
 * Singleton class used to manage themes
 */
export default class ThemeManager {

    static instance: ThemeManager | null = null;
    updateThemeCallback: Function;

    constructor() {
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
            return getTheme(platformDark);
        else
            return getTheme(platform);
    }

    /**
     * Get the variables contained in the current theme
     * @returns {Object}
     */
    static getCurrentThemeVariables(): Object {
        return ThemeManager.getCurrentTheme().variables;
    }

};
