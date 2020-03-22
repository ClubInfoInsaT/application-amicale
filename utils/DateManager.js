// @flow

import i18n from 'i18n-js';

export default class DateManager {
    static instance: DateManager | null = null;

    // Hard code strings as toLocaleDateString does not work on current android JS engine
    daysOfWeek = [];
    monthsOfYear = [];

    constructor() {
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.sunday")); // 0 represents sunday
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.monday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.tuesday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.wednesday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.thursday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.friday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.saturday"));

        this.monthsOfYear.push(i18n.t("date.monthsOfYear.january"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.february"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.march"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.april"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.may"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.june"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.july"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.august"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.september"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.october"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.november"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.december"));
    }

    /**
     * Get this class instance or create one if none is found
     * @returns {DateManager}
     */
    static getInstance(): DateManager {
        return DateManager.instance === null ?
            DateManager.instance = new DateManager() :
            DateManager.instance;
    }

    getTranslatedDate(dateString: string) {
        let dateArray = dateString.split('-');
        let date = new Date();
        date.setFullYear(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]));
        return this.daysOfWeek[date.getDay()] + " " + date.getDate() + " " + this.monthsOfYear[date.getMonth()] + " " + date.getFullYear();
    }

}
