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
  description: string;
  category: string;
  location: string;
  public: boolean;
  clubId: number;
  clubName: string;
  logo: string;
  start: number;
  end: number;
  ongoing: boolean;
  reactions: number;
  userReactions: number;
  url: string;
};

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
 * Converts a date object to a string in the format
 * YYYY-MM-DD HH-MM
 *
 * @param date The date object to convert
 * @param isUTC Whether to treat the date as UTC
 * @return {string} The converted string
 */
export function dateToDateTimeString(date: Date, isUTC: boolean): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = date.getFullYear();
  const h = isUTC ? date.getUTCHours() : date.getHours();
  const hours = String(h).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Converts a date object to a string in the format
 * YYYY-MM-DD
 *
 * @param date The date object to convert
 * @return {string} The converted string
 */
export function dateToDateString(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Converts a date object to a string in the format
 * HH-MM
 *
 * @param date The date object to convert
 * @param isUTC Whether to treat the date as UTC
 * @return {string} The converted string
 */
export function dateToTimeString(date: Date, isUTC: boolean): string {
  const h = isUTC ? date.getUTCHours() : date.getHours();
  const hours = String(h).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Generates an object with an array of eventObject at each key.
 * Each key is a date string in the format
 * YYYY-MM-DD.
 *
 * If no event is available at the given key, the array will be empty
 *
 * @param events The list of events to map to the agenda
 * @return {Object}
 */
export function generateEventAgenda(events: PlanningEventType[]): {
  [key: string]: Array<PlanningEventType>;
} {
  let eventsByDate: { [key: string]: Array<PlanningEventType> } = {};
  eventsByDate[dateToDateString(new Date())] = [];
  events.forEach((event) => {
    const dateString = dateToDateString(new Date(event.start * 1000));
    if (!eventsByDate[dateString]) {
      eventsByDate[dateString] = [event];
    } else {
      eventsByDate[dateString].push(event);
    }
  });

  return eventsByDate;
}
