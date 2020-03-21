export default class PlanningEventManager {

    // Regex used to check date string validity
    static dateRegExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    /**
     * Gets the current day string representation in the format
     * YYYY-MM-DD
     *
     * @return {string} The string representation
     */
    static getCurrentDateString(): string {
        return PlanningEventManager.dateToString(new Date());
    }

    /**
     * Gets how many days the event lasts. If no end date is specified, defaults to 1.
     *
     *
     * @param start The start date string in format YYYY-MM-DD HH:MM:SS
     * @param end The end date string in format YYYY-MM-DD HH:MM:SS
     * @return {number} The number of days, 0 on error
     */
    static getEventDaysNumber(start: string, end: string): number {
        let startDate = PlanningEventManager.stringToDate(start);
        let endDate = PlanningEventManager.stringToDate(end);
        if (startDate !== undefined && endDate !== undefined) {
            if (startDate.getTime() !== endDate.getTime()) {
                const diffTime = endDate - startDate;
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            } else
                return 1;
        } else if (startDate !== undefined)
            return 1;
        else
            return 0;
    }


    /**
     * Checks if the given date is before the other.
     *
     * @param event1Date Event 1 date in format YYYY-MM-DD HH:MM:SS
     * @param event2Date Event 2 date in format YYYY-MM-DD HH:MM:SS
     * @return {boolean}
     */
    static isEventBefore(event1Date: ?string, event2Date: ?string) {
        let date1 = PlanningEventManager.stringToDate(event1Date);
        let date2 = PlanningEventManager.stringToDate(event2Date);
        if (date1 !== undefined && date2 !== undefined)
            return date1 < date2;
        else
            return false;
    }

    /**
     * Gets only the date part of the given event date string in the format
     * YYYY-MM-DD HH:MM:SS
     *
     * @param dateString The string to get the date from
     * @return {string|undefined} Date in format YYYY:MM:DD or undefined if given string is invalid
     */
    static getDateOnlyString(dateString: ?string) {
        if (PlanningEventManager.isEventDateStringFormatValid(dateString))
            return dateString.split(" ")[0];
        else
            return undefined;
    }

    /**
     * Checks if the given date string is in the format
     * YYYY-MM-DD HH:MM:SS
     *
     * @param dateString The string to check
     * @return {boolean}
     */
    static isEventDateStringFormatValid(dateString: ?string) {
        return dateString !== undefined
            && dateString !== null
            && PlanningEventManager.dateRegExp.test(dateString);
    }

    /**
     * Converts the given date string to a date object.<br>
     * Accepted format: YYYY-MM-DD HH:MM:SS
     *
     * @param dateString The string to convert
     * @return {Date|undefined} The date object or undefined if the given string is invalid
     */
    static stringToDate(dateString: ?string): Date | undefined {
        let date = new Date();
        if (PlanningEventManager.isEventDateStringFormatValid(dateString)) {
            let stringArray = dateString.split(' ');
            let dateArray = stringArray[0].split('-');
            let timeArray = stringArray[1].split(':');
            date.setFullYear(
                parseInt(dateArray[0]),
                parseInt(dateArray[1]) - 1, // Month range from 0 to 11
                parseInt(dateArray[2])
            );
            date.setHours(
                parseInt(timeArray[0]),
                parseInt(timeArray[1]),
                parseInt(timeArray[2]),
                0,
            );
        } else
            date = undefined;

        return date;
    }

    /**
     * Converts a date object to a string in the format
     * YYYY-MM-DD HH-MM-SS
     *
     * @param date The date object to convert
     * @return {string} The converted string
     */
    static dateToString(date: Date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }

    /**
     * Returns a string corresponding to the event start and end times in the following format:
     *
     * HH:MM - HH:MM
     *
     * If the end date is not specified or is equal to start time, only start time will be shown.
     *
     * If the end date is not on the same day, 23:59 will be shown as end time
     *
     * @param start Start time in YYYY-MM-DD HH:MM:SS format
     * @param end End time in YYYY-MM-DD HH:MM:SS format
     * @return {string} Formatted string or "/ - /" on error
     */
    static getFormattedEventTime(start: ?string, end: ?string): string {
        let formattedStr = '/ - /';
        let startDate = PlanningEventManager.stringToDate(start);
        let endDate = PlanningEventManager.stringToDate(end);

        if (startDate !== undefined && endDate !== undefined && startDate.getTime() !== endDate.getTime()) {
            formattedStr = String(startDate.getHours()).padStart(2, '0') + ':'
                + String(startDate.getMinutes()).padStart(2, '0') + ' - ';
            if (endDate.getFullYear() > startDate.getFullYear()
                || endDate.getMonth() > startDate.getMonth()
                || endDate.getDate() > startDate.getDate())
                formattedStr += '23:59';
            else
                formattedStr += String(endDate.getHours()).padStart(2, '0') + ':'
                    + String(endDate.getMinutes()).padStart(2, '0');
        } else if (startDate !== undefined)
            formattedStr =
                String(startDate.getHours()).padStart(2, '0') + ':'
                + String(startDate.getMinutes()).padStart(2, '0');

        return formattedStr
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
    static isDescriptionEmpty(description: ?string): boolean {
        if (description !== undefined && description !== null) {
            return description
                .split('<p>').join('') // Equivalent to a replace all
                .split('</p>').join('')
                .split('<br>').join('').trim() === '';
        } else
            return true;
    }
}
