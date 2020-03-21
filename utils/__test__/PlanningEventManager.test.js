import React from 'react';
import PlanningEventManager from "../PlanningEventManager";

test('isDescriptionEmpty', () => {
    expect(PlanningEventManager.isDescriptionEmpty("")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("   ")).toBeTrue();
    // noinspection CheckTagEmptyBody
    expect(PlanningEventManager.isDescriptionEmpty("<p></p>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p>   </p>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p><br></p>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p><br></p><p><br></p>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p><br><br><br></p>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p><br>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty(null)).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty(undefined)).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("coucou")).toBeFalse();
    expect(PlanningEventManager.isDescriptionEmpty("<p>coucou</p>")).toBeFalse();
});

test('toPaddedString', () => {
    expect(PlanningEventManager.toPaddedString(-1)).toBe("-1");
    expect(PlanningEventManager.toPaddedString(0)).toBe("00");
    expect(PlanningEventManager.toPaddedString(1)).toBe("01");
    expect(PlanningEventManager.toPaddedString(2)).toBe("02");
    expect(PlanningEventManager.toPaddedString(10)).toBe("10");
    expect(PlanningEventManager.toPaddedString(53)).toBe("53");
    expect(PlanningEventManager.toPaddedString(100)).toBe("100");
});

test('isDateStringFormatValid', () => {
    expect(PlanningEventManager.isDateStringFormatValid("2020-03-21 09:00:00")).toBeTrue();
    expect(PlanningEventManager.isDateStringFormatValid("3214-64-12 01:16:65")).toBeTrue();

    expect(PlanningEventManager.isDateStringFormatValid("3214-64-12 1:16:65")).toBeFalse();
    expect(PlanningEventManager.isDateStringFormatValid("3214-f4-12 01:16:65")).toBeFalse();
    expect(PlanningEventManager.isDateStringFormatValid("sqdd 09:00:00")).toBeFalse();
    expect(PlanningEventManager.isDateStringFormatValid("2020-03-21")).toBeFalse();
    expect(PlanningEventManager.isDateStringFormatValid("2020-03-21 truc")).toBeFalse();
    expect(PlanningEventManager.isDateStringFormatValid("3214-64-12 1:16:65")).toBeFalse();
    expect(PlanningEventManager.isDateStringFormatValid("garbage")).toBeFalse();
    expect(PlanningEventManager.isDateStringFormatValid("")).toBeFalse();
    expect(PlanningEventManager.isDateStringFormatValid(undefined)).toBeFalse();
    expect(PlanningEventManager.isDateStringFormatValid(null)).toBeFalse();
});

test('stringToDate', () => {
    let testDate = new Date();
    expect(PlanningEventManager.stringToDate(undefined)).toBeUndefined();
    expect(PlanningEventManager.stringToDate("")).toBeUndefined();
    expect(PlanningEventManager.stringToDate("garbage")).toBeUndefined();
    expect(PlanningEventManager.stringToDate("2020-03-21")).toBeUndefined();
    expect(PlanningEventManager.stringToDate("09:00:00")).toBeUndefined();
    expect(PlanningEventManager.stringToDate("2020-03-21 09:g0:00")).toBeUndefined();
    expect(PlanningEventManager.stringToDate("2020-03-21 09:g0:")).toBeUndefined();
    testDate.setFullYear(2020, 2, 21);
    testDate.setHours(9, 0, 0, 0);
    expect(PlanningEventManager.stringToDate("2020-03-21 09:00:00")).toEqual(testDate);
    testDate.setFullYear(2020, 0, 31);
    testDate.setHours(18, 30, 50, 0);
    expect(PlanningEventManager.stringToDate("2020-01-31 18:30:50")).toEqual(testDate);
    testDate.setFullYear(2020, 50, 50);
    testDate.setHours(65, 65, 65, 0);
    expect(PlanningEventManager.stringToDate("2020-51-50 65:65:65")).toEqual(testDate);
});

test('getFormattedEventTime', () => {
    expect(PlanningEventManager.getFormattedEventTime(null, null))
        .toBe('/ - /');
    expect(PlanningEventManager.getFormattedEventTime(undefined, undefined))
        .toBe('/ - /');
    expect(PlanningEventManager.getFormattedEventTime("20:30:00", "23:00:00"))
        .toBe('/ - /');
    expect(PlanningEventManager.getFormattedEventTime("2020-03-30", "2020-03-31"))
        .toBe('/ - /');


    expect(PlanningEventManager.getFormattedEventTime("2020-03-21 09:00:00", "2020-03-21 09:00:00"))
        .toBe('09:00');
    expect(PlanningEventManager.getFormattedEventTime("2020-03-21 09:00:00", "2020-03-22 17:00:00"))
        .toBe('09:00 - 00:00');
    expect(PlanningEventManager.getFormattedEventTime("2020-03-30 20:30:00", "2020-03-30 23:00:00"))
        .toBe('20:30 - 23:00');
});

test('getDateOnlyString', () => {
    expect(PlanningEventManager.getDateOnlyString("2020-03-21 09:00:00")).toBe("2020-03-21");
    expect(PlanningEventManager.getDateOnlyString("2021-12-15 09:00:00")).toBe("2021-12-15");
    expect(PlanningEventManager.getDateOnlyString("2021-12-o5 09:00:00")).toBeUndefined();
    expect(PlanningEventManager.getDateOnlyString("2021-12-15 09:")).toBeUndefined();
    expect(PlanningEventManager.getDateOnlyString("2021-12-15")).toBeUndefined();
    expect(PlanningEventManager.getDateOnlyString("garbage")).toBeUndefined();
});

test('isEventBefore', () => {
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 09:00:00", "2020-03-21 10:00:00")).toBeTrue();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:00:00", "2020-03-21 10:15:00")).toBeTrue();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:15:05", "2020-03-21 10:15:54")).toBeTrue();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:15:05", "2021-03-21 10:15:05")).toBeTrue();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:15:05", "2020-05-21 10:15:05")).toBeTrue();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:15:05", "2020-03-30 10:15:05")).toBeTrue();

    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:00:00", "2020-03-21 09:00:00")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:15:00", "2020-03-21 10:00:00")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:15:54", "2020-03-21 10:15:05")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        "2021-03-21 10:15:05", "2020-03-21 10:15:05")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        "2020-05-21 10:15:05", "2020-03-21 10:15:05")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-30 10:15:05", "2020-03-21 10:15:05")).toBeFalse();

    expect(PlanningEventManager.isEventBefore(
        "garbage", "2020-03-21 10:15:05")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        undefined, undefined)).toBeFalse();
});

