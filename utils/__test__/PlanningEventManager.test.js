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

test('isEventDateStringFormatValid', () => {
    expect(PlanningEventManager.isEventDateStringFormatValid("2020-03-21 09:00")).toBeTrue();
    expect(PlanningEventManager.isEventDateStringFormatValid("3214-64-12 01:16")).toBeTrue();

    expect(PlanningEventManager.isEventDateStringFormatValid("3214-64-12 01:16:00")).toBeFalse();
    expect(PlanningEventManager.isEventDateStringFormatValid("3214-64-12 1:16")).toBeFalse();
    expect(PlanningEventManager.isEventDateStringFormatValid("3214-f4-12 01:16")).toBeFalse();
    expect(PlanningEventManager.isEventDateStringFormatValid("sqdd 09:00")).toBeFalse();
    expect(PlanningEventManager.isEventDateStringFormatValid("2020-03-21")).toBeFalse();
    expect(PlanningEventManager.isEventDateStringFormatValid("2020-03-21 truc")).toBeFalse();
    expect(PlanningEventManager.isEventDateStringFormatValid("3214-64-12 1:16:65")).toBeFalse();
    expect(PlanningEventManager.isEventDateStringFormatValid("garbage")).toBeFalse();
    expect(PlanningEventManager.isEventDateStringFormatValid("")).toBeFalse();
    expect(PlanningEventManager.isEventDateStringFormatValid(undefined)).toBeFalse();
    expect(PlanningEventManager.isEventDateStringFormatValid(null)).toBeFalse();
});

test('stringToDate', () => {
    let testDate = new Date();
    expect(PlanningEventManager.stringToDate(undefined)).toBeNull();
    expect(PlanningEventManager.stringToDate("")).toBeNull();
    expect(PlanningEventManager.stringToDate("garbage")).toBeNull();
    expect(PlanningEventManager.stringToDate("2020-03-21")).toBeNull();
    expect(PlanningEventManager.stringToDate("09:00:00")).toBeNull();
    expect(PlanningEventManager.stringToDate("2020-03-21 09:g0")).toBeNull();
    expect(PlanningEventManager.stringToDate("2020-03-21 09:g0:")).toBeNull();
    testDate.setFullYear(2020, 2, 21);
    testDate.setHours(9, 0, 0, 0);
    expect(PlanningEventManager.stringToDate("2020-03-21 09:00")).toEqual(testDate);
    testDate.setFullYear(2020, 0, 31);
    testDate.setHours(18, 30, 0, 0);
    expect(PlanningEventManager.stringToDate("2020-01-31 18:30")).toEqual(testDate);
    testDate.setFullYear(2020, 50, 50);
    testDate.setHours(65, 65, 0, 0);
    expect(PlanningEventManager.stringToDate("2020-51-50 65:65")).toEqual(testDate);
});

test('getFormattedEventTime', () => {
    expect(PlanningEventManager.getFormattedEventTime(null, null))
        .toBe('/ - /');
    expect(PlanningEventManager.getFormattedEventTime(undefined, undefined))
        .toBe('/ - /');
    expect(PlanningEventManager.getFormattedEventTime("20:30", "23:00"))
        .toBe('/ - /');
    expect(PlanningEventManager.getFormattedEventTime("2020-03-30", "2020-03-31"))
        .toBe('/ - /');


    expect(PlanningEventManager.getFormattedEventTime("2020-03-21 09:00", "2020-03-21 09:00"))
        .toBe('09:00');
    expect(PlanningEventManager.getFormattedEventTime("2020-03-21 09:00", "2020-03-22 17:00"))
        .toBe('09:00 - 23:59');
    expect(PlanningEventManager.getFormattedEventTime("2020-03-30 20:30", "2020-03-30 23:00"))
        .toBe('20:30 - 23:00');
});

test('getDateOnlyString', () => {
    expect(PlanningEventManager.getDateOnlyString("2020-03-21 09:00")).toBe("2020-03-21");
    expect(PlanningEventManager.getDateOnlyString("2021-12-15 09:00")).toBe("2021-12-15");
    expect(PlanningEventManager.getDateOnlyString("2021-12-o5 09:00")).toBeNull();
    expect(PlanningEventManager.getDateOnlyString("2021-12-15 09:")).toBeNull();
    expect(PlanningEventManager.getDateOnlyString("2021-12-15")).toBeNull();
    expect(PlanningEventManager.getDateOnlyString("garbage")).toBeNull();
});

test('isEventBefore', () => {
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 09:00", "2020-03-21 10:00")).toBeTrue();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:00", "2020-03-21 10:15")).toBeTrue();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:15", "2021-03-21 10:15")).toBeTrue();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:15", "2020-05-21 10:15")).toBeTrue();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:15", "2020-03-30 10:15")).toBeTrue();

    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:00", "2020-03-21 09:00")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-21 10:15", "2020-03-21 10:00")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        "2021-03-21 10:15", "2020-03-21 10:15")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        "2020-05-21 10:15", "2020-03-21 10:15")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        "2020-03-30 10:15", "2020-03-21 10:15")).toBeFalse();

    expect(PlanningEventManager.isEventBefore(
        "garbage", "2020-03-21 10:15")).toBeFalse();
    expect(PlanningEventManager.isEventBefore(
        undefined, undefined)).toBeFalse();
});

test('dateToString', () => {
    let testDate = new Date();
    testDate.setFullYear(2020, 2, 21);
    testDate.setHours(9, 0, 0, 0);
    expect(PlanningEventManager.dateToString(testDate)).toBe("2020-03-21 09:00");
    testDate.setFullYear(2021, 0, 12);
    testDate.setHours(9, 10, 0, 0);
    expect(PlanningEventManager.dateToString(testDate)).toBe("2021-01-12 09:10");
    testDate.setFullYear(2022, 11, 31);
    testDate.setHours(9, 10, 15, 0);
    expect(PlanningEventManager.dateToString(testDate)).toBe("2022-12-31 09:10");
});

test('generateEmptyCalendar', () => {

});

