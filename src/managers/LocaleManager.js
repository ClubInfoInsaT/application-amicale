// @flow

import i18n from 'i18n-js';
import * as RNLocalize from "react-native-localize";

import en from '../../translations/en';
import fr from '../../translations/fr';

/**
 * Static class used to manage locales
 */
export default class LocaleManager {

    /**
     * Initialize translations using language files
     */
    static initTranslations() {
        i18n.fallbacks = true;
        i18n.translations = {fr, en};
        i18n.locale = RNLocalize.findBestAvailableLanguage(["en", "fr"]).languageTag;
    }
}
