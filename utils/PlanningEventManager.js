
export default class PlanningEventManager {
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
     * Convert the date string given by in the event list json to a date object
     * @param dateString
     * @return {Date}
     */
    static stringToDate(dateString: ?string): ?Date {
        let date = new Date();
        if (dateString === undefined || dateString === null)
            date = undefined;
        else if (dateString.split(' ').length > 1) {
            let timeStr = dateString.split(' ')[1];
            date.setHours(parseInt(timeStr.split(':')[0]), parseInt(timeStr.split(':')[1]), 0);
        } else
            date = undefined;
        return date;
    }

    static padStr(i: number) {
        return (i < 10) ? "0" + i : "" + i;
    }

    static getFormattedEventTime(event: Object): string {
        let formattedStr = '';
        let startDate = PlanningEventManager.stringToDate(event['date_begin']);
        let endDate = PlanningEventManager.stringToDate(event['date_end']);
        if (startDate !== undefined && startDate !== null && endDate !== undefined && endDate !== null)
            formattedStr = PlanningEventManager.padStr(startDate.getHours()) + ':' + PlanningEventManager.padStr(startDate.getMinutes()) +
                ' - ' + PlanningEventManager.padStr(endDate.getHours()) + ':' + PlanningEventManager.padStr(endDate.getMinutes());
        else if (startDate !== undefined && startDate !== null)
            formattedStr = PlanningEventManager.padStr(startDate.getHours()) + ':' + PlanningEventManager.padStr(startDate.getMinutes());
        return formattedStr
    }

    static isDescriptionEmpty (description: string) {
        if (description !== undefined && description !== null) {
            return description
                .replace('<p>', '')
                .replace('</p>', '')
                .replace('<br>', '').trim() === '';
        } else
            return true;
    }
}
