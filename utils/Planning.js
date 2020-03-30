// @flow

export type eventObject = {
    id: number,
    title: string,
    logo: string,
    date_begin: string,
    date_end: string,
    description: string,
    club: string,
    category_id: number,
    url: string,
};

// Regex used to check date string validity
const dateRegExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

/**
 * Gets the current day string representation in the format
 * YYYY-MM-DD
 *
 * @return {string} The string representation
 */
export function getCurrentDateString(): string {
    return dateToString(new Date(Date.now()));
}

/**
 * Checks if the given date is before the other.
 *
 * @param event1Date Event 1 date in format YYYY-MM-DD HH:MM
 * @param event2Date Event 2 date in format YYYY-MM-DD HH:MM
 * @return {boolean}
 */
export function isEventBefore(event1Date: string, event2Date: string): boolean {
    let date1 = stringToDate(event1Date);
    let date2 = stringToDate(event2Date);
    if (date1 !== null && date2 !== null)
        return date1 < date2;
    else
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
    if (isEventDateStringFormatValid(dateString))
        return dateString.split(" ")[0];
    else
        return null;
}

/**
 * Checks if the given date string is in the format
 * YYYY-MM-DD HH:MM
 *
 * @param dateString The string to check
 * @return {boolean}
 */
export function isEventDateStringFormatValid(dateString: ?string): boolean {
    return dateString !== undefined
        && dateString !== null
        && dateRegExp.test(dateString);
}

/**
 * Converts the given date string to a date object.<br>
 * Accepted format: YYYY-MM-DD HH:MM
 *
 * @param dateString The string to convert
 * @return {Date|null} The date object or null if the given string is invalid
 */
export function stringToDate(dateString: string): Date | null {
    let date = new Date();
    if (isEventDateStringFormatValid(dateString)) {
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
            0,
            0,
        );
    } else
        date = null;

    return date;
}

/**
 * Converts a date object to a string in the format
 * YYYY-MM-DD HH-MM-SS
 *
 * @param date The date object to convert
 * @return {string} The converted string
 */
export function dateToString(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
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
export function getFormattedEventTime(start: string, end: string): string {
    let formattedStr = '/ - /';
    let startDate = stringToDate(start);
    let endDate = stringToDate(end);

    if (startDate !== null && endDate !== null && startDate.getTime() !== endDate.getTime()) {
        formattedStr = String(startDate.getHours()).padStart(2, '0') + ':'
            + String(startDate.getMinutes()).padStart(2, '0') + ' - ';
        if (endDate.getFullYear() > startDate.getFullYear()
            || endDate.getMonth() > startDate.getMonth()
            || endDate.getDate() > startDate.getDate())
            formattedStr += '23:59';
        else
            formattedStr += String(endDate.getHours()).padStart(2, '0') + ':'
                + String(endDate.getMinutes()).padStart(2, '0');
    } else if (startDate !== null)
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
export function isDescriptionEmpty(description: ?string): boolean {
    if (description !== undefined && description !== null) {
        return description
            .split('<p>').join('') // Equivalent to a replace all
            .split('</p>').join('')
            .split('<br>').join('').trim() === '';
    } else
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
export function generateEmptyCalendar(numberOfMonths: number): Object {
    let end = new Date(Date.now());
    end.setMonth(end.getMonth() + numberOfMonths);
    let daysOfYear = {};
    for (let d = new Date(Date.now()); d <= end; d.setDate(d.getDate() + 1)) {
        const dateString = getDateOnlyString(
            dateToString(new Date(d)));
        if (dateString !== null)
            daysOfYear[dateString] = []
    }
    return daysOfYear;
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
export function generateEventAgenda(eventList: Array<eventObject>, numberOfMonths: number): Object {
    let agendaItems = generateEmptyCalendar(numberOfMonths);
    for (let i = 0; i < eventList.length; i++) {
        const dateString = getDateOnlyString(eventList[i].date_begin);
        if (dateString !== null) {
            const eventArray = agendaItems[dateString];
            if (eventArray !== undefined)
                pushEventInOrder(eventArray, eventList[i]);
        }

    }
    return agendaItems;
}

/**
 * Adds events to the given array depending on their starting date.
 *
 * Events starting before are added at the front.
 *
 * @param eventArray The array to hold sorted events
 * @param event The event to add to the array
 */
export function pushEventInOrder(eventArray: Array<eventObject>, event: eventObject): Object {
    if (eventArray.length === 0)
        eventArray.push(event);
    else {
        for (let i = 0; i < eventArray.length; i++) {
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
