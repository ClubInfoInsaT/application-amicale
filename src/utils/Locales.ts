/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import en from '../../locales/en.json';
import fr from '../../locales/fr.json';
import it from '../../locales/it.json';
import es from '../../locales/es.json';

const initLocales = () => {
  i18n.fallbacks = true;
  i18n.translations = { fr, en, it, es };
  const bestLanguage = RNLocalize.findBestAvailableLanguage([
    'en',
    'fr',
    'it',
    'es',
  ]);
  i18n.locale = bestLanguage ? bestLanguage.languageTag : 'en';
};
export default initLocales;
