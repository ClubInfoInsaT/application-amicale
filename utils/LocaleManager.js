import i18n from 'i18n-js';
import * as Localization from 'expo-localization';

import en from '../translations/en';
import fr from '../translations/fr';

export default class LocaleManager {

    static instance = null;

    static getInstance() {
        if (LocaleManager.instance == null) {
            LocaleManager.instance = new LocaleManager();
        }
        return this.instance;
    }

    initTranslations() {
        i18n.fallbacks = true;
        i18n.translations = {fr, en};
        i18n.locale = Localization.locale;
    }
}
