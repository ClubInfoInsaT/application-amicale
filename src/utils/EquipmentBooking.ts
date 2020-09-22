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
import type {DeviceType} from '../screens/Amicale/Equipment/EquipmentListScreen';
import DateManager from '../managers/DateManager';
import type {MarkedDatesObjectType} from '../screens/Amicale/Equipment/EquipmentRentScreen';
import {PeriodMarking} from 'react-native-calendars';

/**
 * Gets the current day at midnight
 *
 * @returns {Date}
 */
export function getCurrentDay(): Date {
  const today = new Date(Date.now());
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

/**
 * Returns the ISO date format (without the time)
 *
 * @param date The date to recover the ISO format from
 * @returns {*}
 */
export function getISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Finds if the given equipment is available today
 *
 * @param item
 * @returns {boolean}
 */
export function isEquipmentAvailable(item: DeviceType): boolean {
  let isAvailable = true;
  const today = getCurrentDay();
  const dates = item.booked_at;
  dates.forEach((date: {begin: string; end: string}) => {
    const start = new Date(date.begin);
    const end = new Date(date.end);
    if (!(today < start || today > end)) {
      isAvailable = false;
    }
  });
  return isAvailable;
}

/**
 * Finds the first date free for booking.
 *
 * @param item
 * @returns {Date}
 */
export function getFirstEquipmentAvailability(item: DeviceType): Date {
  let firstAvailability = getCurrentDay();
  const dates = item.booked_at;
  dates.forEach((date: {begin: string; end: string}) => {
    const start = new Date(date.begin);
    const end = new Date(date.end);
    end.setDate(end.getDate() + 1);
    if (firstAvailability >= start) {
      firstAvailability = end;
    }
  });
  return firstAvailability;
}

/**
 * Gets a translated string representing the given date, relative to the current date
 *
 * @param date The date to translate
 */
export function getRelativeDateString(date: Date): string {
  const today = getCurrentDay();
  const yearDelta = date.getUTCFullYear() - today.getUTCFullYear();
  const monthDelta = date.getUTCMonth() - today.getUTCMonth();
  const dayDelta = date.getUTCDate() - today.getUTCDate();
  let translatedString = i18n.t('screens.equipment.today');
  if (yearDelta > 0) {
    translatedString = i18n.t('screens.equipment.otherYear', {
      date: date.getDate(),
      month: DateManager.getInstance().getMonthsOfYear()[date.getMonth()],
      year: date.getFullYear(),
    });
  } else if (monthDelta > 0) {
    translatedString = i18n.t('screens.equipment.otherMonth', {
      date: date.getDate(),
      month: DateManager.getInstance().getMonthsOfYear()[date.getMonth()],
    });
  } else if (dayDelta > 1) {
    translatedString = i18n.t('screens.equipment.thisMonth', {
      date: date.getDate(),
    });
  } else if (dayDelta === 1) {
    translatedString = i18n.t('screens.equipment.tomorrow');
  }

  return translatedString;
}

/**
 * Gets a valid array of dates between the given start and end, for the corresponding item.
 * I stops at the first booked date encountered before the end.
 * It assumes the range start and end are valid.
 *
 * Start and End specify the range's direction.
 * If start < end, it will begin at Start and stop if it encounters any booked date before reaching End.
 * If start > end, it will begin at End and stop if it encounters any booked dates before reaching Start.
 *
 * @param start Range start
 * @param end Range end
 * @param item Item containing booked dates to look for
 * @returns {[string]}
 */
export function getValidRange(
  start: Date,
  end: Date,
  item: DeviceType | null,
): Array<string> {
  const direction = start <= end ? 1 : -1;
  let limit = new Date(end);
  limit.setDate(limit.getDate() + direction); // Limit is excluded, but we want to include range end
  if (item != null) {
    if (direction === 1) {
      for (let i = 0; i < item.booked_at.length; i += 1) {
        const bookLimit = new Date(item.booked_at[i].begin);
        if (start < bookLimit && limit > bookLimit) {
          limit = bookLimit;
          break;
        }
      }
    } else {
      for (let i = item.booked_at.length - 1; i >= 0; i -= 1) {
        const bookLimit = new Date(item.booked_at[i].end);
        if (start > bookLimit && limit < bookLimit) {
          limit = bookLimit;
          break;
        }
      }
    }
  }

  const validRange = [];
  const date = new Date(start);
  while (
    (direction === 1 && date < limit) ||
    (direction === -1 && date > limit)
  ) {
    if (direction === 1) {
      validRange.push(getISODate(date));
    } else {
      validRange.unshift(getISODate(date));
    }
    date.setDate(date.getDate() + direction);
  }
  return validRange;
}

/**
 * Generates calendar compatible marked dates from the given array
 *
 *
 * @param isSelection True to use user selection color, false to use disabled color
 * @param theme The current App theme to get colors from
 * @param range The range to mark dates for
 * @returns {{}}
 */
export function generateMarkedDates(
  isSelection: boolean,
  theme: ReactNativePaper.Theme,
  range: Array<string>,
): MarkedDatesObjectType {
  const markedDates: {
    [key: string]: PeriodMarking;
  } = {};
  for (let i = 0; i < range.length; i += 1) {
    const isStart = i === 0;
    const isEnd = i === range.length - 1;
    let color;
    if (isSelection && (isStart || isEnd)) {
      color = theme.colors.primary;
    } else if (isSelection) {
      color = theme.colors.danger;
    } else {
      color = theme.colors.textDisabled;
    }
    markedDates[range[i]] = {
      startingDay: isStart,
      endingDay: isEnd,
      color,
    };
  }
  return markedDates;
}
