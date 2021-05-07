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

/**
 * Gets the given services list without items of the given ids
 *
 * @param idList The ids of items to remove
 * @param sourceList The item list to use as source
 * @returns {[]}
 */
export default function getStrippedServicesList<T extends { key: string }>(
  idList: Array<string>,
  sourceList: Array<T>
) {
  const newArray: Array<T> = [];
  sourceList.forEach((item: T) => {
    if (!idList.includes(item.key)) {
      newArray.push(item);
    }
  });
  return newArray;
}

/**
 * Gets a sublist of the given list with items of the given ids only
 *
 * The given list must have a field id or key
 *
 * @param idList The ids of items to find
 * @param originalList The original list
 * @returns {[]}
 */
export function getSublistWithIds<T extends { key: string }>(
  idList: Array<string>,
  originalList: Array<T>
) {
  const subList: Array<T | null> = [];
  for (let i = 0; i < idList.length; i += 1) {
    subList.push(null);
  }
  let itemsAdded = 0;
  for (let i = 0; i < originalList.length; i += 1) {
    const item = originalList[i];
    if (idList.includes(item.key)) {
      subList[idList.indexOf(item.key)] = item;
      itemsAdded += 1;
      if (itemsAdded === idList.length) {
        break;
      }
    }
  }
  return subList;
}
