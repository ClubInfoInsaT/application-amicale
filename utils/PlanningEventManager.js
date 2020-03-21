export default class PlanningEventManager {

    // Regex used to check date string validity
    static dateRegExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    static isEventBefore(event1: Object, event2: Object) {
        let date1 = new Date();
        let date2 = new Date();
        let timeArray = PlanningEventManager.getEventStartTime(event1).split(":");
        date1.setHours(parseInt(timeArray[0]), parseInt(timeArray[1]));
        timeArray = PlanningEventManager.getEventStartTime(event2).split(":");
        date2.setHours(parseInt(timeArray[0]), parseInt(timeArray[1]));
        return date1 < date2;
    }

    static getEventStartDate(event: Object) {
        return event.date_begin.split(" ")[0];
    }

    static getEventStartTime(event: Object) {
        if (event !== undefined && Object.keys(event).length > 0 && event.date_begin !== null)
            return PlanningEventManager.formatTime(event.date_begin.split(" ")[1]);
        else
            return "";
    }

    static getEventEndTime(event: Object) {
        if (event !== undefined && Object.keys(event).length > 0 && event.date_end !== null)
            return PlanningEventManager.formatTime(event.date_end.split(" ")[1]);
        else
            return "";
    }

    static getFormattedTime(event: Object) {
        if (PlanningEventManager.getEventEndTime(event) !== "")
            return PlanningEventManager.getEventStartTime(event) + " - " + PlanningEventManager.getEventEndTime(event);
        else
            return PlanningEventManager.getEventStartTime(event);
    }

    static formatTime(time: string) {
        let array = time.split(':');
        return array[0] + ':' + array[1];
    }

    /**
     * Checks if the given date string is in the format
     * YYYY-MM-DD HH:MM:SS
     *
     * @param dateString The string to check
     * @return {boolean}
     */
    static isDateStringFormatValid(dateString: ?string) {
        return dateString !== undefined
            && dateString !== null
            && PlanningEventManager.dateRegExp.test(dateString);
    }

    /**
     * Converts the given date string to a date object.<br>
     * Accepted format: YYYY-MM-DD HH:MM:SS
     *
     * @param dateString The string to convert
     * @return {Date} The date object or undefined if the given string is invalid
     */
    static stringToDate(dateString: ?string): Date | undefined {
        let date = new Date();
        if (PlanningEventManager.isDateStringFormatValid(dateString)) {
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
     * Returns a padded string for the given number if it is lower than 10
     *
     * @param i The string to be converted
     * @return {string}
     */
    static toPaddedString(i: number): string {
        return (i < 10 && i >= 0) ? "0" + i.toString(10) : i.toString(10);
    }

    /**
     * Returns a string corresponding to the event start and end times in the following format:
     *
     * HH:MM - HH:MM
     *
     * If the end date is not specified or is equal to start time, only start time will be shown.
     *
     * If the end date is not on the same day, 00:00 will be shown as end time
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
            formattedStr = PlanningEventManager.toPaddedString(startDate.getHours()) + ':'
                + PlanningEventManager.toPaddedString(startDate.getMinutes()) + ' - ';
            if (endDate.getFullYear() > startDate.getFullYear()
                || endDate.getMonth() > startDate.getMonth()
                || endDate.getDate() > startDate.getDate())
                formattedStr += '00:00';
            else
                formattedStr += PlanningEventManager.toPaddedString(endDate.getHours()) + ':'
                    + PlanningEventManager.toPaddedString(endDate.getMinutes());
        } else if (startDate !== undefined)
            formattedStr =
                PlanningEventManager.toPaddedString(startDate.getHours()) + ':'
                + PlanningEventManager.toPaddedString(startDate.getMinutes());

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
