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

import {Platform, StatusBar} from 'react-native';
import ThemeManager from '../managers/ThemeManager';

/**
 * Gets a sublist of the given list with items of the given ids only
 *
 * The given list must have a field id or key
 *
 * @param idList The ids of items to find
 * @param originalList The original list
 * @returns {[]}
 */
export function getSublistWithIds<T>(
  idList: Array<string>,
  originalList: Array<{key: string, ...T}>,
): Array<{key: string, ...T} | null> {
  const subList = [];
  for (let i = 0; i < idList.length; i += 1) {
    subList.push(null);
  }
  let itemsAdded = 0;
  for (let i = 0; i < originalList.length; i += 1) {
    const item = originalList[i];
    if (idList.includes(item.key)) {
      subList[idList.indexOf(item.key)] = item;
      itemsAdded += 1;
      if (itemsAdded === idList.length) break;
    }
  }
  return subList;
}

/**
 * Updates status bar content color if on iOS only,
 * as the android status bar is always set to black.
 */
export function setupStatusBar() {
  if (ThemeManager.getNightMode()) {
    StatusBar.setBarStyle('light-content', true);
  } else {
    StatusBar.setBarStyle('dark-content', true);
  }
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(
      ThemeManager.getCurrentTheme().colors.surface,
      true,
    );
  }
}
