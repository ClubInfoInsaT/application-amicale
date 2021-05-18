import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVICES_KEY } from './Services';

export enum PreferenceKeys {
  debugUnlocked = 'debugUnlocked',
  showIntro = 'showIntro',
  updateNumber = 'updateNumber',
  proxiwashNotifications = 'proxiwashNotifications',
  nightModeFollowSystem = 'nightModeFollowSystem',
  nightMode = 'nightMode',
  defaultStartScreen = 'defaultStartScreen',

  servicesShowMascot = 'servicesShowMascot',
  proxiwashShowMascot = 'proxiwashShowMascot',
  homeShowMascot = 'homeShowMascot',
  eventsShowMascot = 'eventsShowMascot',
  planexShowMascot = 'planexShowMascot',
  loginShowMascot = 'loginShowMascot',
  voteShowMascot = 'voteShowMascot',
  equipmentShowMascot = 'equipmentShowMascot',
  gameShowMascot = 'gameShowMascot',

  proxiwashWatchedMachines = 'proxiwashWatchedMachines',
  showAprilFoolsStart = 'showAprilFoolsStart',
  planexCurrentGroup = 'planexCurrentGroup',
  planexFavoriteGroups = 'planexFavoriteGroups',
  dashboardItems = 'dashboardItems',
  gameScores = 'gameScores',
  selectedWash = 'selectedWash',
}

export type PreferencesType = { [key in PreferenceKeys]: string };

export const defaultPreferences: { [key in PreferenceKeys]: string } = {
  [PreferenceKeys.debugUnlocked]: '0',
  [PreferenceKeys.showIntro]: '1',
  [PreferenceKeys.updateNumber]: '0',
  [PreferenceKeys.proxiwashNotifications]: '5',
  [PreferenceKeys.nightModeFollowSystem]: '1',
  [PreferenceKeys.nightMode]: '1',
  [PreferenceKeys.defaultStartScreen]: 'home',
  [PreferenceKeys.servicesShowMascot]: '1',
  [PreferenceKeys.proxiwashShowMascot]: '1',
  [PreferenceKeys.homeShowMascot]: '1',
  [PreferenceKeys.eventsShowMascot]: '1',
  [PreferenceKeys.planexShowMascot]: '1',
  [PreferenceKeys.loginShowMascot]: '1',
  [PreferenceKeys.voteShowMascot]: '1',
  [PreferenceKeys.equipmentShowMascot]: '1',
  [PreferenceKeys.gameShowMascot]: '1',
  [PreferenceKeys.proxiwashWatchedMachines]: '[]',
  [PreferenceKeys.showAprilFoolsStart]: '1',
  [PreferenceKeys.planexCurrentGroup]: '',
  [PreferenceKeys.planexFavoriteGroups]: '[]',
  [PreferenceKeys.dashboardItems]: JSON.stringify([
    SERVICES_KEY.EMAIL,
    SERVICES_KEY.WASHERS,
    SERVICES_KEY.PROXIMO,
    SERVICES_KEY.TUTOR_INSA,
    SERVICES_KEY.RU,
  ]),
  [PreferenceKeys.gameScores]: '[]',
  [PreferenceKeys.selectedWash]: 'washinsa',
};

/**
 * Set preferences object current values from AsyncStorage.
 * This function should be called once on start.
 *
 * @return {Promise<PreferencesType>}
 */
export function retrievePreferences(
  keys: Array<PreferenceKeys>,
  defaults: PreferencesType
): Promise<PreferencesType> {
  return new Promise((resolve: (preferences: PreferencesType) => void) => {
    AsyncStorage.multiGet(keys)
      .then((result) => {
        const preferences = { ...defaults };
        result.forEach((item) => {
          let [key, value] = item;
          if (value !== null) {
            preferences[key as PreferenceKeys] = value;
          }
        });
        resolve(preferences);
      })
      .catch(() => resolve(defaults));
  });
}

/**
 * Saves the value associated to the given key to preferences.
 * This updates the preferences object and saves it to AsyncStorage.
 *
 * @param key
 * @param value
 */
export function setPreference(
  key: PreferenceKeys,
  value: number | string | boolean | object | Array<any>,
  prevPreferences: PreferencesType
): PreferencesType {
  let convertedValue: string;
  if (typeof value === 'string') {
    convertedValue = value;
  } else if (typeof value === 'boolean' || typeof value === 'number') {
    convertedValue = value.toString();
  } else {
    convertedValue = JSON.stringify(value);
  }
  prevPreferences[key] = convertedValue;
  AsyncStorage.setItem(key, convertedValue)
    .then(undefined)
    .catch(() => console.debug('save error: ' + convertedValue));
  return prevPreferences;
}

export function isValidPreferenceKey(key: string): key is PreferenceKeys {
  return key in Object.values(PreferenceKeys);
}

/**
 * Gets the boolean value of the given preference
 *
 * @param key
 * @returns {boolean}
 */
export function getPreferenceString(
  key: PreferenceKeys,
  preferences: PreferencesType
): string | undefined {
  return preferences[key];
}

/**
 * Gets the boolean value of the given preference
 *
 * @param key
 * @returns {boolean}
 */
export function getPreferenceBool(
  key: PreferenceKeys,
  preferences: PreferencesType
): boolean | undefined {
  const value = preferences[key];
  return value ? value === '1' || value === 'true' : undefined;
}

/**
 * Gets the number value of the given preference
 *
 * @param key
 * @returns {number}
 */
export function getPreferenceNumber(
  key: PreferenceKeys,
  preferences: PreferencesType
): number | undefined {
  const value = preferences[key];
  return value !== undefined ? parseFloat(value) : undefined;
}

/**
 * Gets the object value of the given preference
 *
 * @param key
 * @returns {{...}}
 */
export function getPreferenceObject(
  key: PreferenceKeys,
  preferences: PreferencesType
): object | Array<any> | undefined {
  const value = preferences[key];
  return value ? JSON.parse(value) : undefined;
}
