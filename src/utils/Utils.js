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
