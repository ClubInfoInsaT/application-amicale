import {AsyncStorage} from 'react-native'
import platform from '../native-base-theme/variables/platform';
import platformDark from '../native-base-theme/variables/platformDark';
import getTheme from '../native-base-theme/components';

const nightModeKey = 'nightMode';

export default class ThemeManager {

    static instance = null;

    constructor() {
        this.nightMode = false;
        this.updateThemeCallback = undefined;
    }

    static getInstance() {
        if (ThemeManager.instance == null) {
            ThemeManager.instance = new ThemeManager();
        }
        return this.instance;
    }

    setUpdateThemeCallback(callback) {
        this.updateThemeCallback = callback;
        console.log(this.updateThemeCallback);

    }

    async getDataFromPreferences() {
        let result = await AsyncStorage.getItem(nightModeKey);

        if (result === '1')
            this.nightMode = true;
        console.log('nightmode: ' + this.nightMode);
    }

    setNightmode(isNightMode) {
        this.nightMode = isNightMode;
        AsyncStorage.setItem(nightModeKey, isNightMode ? '1' : '0');
        if (this.updateThemeCallback !== undefined)
            this.updateThemeCallback();
    }

    getNightMode() {
        return this.nightMode;
    }

    getCurrentTheme() {
        if (this.nightMode)
            return getTheme(platformDark);
        else
            return getTheme(platform);
    }

};
