// @flow

import type {Device} from "../screens/Amicale/Equipment/EquipmentListScreen";
import i18n from "i18n-js";
import DateManager from "../managers/DateManager";
import type {CustomTheme} from "../managers/ThemeManager";

/**
 * Gets the current day at midnight
 *
 * @returns {Date}
 */
export function getCurrentDay() {
    let today = new Date(Date.now());
    today.setUTCHours(0, 0, 0, 0);
    return today;
}

/**
 * Returns the ISO date format (without the time)
 *
 * @param date The date to recover the ISO format from
 * @returns {*}
 */
export function getISODate(date: Date) {
    return date.toISOString().split("T")[0];
}

/**
 * Finds if the given equipment is available today
 *
 * @param item
 * @returns {boolean}
 */
export function isEquipmentAvailable(item: Device) {
    let isAvailable = true;
    const today = getCurrentDay();
    const dates = item.booked_at;
    for (let i = 0; i < dates.length; i++) {
        const start = new Date(dates[i].begin);
        const end = new Date(dates[i].end);
        isAvailable = today < start || today > end;
        if (!isAvailable)
            break;
    }
    return isAvailable;
}

/**
 * Finds the first date free for booking.
 *
 * @param item
 * @returns {Date}
 */
export function getFirstEquipmentAvailability(item: Device) {
    let firstAvailability = getCurrentDay();
    const dates = item.booked_at;
    for (let i = 0; i < dates.length; i++) {
        const start = new Date(dates[i].begin);
        let end = new Date(dates[i].end);
        end.setDate(end.getDate() + 1);
        if (firstAvailability >= start)
            firstAvailability = end;
    }
    return firstAvailability;
}

/**
 * Gets a translated string representing the given date, relative to the current date
 *
 * @param date The date to translate
 */
export function getRelativeDateString(date: Date) {
    const today = getCurrentDay();
    const yearDelta = date.getUTCFullYear() - today.getUTCFullYear();
    const monthDelta = date.getUTCMonth() - today.getUTCMonth();
    const dayDelta = date.getUTCDate() - today.getUTCDate();
    let translatedString = i18n.t('screens.equipment.today');
    if (yearDelta > 0)
        translatedString = i18n.t('screens.equipment.otherYear', {
            date: date.getDate(),
            month: DateManager.getInstance().getMonthsOfYear()[date.getMonth()],
            year: date.getFullYear()
        });
    else if (monthDelta > 0)
        translatedString = i18n.t('screens.equipment.otherMonth', {
            date: date.getDate(),
            month: DateManager.getInstance().getMonthsOfYear()[date.getMonth()],
        });
    else if (dayDelta > 1)
        translatedString = i18n.t('screens.equipment.thisMonth', {
            date: date.getDate(),
        });
    else if (dayDelta === 1)
        translatedString = i18n.t('screens.equipment.tomorrow');

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
export function getValidRange(start: Date, end: Date, item: Device | null) {
    let direction = start <= end ? 1 : -1;
    let limit = new Date(end);
    limit.setDate(limit.getDate() + direction); // Limit is excluded, but we want to include range end
    if (item != null) {
        if (direction === 1) {
            for (let i = 0; i < item.booked_at.length; i++) {
                const bookLimit = new Date(item.booked_at[i].begin);
                if (start < bookLimit && limit > bookLimit) {
                    limit = bookLimit;
                    break;
                }
            }
        } else {
            for (let i = item.booked_at.length - 1; i >= 0; i--) {
                const bookLimit = new Date(item.booked_at[i].end);
                if (start > bookLimit && limit < bookLimit) {
                    limit = bookLimit;
                    break;
                }
            }
        }
    }


    let validRange = [];
    let date = new Date(start);
    while ((direction === 1 && date < limit) || (direction === -1 && date > limit)) {
        if (direction === 1)
            validRange.push(getISODate(date));
        else
            validRange.unshift(getISODate(date));
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
export function generateMarkedDates(isSelection: boolean, theme: CustomTheme, range: Array<string>) {
    let markedDates = {}
    for (let i = 0; i < range.length; i++) {
        const isStart = i === 0;
        const isEnd = i === range.length - 1;
        markedDates[range[i]] = {
            startingDay: isStart,
            endingDay: isEnd,
            color: isSelection
                ? isStart || isEnd
                    ? theme.colors.primary
                    : theme.colors.danger
                : theme.colors.textDisabled
        };
    }
    return markedDates;
}
