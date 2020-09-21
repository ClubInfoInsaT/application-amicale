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
 * Sanitizes the given string to improve search performance.
 *
 * This removes the case, accents, spaces and underscores.
 *
 * @param str The string to sanitize
 * @return {string} The sanitized string
 */
export function sanitizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, '')
    .replace(/_/g, '');
}

/**
 * Checks if the given string matches the query.
 *
 * @param str The string to check
 * @param query The query string used to find a match
 * @returns {boolean}
 */
export function stringMatchQuery(str: string, query: string): boolean {
  return sanitizeString(str).includes(sanitizeString(query));
}

/**
 * Checks if the given arrays have an item in common
 *
 * @param filter The filter array
 * @param categories The item's categories tuple
 * @returns {boolean} True if at least one entry is in both arrays
 */
export function isItemInCategoryFilter(
  filter: Array<number>,
  categories: Array<number | null>,
): boolean {
  let itemFound = false;
  categories.forEach((cat: number | null) => {
    if (cat != null && filter.indexOf(cat) !== -1) {
      itemFound = true;
    }
  });
  return itemFound;
}
