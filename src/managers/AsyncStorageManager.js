// @flow

import AsyncStorage from '@react-native-community/async-storage';
import {SERVICES_KEY} from "./ServicesManager";

/**
 * Singleton used to manage preferences.
 * Preferences are fetched at the start of the app and saved in an instance object.
 * This allows for a synchronous access to saved data.
 */

export default class AsyncStorageManager {

    static instance: AsyncStorageManager | null = null;

    static PREFERENCES = {
        debugUnlocked: {
            key: 'debugUnlocked',
            default: '0',
        },
        showIntro: {
            key: 'showIntro',
            default: '1',
        },
        updateNumber: {
            key: 'updateNumber',
            default: '0',
        },
        proxiwashNotifications: {
            key: 'proxiwashNotifications',
            default: '5',
        },
        nightModeFollowSystem: {
            key: 'nightModeFollowSystem',
            default: '1',
        },
        nightMode: {
            key: 'nightMode',
            default: '1',
        },
        defaultStartScreen: {
            key: 'defaultStartScreen',
            default: 'home',
        },
        servicesShowBanner: {
            key: 'servicesShowBanner',
            default: '1',
        },
        proxiwashShowBanner: {
            key: 'proxiwashShowBanner',
            default: '1',
        },
        homeShowBanner: {
            key: 'homeShowBanner',
            default: '1',
        },
        eventsShowBanner: {
            key: 'eventsShowBanner',
            default: '1',
        },
        planexShowBanner: {
            key: 'planexShowBanner',
            default: '1',
        },
        loginShowBanner: {
            key: 'loginShowBanner',
            default: '1',
        },
        voteShowBanner: {
            key: 'voteShowBanner',
            default: '1',
        },
        equipmentShowBanner: {
            key: 'equipmentShowBanner',
            default: '1',
        },
        gameStartShowBanner: {
            key: 'gameStartShowBanner',
            default: '1',
        },
        proxiwashWatchedMachines: {
            key: 'proxiwashWatchedMachines',
            default: '[]',
        },
        showAprilFoolsStart: {
            key: 'showAprilFoolsStart',
            default: '1',
        },
        planexCurrentGroup: {
            key: 'planexCurrentGroup',
            default: '',
        },
        planexFavoriteGroups: {
            key: 'planexFavoriteGroups',
            default: '[]',
        },
        dashboardItems: {
            key: 'dashboardItems',
            default: JSON.stringify([
                SERVICES_KEY.EMAIL,
                SERVICES_KEY.WASHERS,
                SERVICES_KEY.PROXIMO,
                SERVICES_KEY.TUTOR_INSA,
                SERVICES_KEY.RU,
            ]),
        },
        gameScores: {
            key: 'gameScores',
            default: '[]',
        },
    }

    #currentPreferences: {[key: string]: string};

    constructor() {
        this.#currentPreferences = {};
    }

    /**
     * Get this class instance or create one if none is found
     * @returns {AsyncStorageManager}
     */
    static getInstance(): AsyncStorageManager {
        return AsyncStorageManager.instance === null ?
            AsyncStorageManager.instance = new AsyncStorageManager() :
            AsyncStorageManager.instance;
    }

    /**
     * Set preferences object current values from AsyncStorage.
     * This function should be called at the app's start.
     *
     * @return {Promise<void>}
     */
    async loadPreferences() {
        let prefKeys = [];
        // Get all available keys
        for (let key in AsyncStorageManager.PREFERENCES) {
            prefKeys.push(key);
        }
        // Get corresponding values
        let resultArray: Array<Array<string>> = await AsyncStorage.multiGet(prefKeys);
        // Save those values for later use
        for (let i = 0; i < resultArray.length; i++) {
            let key: string = resultArray[i][0];
            let val: string | null = resultArray[i][1];
            if (val === null)
                val = AsyncStorageManager.PREFERENCES[key].default;
            this.#currentPreferences[key] = val;
        }
    }

    /**
     * Saves the value associated to the given key to preferences.
     * This updates the preferences object and saves it to AsyncStorage.
     *
     * @param key
     * @param value
     */
    setPreference(key: string, value: any) {
        if (AsyncStorageManager.PREFERENCES[key] != null) {
            let convertedValue = "";
            if (typeof value === "string")
                convertedValue = value;
            else if (typeof value === "boolean" || typeof value === "number")
                convertedValue = value.toString();
            else
                convertedValue = JSON.stringify(value);
            this.#currentPreferences[key] = convertedValue;
            AsyncStorage.setItem(key, convertedValue);
        }
    }

    /**
     * Gets the value at the given key.
     * If the key is not available, returns null
     *
     * @param key
     * @returns {string|null}
     */
    getPreference(key: string) {
        return this.#currentPreferences[key];
    }

    /**
     * aves the value associated to the given key to preferences.
     *
     * @param key
     * @param value
     */
    static set(key: string, value: any) {
        AsyncStorageManager.getInstance().setPreference(key, value);
    }

    /**
     * Gets the string value of the given preference
     *
     * @param key
     * @returns {boolean}
     */
    static getString(key: string) {
        return AsyncStorageManager.getInstance().getPreference(key);
    }

    /**
     * Gets the boolean value of the given preference
     *
     * @param key
     * @returns {boolean}
     */
    static getBool(key: string) {
        const value = AsyncStorageManager.getString(key);
        return value === "1" || value === "true";
    }

    /**
     * Gets the number value of the given preference
     *
     * @param key
     * @returns {boolean}
     */
    static getNumber(key: string) {
        return parseFloat(AsyncStorageManager.getString(key));
    }

    /**
     * Gets the object value of the given preference
     *
     * @param key
     * @returns {boolean}
     */
    static getObject(key: string) {
        return JSON.parse(AsyncStorageManager.getString(key));
    }

}
