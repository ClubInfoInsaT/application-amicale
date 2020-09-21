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

// @flow

import AsyncStorage from '@react-native-community/async-storage';
import {SERVICES_KEY} from './ServicesManager';

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
    servicesShowMascot: {
      key: 'servicesShowMascot',
      default: '1',
    },
    proxiwashShowMascot: {
      key: 'proxiwashShowMascot',
      default: '1',
    },
    homeShowMascot: {
      key: 'homeShowMascot',
      default: '1',
    },
    eventsShowMascot: {
      key: 'eventsShowMascot',
      default: '1',
    },
    planexShowMascot: {
      key: 'planexShowMascot',
      default: '1',
    },
    loginShowMascot: {
      key: 'loginShowMascot',
      default: '1',
    },
    voteShowMascot: {
      key: 'voteShowMascot',
      default: '1',
    },
    equipmentShowMascot: {
      key: 'equipmentShowMascot',
      default: '1',
    },
    gameStartMascot: {
      key: 'gameStartMascot',
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
    selectedWash: {
      key: 'selectedWash',
      default: 'washinsa',
    },
  };

  #currentPreferences: {[key: string]: string};

  constructor() {
    this.#currentPreferences = {};
  }

  /**
   * Get this class instance or create one if none is found
   * @returns {AsyncStorageManager}
   */
  static getInstance(): AsyncStorageManager {
    if (AsyncStorageManager.instance == null)
      AsyncStorageManager.instance = new AsyncStorageManager();
    return AsyncStorageManager.instance;
  }

  /**
   * Saves the value associated to the given key to preferences.
   *
   * @param key
   * @param value
   */
  static set(
    key: string,
    // eslint-disable-next-line flowtype/no-weak-types
    value: number | string | boolean | {...} | Array<any>,
  ) {
    AsyncStorageManager.getInstance().setPreference(key, value);
  }

  /**
   * Gets the string value of the given preference
   *
   * @param key
   * @returns {string}
   */
  static getString(key: string): string {
    const value = AsyncStorageManager.getInstance().getPreference(key);
    return value != null ? value : '';
  }

  /**
   * Gets the boolean value of the given preference
   *
   * @param key
   * @returns {boolean}
   */
  static getBool(key: string): boolean {
    const value = AsyncStorageManager.getString(key);
    return value === '1' || value === 'true';
  }

  /**
   * Gets the number value of the given preference
   *
   * @param key
   * @returns {number}
   */
  static getNumber(key: string): number {
    return parseFloat(AsyncStorageManager.getString(key));
  }

  /**
   * Gets the object value of the given preference
   *
   * @param key
   * @returns {{...}}
   */
  // eslint-disable-next-line flowtype/no-weak-types
  static getObject(key: string): any {
    return JSON.parse(AsyncStorageManager.getString(key));
  }

  /**
   * Set preferences object current values from AsyncStorage.
   * This function should be called at the app's start.
   *
   * @return {Promise<void>}
   */
  async loadPreferences() {
    const prefKeys = [];
    // Get all available keys
    Object.keys(AsyncStorageManager.PREFERENCES).forEach((key: string) => {
      prefKeys.push(key);
    });
    // Get corresponding values
    const resultArray = await AsyncStorage.multiGet(prefKeys);
    // Save those values for later use
    resultArray.forEach((item: [string, string | null]) => {
      const key = item[0];
      let val = item[1];
      if (val === null) val = AsyncStorageManager.PREFERENCES[key].default;
      this.#currentPreferences[key] = val;
    });
  }

  /**
   * Saves the value associated to the given key to preferences.
   * This updates the preferences object and saves it to AsyncStorage.
   *
   * @param key
   * @param value
   */
  setPreference(
    key: string,
    // eslint-disable-next-line flowtype/no-weak-types
    value: number | string | boolean | {...} | Array<any>,
  ) {
    if (AsyncStorageManager.PREFERENCES[key] != null) {
      let convertedValue;
      if (typeof value === 'string') convertedValue = value;
      else if (typeof value === 'boolean' || typeof value === 'number')
        convertedValue = value.toString();
      else convertedValue = JSON.stringify(value);
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
  getPreference(key: string): string | null {
    return this.#currentPreferences[key];
  }
}
