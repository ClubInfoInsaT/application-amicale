import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVICES_KEY } from './Services';

export enum GeneralPreferenceKeys {
  debugUnlocked = 'debugUnlocked',
  showIntro = 'showIntro',
  updateNumber = 'updateNumber',
  nightModeFollowSystem = 'nightModeFollowSystem',
  nightMode = 'nightMode',
  defaultStartScreen = 'defaultStartScreen',
  showAprilFoolsStart = 'showAprilFoolsStart',
  dashboardItems = 'dashboardItems',
  gameScores = 'gameScores',
}

export enum PlanexPreferenceKeys {
  planexCurrentGroup = 'planexCurrentGroup',
  planexFavoriteGroups = 'planexFavoriteGroups',
}

export enum ProxiwashPreferenceKeys {
  proxiwashNotifications = 'proxiwashNotifications',
  proxiwashWatchedMachines = 'proxiwashWatchedMachines',
  selectedWash = 'selectedWash',
}

export enum MascotPreferenceKeys {
  servicesShowMascot = 'servicesShowMascot',
  proxiwashShowMascot = 'proxiwashShowMascot',
  homeShowMascot = 'homeShowMascot',
  eventsShowMascot = 'eventsShowMascot',
  planexShowMascot = 'planexShowMascot',
  loginShowMascot = 'loginShowMascot',
  voteShowMascot = 'voteShowMascot',
  equipmentShowMascot = 'equipmentShowMascot',
  gameShowMascot = 'gameShowMascot',
}

export const PreferenceKeys = {
  ...GeneralPreferenceKeys,
  ...PlanexPreferenceKeys,
  ...ProxiwashPreferenceKeys,
  ...MascotPreferenceKeys,
};
export type PreferenceKeys =
  | GeneralPreferenceKeys
  | PlanexPreferenceKeys
  | ProxiwashPreferenceKeys
  | MascotPreferenceKeys;

export type PreferencesType = { [key in PreferenceKeys]: string };
export type GeneralPreferencesType = { [key in GeneralPreferenceKeys]: string };
export type PlanexPreferencesType = {
  [key in PlanexPreferenceKeys]: string;
};
export type ProxiwashPreferencesType = {
  [key in ProxiwashPreferenceKeys]: string;
};
export type MascotPreferencesType = { [key in MascotPreferenceKeys]: string };

export const defaultPlanexPreferences: {
  [key in PlanexPreferenceKeys]: string;
} = {
  [PlanexPreferenceKeys.planexCurrentGroup]: '',
  [PlanexPreferenceKeys.planexFavoriteGroups]: '[]',
};

export const defaultProxiwashPreferences: {
  [key in ProxiwashPreferenceKeys]: string;
} = {
  [ProxiwashPreferenceKeys.proxiwashNotifications]: '5',
  [ProxiwashPreferenceKeys.proxiwashWatchedMachines]: '[]',
  [ProxiwashPreferenceKeys.selectedWash]: 'washinsa',
};

export const defaultMascotPreferences: {
  [key in MascotPreferenceKeys]: string;
} = {
  [MascotPreferenceKeys.servicesShowMascot]: '1',
  [MascotPreferenceKeys.proxiwashShowMascot]: '1',
  [MascotPreferenceKeys.homeShowMascot]: '1',
  [MascotPreferenceKeys.eventsShowMascot]: '1',
  [MascotPreferenceKeys.planexShowMascot]: '1',
  [MascotPreferenceKeys.loginShowMascot]: '1',
  [MascotPreferenceKeys.voteShowMascot]: '1',
  [MascotPreferenceKeys.equipmentShowMascot]: '1',
  [MascotPreferenceKeys.gameShowMascot]: '1',
};

export const defaultPreferences: { [key in GeneralPreferenceKeys]: string } = {
  [GeneralPreferenceKeys.debugUnlocked]: '0',
  [GeneralPreferenceKeys.showIntro]: '1',
  [GeneralPreferenceKeys.updateNumber]: '0',
  [GeneralPreferenceKeys.nightModeFollowSystem]: '1',
  [GeneralPreferenceKeys.nightMode]: '1',
  [GeneralPreferenceKeys.defaultStartScreen]: 'home',
  [GeneralPreferenceKeys.showAprilFoolsStart]: '1',

  [GeneralPreferenceKeys.dashboardItems]: JSON.stringify([
    SERVICES_KEY.EMAIL,
    SERVICES_KEY.WASHERS,
    SERVICES_KEY.PROXIMO,
    SERVICES_KEY.TUTOR_INSA,
    SERVICES_KEY.RU,
  ]),

  [GeneralPreferenceKeys.gameScores]: '[]',
};

export function isValidGeneralPreferenceKey(
  key: string
): key is GeneralPreferenceKeys {
  return key in Object.values(GeneralPreferenceKeys);
}

export function isValidMascotPreferenceKey(
  key: string
): key is MascotPreferenceKeys {
  return key in Object.values(MascotPreferenceKeys);
}

/**
 * Set preferences object current values from AsyncStorage.
 * This function should be called once on start.
 *
 * @return {Promise<PreferencesType>}
 */
export function retrievePreferences<
  Keys extends PreferenceKeys,
  T extends Partial<PreferencesType>
>(keys: Array<Keys>, defaults: T): Promise<T> {
  return new Promise((resolve: (preferences: T) => void) => {
    AsyncStorage.multiGet(keys)
      .then((result) => {
        const preferences = { ...defaults };
        result.forEach((item) => {
          let [key, value] = item;
          if (value !== null) {
            preferences[key as Keys] = value;
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
export function setPreference<
  Keys extends PreferenceKeys,
  T extends Partial<PreferencesType>
>(
  key: Keys,
  value: number | string | boolean | object | Array<any> | undefined,
  prevPreferences: T
): T {
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

/**
 * Gets the boolean value of the given preference
 *
 * @param key
 * @returns {boolean}
 */
export function getPreferenceString<
  Keys extends PreferenceKeys,
  T extends Partial<PreferencesType>
>(key: Keys, preferences: T): string | undefined {
  return preferences[key];
}

/**
 * Gets the boolean value of the given preference
 *
 * @param key
 * @returns {boolean}
 */
export function getPreferenceBool<
  Keys extends PreferenceKeys,
  T extends Partial<PreferencesType>
>(key: Keys, preferences: T): boolean | undefined {
  const value = preferences[key];
  return value ? value === '1' || value === 'true' : undefined;
}

/**
 * Gets the number value of the given preference
 *
 * @param key
 * @returns {number}
 */
export function getPreferenceNumber<
  Keys extends PreferenceKeys,
  T extends Partial<PreferencesType>
>(key: Keys, preferences: T): number | undefined {
  const value = preferences[key] as string | undefined;
  return value ? parseFloat(value) : undefined;
}

/**
 * Gets the object value of the given preference
 *
 * @param key
 * @returns {{...}}
 */
export function getPreferenceObject<
  Keys extends PreferenceKeys,
  T extends Partial<PreferencesType>
>(key: Keys, preferences: T): object | Array<any> | undefined {
  const value = preferences[key] as string | undefined;
  return value ? JSON.parse(value) : undefined;
}
