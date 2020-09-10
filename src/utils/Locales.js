// @flow

import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import en from '../../locales/en.json';
import fr from '../../locales/fr.json';

const initLocales = () => {
  i18n.fallbacks = true;
  i18n.translations = {fr, en};
  i18n.locale = RNLocalize.findBestAvailableLanguage([
    'en',
    'fr',
  ]).languageTag;
}
export default initLocales;
