
export default class PlanningEventManager {
    static isEventBefore(event1: Object, event2: Object) {
        let date1 = new Date();
        let date2 = new Date();
        let timeArray = this.getEventStartTime(event1).split(":");
        date1.setHours(parseInt(timeArray[0]), parseInt(timeArray[1]));
        timeArray = this.getEventStartTime(event2).split(":");
        date2.setHours(parseInt(timeArray[0]), parseInt(timeArray[1]));
        return date1 < date2;
    }

    static getEventStartDate(event: Object) {
        return event.date_begin.split(" ")[0];
    }

    static getEventStartTime(event: Object) {
        if (event !== undefined && Object.keys(event).length > 0 && event.date_begin !== null)
            return this.formatTime(event.date_begin.split(" ")[1]);
        else
            return "";
    }

    static getEventEndTime(event: Object) {
        if (event !== undefined && Object.keys(event).length > 0 && event.date_end !== null)
            return this.formatTime(event.date_end.split(" ")[1]);
        else
            return "";
    }

    static getFormattedTime(event: Object) {
        if (this.getEventEndTime(event) !== "")
            return this.getEventStartTime(event) + " - " + this.getEventEndTime(event);
        else
            return this.getEventStartTime(event);
    }

    static formatTime(time: string) {
        let array = time.split(':');
        return array[0] + ':' + array[1];
    }
}
