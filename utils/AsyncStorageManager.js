// @flow

import {AsyncStorage} from "react-native";

/**
 * Static class used to manage preferences
 */

export default class AsyncStorageManager {

    static instance: AsyncStorageManager | null = null;

    /**
     * Get this class instance or create one if none is found
     * @returns {ThemeManager}
     */
    static getInstance(): AsyncStorageManager {
        return AsyncStorageManager.instance === null ?
            AsyncStorageManager.instance = new AsyncStorageManager() :
            AsyncStorageManager.instance;
    }


    preferences = {
        proxiwashNotifications: {
            key: 'proxiwashNotifications',
            default: '5',
            current : '',
        },
        proxiwashWatchedMachines : {
            key: 'proxiwashWatchedMachines',
            default: '[]',
            current : '',
        },
        nightMode: {
            key: 'nightMode',
            default : '0',
            current : '',
        }
    };

    async loadPreferences() {
        let prefKeys = [];
        // Get all available keys
        for (let [key, value] of Object.entries(this.preferences)) {
            prefKeys.push(value.key);
        }
        // Get corresponding values
        let resultArray : Array<Array<string>> = await AsyncStorage.multiGet(prefKeys);
        // Save those values for later use
        for (let i = 0; i < resultArray.length; i++) {
            let key : string = resultArray[i][0];
            let val : string | null = resultArray[i][1];
            if (val === null)
                val = this.preferences[key].default;
            this.preferences[key].current = val;
        }
        console.log(this.preferences);
    }

    savePref(key : string, val : string) {
        this.preferences[key].current = val;
        AsyncStorage.setItem(key, val);
    }

}
