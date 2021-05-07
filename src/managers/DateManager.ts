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

/**
 * Singleton used to manage date translations.
 * Translations are hardcoded as toLocaleDateString does not work on current android JS engine
 */
export default class DateManager {
  static instance: DateManager | null = null;

  daysOfWeek: Array<string> = [];

  monthsOfYear: Array<string> = [];

  constructor() {
    this.daysOfWeek.push(i18n.t('date.daysOfWeek.sunday')); // 0 represents sunday
    this.daysOfWeek.push(i18n.t('date.daysOfWeek.monday'));
    this.daysOfWeek.push(i18n.t('date.daysOfWeek.tuesday'));
    this.daysOfWeek.push(i18n.t('date.daysOfWeek.wednesday'));
    this.daysOfWeek.push(i18n.t('date.daysOfWeek.thursday'));
    this.daysOfWeek.push(i18n.t('date.daysOfWeek.friday'));
    this.daysOfWeek.push(i18n.t('date.daysOfWeek.saturday'));

    this.monthsOfYear.push(i18n.t('date.monthsOfYear.january'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.february'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.march'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.april'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.may'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.june'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.july'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.august'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.september'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.october'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.november'));
    this.monthsOfYear.push(i18n.t('date.monthsOfYear.december'));
  }

  /**
   * Get this class instance or create one if none is found
   * @returns {DateManager}
   */
  static getInstance(): DateManager {
    if (DateManager.instance == null) {
      DateManager.instance = new DateManager();
    }
    return DateManager.instance;
  }

  static isWeekend(date: Date): boolean {
    return date.getDay() === 6 || date.getDay() === 0;
  }

  getMonthsOfYear(): Array<string> {
    return this.monthsOfYear;
  }

  /**
   * Gets a translated string representing the given date.
   *
   * @param dateString The date with the format YYYY-MM-DD
   * @return {string} The translated string
   */
  getTranslatedDate(dateString: string): string {
    const dateArray = dateString.split('-');
    const date = new Date();
    date.setFullYear(
      parseInt(dateArray[0], 10),
      parseInt(dateArray[1], 10) - 1,
      parseInt(dateArray[2], 10)
    );
    return `${this.daysOfWeek[date.getDay()]} ${date.getDate()} ${
      this.monthsOfYear[date.getMonth()]
    } ${date.getFullYear()}`;
  }
}
