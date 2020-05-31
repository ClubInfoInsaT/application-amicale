// @flow

import AsyncStorage from '@react-native-community/async-storage';

/**
 * Singleton used to manage preferences.
 * Preferences are fetched at the start of the app and saved in an instance object.
 * This allows for a synchronous access to saved data.
 */

export default class AsyncStorageManager {

    static instance: AsyncStorageManager | null = null;

    /**
     * Get this class instance or create one if none is found
     * @returns {AsyncStorageManager}
     */
    static getInstance(): AsyncStorageManager {
        return AsyncStorageManager.instance === null ?
            AsyncStorageManager.instance = new AsyncStorageManager() :
            AsyncStorageManager.instance;
    }

    // Object storing preferences keys, default and current values for use in the app
    preferences = {
        showIntro: {
            key: 'showIntro',
            default: '1',
            current: '',
        },
        updateNumber: {
            key: 'updateNumber',
            default: '0',
            current: '',
        },
        proxiwashNotifications: {
            key: 'proxiwashNotifications',
            default: '5',
            current: '',
        },
        nightModeFollowSystem: {
            key: 'nightModeFollowSystem',
            default: '1',
            current: '',
        },
        nightMode: {
            key: 'nightMode',
            default: '1',
            current: '',
        },
        expoToken: {
            key: 'expoToken',
            default: '',
            current: '',
        },
        debugUnlocked: {
            key: 'debugUnlocked',
            default: '0',
            current: '',
        },
        defaultStartScreen: {
            key: 'defaultStartScreen',
            default: 'home',
            current: '',
        },
        proxiwashShowBanner: {
            key: 'proxiwashShowBanner',
            default: '1',
            current: '',
        },
        proxiwashWatchedMachines: {
            key: 'proxiwashWatchedMachines',
            default: '[]',
            current: '',
        },
        planexShowBanner: {
            key: 'planexShowBanner',
            default: '1',
            current: '',
        },
        showAprilFoolsStart: {
            key: 'showAprilFoolsStart',
            default: '1',
            current: '',
        },
        planexCurrentGroup: {
            key: 'planexCurrentGroup',
            default: '',
            current: '',
        },
        planexFavoriteGroups: {
            key: 'planexFavoriteGroups',
            default: '[]',
            current: '',
        },
    };

    /**
     * Set preferences object current values from AsyncStorage.
     * This function should be called at the app's start.
     *
     * @return {Promise<void>}
     */
    async loadPreferences() {
        let prefKeys = [];
        // Get all available keys
        for (let [key, value] of Object.entries(this.preferences)) {
            //$FlowFixMe
            prefKeys.push(value.key);
        }
        // Get corresponding values
        let resultArray: Array<Array<string>> = await AsyncStorage.multiGet(prefKeys);
        // Save those values for later use
        for (let i = 0; i < resultArray.length; i++) {
            let key: string = resultArray[i][0];
            let val: string | null = resultArray[i][1];
            if (val === null)
                val = this.preferences[key].default;
            this.preferences[key].current = val;
        }
    }

    /**
     * Save the value associated to the given key to preferences.
     * This updates the preferences object and saves it to AsyncStorage.
     *
     * @param key
     * @param val
     */
    savePref(key: string, val: string) {
        this.preferences[key].current = val;
        AsyncStorage.setItem(key, val);
    }

}
