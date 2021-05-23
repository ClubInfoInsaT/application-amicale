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

export type PlanningEventType = {
  id: number;
  title: string;
  date_begin: string;
  club: string;
  category_id: number;
  description: string;
  place: string;
  url: string;
  logo: string | null;
};

// Regex used to check date string validity
const dateRegExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

/**
 * Checks if the given date string is in the format
 * YYYY-MM-DD HH:MM
 *
 * @param dateString The string to check
 * @return {boolean}
 */
export function isEventDateStringFormatValid(dateString?: string): boolean {
  return (
    dateString !== undefined &&
    dateString !== null &&
    dateRegExp.test(dateString)
  );
}

/**
 * Converts the given date string to a date object.<br>
 * Accepted format: YYYY-MM-DD HH:MM
 *
 * @param dateString The string to convert
 * @return {Date|null} The date object or null if the given string is invalid
 */
export function stringToDate(dateString: string): Date | null {
  let date: Date | null = new Date();
  if (isEventDateStringFormatValid(dateString)) {
    const stringArray = dateString.split(' ');
    const dateArray = stringArray[0].split('-');
    const timeArray = stringArray[1].split(':');
    date.setFullYear(
      parseInt(dateArray[0], 10),
      parseInt(dateArray[1], 10) - 1, // Month range from 0 to 11
      parseInt(dateArray[2], 10)
    );
    date.setHours(parseInt(timeArray[0], 10), parseInt(timeArray[1], 10), 0, 0);
  } else {
    date = null;
  }

  return date;
}

/**
 * Converts a date object to a string in the format
 * YYYY-MM-DD HH-MM
 *
 * @param date The date object to convert
 * @param isUTC Whether to treat the date as UTC
 * @return {string} The converted string
 */
export function dateToString(date: Date, isUTC: boolean): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = date.getFullYear();
  const h = isUTC ? date.getUTCHours() : date.getHours();
  const hours = String(h).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Gets the current day string representation in the format
 * YYYY-MM-DD
 *
 * @return {string} The string representation
 */
export function getCurrentDateString(): string {
  return dateToString(new Date(Date.now()), false);
}

/**
 * Checks if the given date is before the other.
 *
 * @param event1Date Event 1 date in format YYYY-MM-DD HH:MM
 * @param event2Date Event 2 date in format YYYY-MM-DD HH:MM
 * @return {boolean}
 */
export function isEventBefore(event1Date: string, event2Date: string): boolean {
  const date1 = stringToDate(event1Date);
  const date2 = stringToDate(event2Date);
  if (date1 !== null && date2 !== null) {
    return date1 < date2;
  }
  return false;
}

/**
 * Gets only the date part of the given event date string in the format
 * YYYY-MM-DD HH:MM
 *
 * @param dateString The string to get the date from
 * @return {string|null} Date in format YYYY:MM:DD or null if given string is invalid
 */
export function getDateOnlyString(dateString: string): string | null {
  if (isEventDateStringFormatValid(dateString)) {
    return dateString.split(' ')[0];
  }
  return null;
}

/**
 * Gets only the time part of the given event date string in the format
 * YYYY-MM-DD HH:MM
 *
 * @param dateString The string to get the date from
 * @return {string|null} Time in format HH:MM or null if given string is invalid
 */
export function getTimeOnlyString(dateString: string): string | null {
  if (isEventDateStringFormatValid(dateString)) {
    return dateString.split(' ')[1];
  }
  return null;
}

/**
 * Checks if the given description can be considered empty.
 * <br>
 * An empty description is composed only of whitespace, <b>br</b> or <b>p</b> tags
 *
 *
 * @param description The text to check
 * @return {boolean}
 */
export function isDescriptionEmpty(description?: string): boolean {
  if (description !== undefined && description !== null) {
    return (
      description
        .split('<p>')
        .join('') // Equivalent to a replace all
        .split('</p>')
        .join('')
        .split('<br>')
        .join('')
        .trim() === ''
    );
  }
  return true;
}

/**
 * Generates an object with an empty array for each key.
 * Each key is a date string in the format
 * YYYY-MM-DD
 *
 * @param numberOfMonths The number of months to create, starting from the current date
 * @return {Object}
 */
export function generateEmptyCalendar(numberOfMonths: number): {
  [key: string]: Array<PlanningEventType>;
} {
  const end = new Date(Date.now());
  end.setMonth(end.getMonth() + numberOfMonths);
  const daysOfYear: { [key: string]: Array<PlanningEventType> } = {};
  for (let d = new Date(Date.now()); d <= end; d.setDate(d.getDate() + 1)) {
    const dateString = getDateOnlyString(dateToString(new Date(d), false));
    if (dateString !== null) {
      daysOfYear[dateString] = [];
    }
  }
  return daysOfYear;
}

/**
 * Adds events to the given array depending on their starting date.
 *
 * Events starting before are added at the front.
 *
 * @param eventArray The array to hold sorted events
 * @param event The event to add to the array
 */
export function pushEventInOrder(
  eventArray: Array<PlanningEventType>,
  event: PlanningEventType
) {
  if (eventArray.length === 0) {
    eventArray.push(event);
  } else {
    for (let i = 0; i < eventArray.length; i += 1) {
      if (isEventBefore(event.date_begin, eventArray[i].date_begin)) {
        eventArray.splice(i, 0, event);
        break;
      } else if (i === eventArray.length - 1) {
        eventArray.push(event);
        break;
      }
    }
  }
}

/**
 * Generates an object with an array of eventObject at each key.
 * Each key is a date string in the format
 * YYYY-MM-DD.
 *
 * If no event is available at the given key, the array will be empty
 *
 * @param eventList The list of events to map to the agenda
 * @param numberOfMonths The number of months to create the agenda for
 * @return {Object}
 */
export function generateEventAgenda(
  eventList: Array<PlanningEventType>,
  numberOfMonths: number
): { [key: string]: Array<PlanningEventType> } {
  const agendaItems = generateEmptyCalendar(numberOfMonths);
  for (let i = 0; i < eventList.length; i += 1) {
    const dateString = getDateOnlyString(eventList[i].date_begin);
    if (dateString != null) {
      const eventArray = agendaItems[dateString];
      if (eventArray != null) {
        pushEventInOrder(eventArray, eventList[i]);
      }
    }
  }
  return agendaItems;
}
