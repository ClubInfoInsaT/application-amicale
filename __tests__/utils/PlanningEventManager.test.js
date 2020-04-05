import React from 'react';
import * as Planning from "../../src/utils/Planning";

test('isDescriptionEmpty', () => {
    expect(Planning.isDescriptionEmpty("")).toBeTrue();
    expect(Planning.isDescriptionEmpty("   ")).toBeTrue();
    // noinspection CheckTagEmptyBody
    expect(Planning.isDescriptionEmpty("<p></p>")).toBeTrue();
    expect(Planning.isDescriptionEmpty("<p>   </p>")).toBeTrue();
    expect(Planning.isDescriptionEmpty("<p><br></p>")).toBeTrue();
    expect(Planning.isDescriptionEmpty("<p><br></p><p><br></p>")).toBeTrue();
    expect(Planning.isDescriptionEmpty("<p><br><br><br></p>")).toBeTrue();
    expect(Planning.isDescriptionEmpty("<p><br>")).toBeTrue();
    expect(Planning.isDescriptionEmpty(null)).toBeTrue();
    expect(Planning.isDescriptionEmpty(undefined)).toBeTrue();
    expect(Planning.isDescriptionEmpty("coucou")).toBeFalse();
    expect(Planning.isDescriptionEmpty("<p>coucou</p>")).toBeFalse();
});

test('isEventDateStringFormatValid', () => {
    expect(Planning.isEventDateStringFormatValid("2020-03-21 09:00")).toBeTrue();
    expect(Planning.isEventDateStringFormatValid("3214-64-12 01:16")).toBeTrue();

    expect(Planning.isEventDateStringFormatValid("3214-64-12 01:16:00")).toBeFalse();
    expect(Planning.isEventDateStringFormatValid("3214-64-12 1:16")).toBeFalse();
    expect(Planning.isEventDateStringFormatValid("3214-f4-12 01:16")).toBeFalse();
    expect(Planning.isEventDateStringFormatValid("sqdd 09:00")).toBeFalse();
    expect(Planning.isEventDateStringFormatValid("2020-03-21")).toBeFalse();
    expect(Planning.isEventDateStringFormatValid("2020-03-21 truc")).toBeFalse();
    expect(Planning.isEventDateStringFormatValid("3214-64-12 1:16:65")).toBeFalse();
    expect(Planning.isEventDateStringFormatValid("garbage")).toBeFalse();
    expect(Planning.isEventDateStringFormatValid("")).toBeFalse();
    expect(Planning.isEventDateStringFormatValid(undefined)).toBeFalse();
    expect(Planning.isEventDateStringFormatValid(null)).toBeFalse();
});

test('stringToDate', () => {
    let testDate = new Date();
    expect(Planning.stringToDate(undefined)).toBeNull();
    expect(Planning.stringToDate("")).toBeNull();
    expect(Planning.stringToDate("garbage")).toBeNull();
    expect(Planning.stringToDate("2020-03-21")).toBeNull();
    expect(Planning.stringToDate("09:00:00")).toBeNull();
    expect(Planning.stringToDate("2020-03-21 09:g0")).toBeNull();
    expect(Planning.stringToDate("2020-03-21 09:g0:")).toBeNull();
    testDate.setFullYear(2020, 2, 21);
    testDate.setHours(9, 0, 0, 0);
    expect(Planning.stringToDate("2020-03-21 09:00")).toEqual(testDate);
    testDate.setFullYear(2020, 0, 31);
    testDate.setHours(18, 30, 0, 0);
    expect(Planning.stringToDate("2020-01-31 18:30")).toEqual(testDate);
    testDate.setFullYear(2020, 50, 50);
    testDate.setHours(65, 65, 0, 0);
    expect(Planning.stringToDate("2020-51-50 65:65")).toEqual(testDate);
});

test('getFormattedEventTime', () => {
    expect(Planning.getFormattedEventTime(null, null))
        .toBe('/ - /');
    expect(Planning.getFormattedEventTime(undefined, undefined))
        .toBe('/ - /');
    expect(Planning.getFormattedEventTime("20:30", "23:00"))
        .toBe('/ - /');
    expect(Planning.getFormattedEventTime("2020-03-30", "2020-03-31"))
        .toBe('/ - /');


    expect(Planning.getFormattedEventTime("2020-03-21 09:00", "2020-03-21 09:00"))
        .toBe('09:00');
    expect(Planning.getFormattedEventTime("2020-03-21 09:00", "2020-03-22 17:00"))
        .toBe('09:00 - 23:59');
    expect(Planning.getFormattedEventTime("2020-03-30 20:30", "2020-03-30 23:00"))
        .toBe('20:30 - 23:00');
});

test('getDateOnlyString', () => {
    expect(Planning.getDateOnlyString("2020-03-21 09:00")).toBe("2020-03-21");
    expect(Planning.getDateOnlyString("2021-12-15 09:00")).toBe("2021-12-15");
    expect(Planning.getDateOnlyString("2021-12-o5 09:00")).toBeNull();
    expect(Planning.getDateOnlyString("2021-12-15 09:")).toBeNull();
    expect(Planning.getDateOnlyString("2021-12-15")).toBeNull();
    expect(Planning.getDateOnlyString("garbage")).toBeNull();
});

test('isEventBefore', () => {
    expect(Planning.isEventBefore(
        "2020-03-21 09:00", "2020-03-21 10:00")).toBeTrue();
    expect(Planning.isEventBefore(
        "2020-03-21 10:00", "2020-03-21 10:15")).toBeTrue();
    expect(Planning.isEventBefore(
        "2020-03-21 10:15", "2021-03-21 10:15")).toBeTrue();
    expect(Planning.isEventBefore(
        "2020-03-21 10:15", "2020-05-21 10:15")).toBeTrue();
    expect(Planning.isEventBefore(
        "2020-03-21 10:15", "2020-03-30 10:15")).toBeTrue();

    expect(Planning.isEventBefore(
        "2020-03-21 10:00", "2020-03-21 10:00")).toBeFalse();
    expect(Planning.isEventBefore(
        "2020-03-21 10:00", "2020-03-21 09:00")).toBeFalse();
    expect(Planning.isEventBefore(
        "2020-03-21 10:15", "2020-03-21 10:00")).toBeFalse();
    expect(Planning.isEventBefore(
        "2021-03-21 10:15", "2020-03-21 10:15")).toBeFalse();
    expect(Planning.isEventBefore(
        "2020-05-21 10:15", "2020-03-21 10:15")).toBeFalse();
    expect(Planning.isEventBefore(
        "2020-03-30 10:15", "2020-03-21 10:15")).toBeFalse();

    expect(Planning.isEventBefore(
        "garbage", "2020-03-21 10:15")).toBeFalse();
    expect(Planning.isEventBefore(
        undefined, undefined)).toBeFalse();
});

test('dateToString', () => {
    let testDate = new Date();
    testDate.setFullYear(2020, 2, 21);
    testDate.setHours(9, 0, 0, 0);
    expect(Planning.dateToString(testDate)).toBe("2020-03-21 09:00");
    testDate.setFullYear(2021, 0, 12);
    testDate.setHours(9, 10, 0, 0);
    expect(Planning.dateToString(testDate)).toBe("2021-01-12 09:10");
    testDate.setFullYear(2022, 11, 31);
    testDate.setHours(9, 10, 15, 0);
    expect(Planning.dateToString(testDate)).toBe("2022-12-31 09:10");
});

test('generateEmptyCalendar', () => {
    jest.spyOn(Date, 'now')
        .mockImplementation(() =>
            new Date('2020-01-14T00:00:00.000Z').getTime()
        );
    let calendar = Planning.generateEmptyCalendar(1);
    expect(calendar).toHaveProperty("2020-01-14");
    expect(calendar).toHaveProperty("2020-01-20");
    expect(calendar).toHaveProperty("2020-02-10");
    expect(Object.keys(calendar).length).toBe(32);
    calendar = Planning.generateEmptyCalendar(3);
    expect(calendar).toHaveProperty("2020-01-14");
    expect(calendar).toHaveProperty("2020-01-20");
    expect(calendar).toHaveProperty("2020-02-10");
    expect(calendar).toHaveProperty("2020-02-14");
    expect(calendar).toHaveProperty("2020-03-20");
    expect(calendar).toHaveProperty("2020-04-12");
    expect(Object.keys(calendar).length).toBe(92);
});

test('pushEventInOrder', () => {
    let eventArray = [];
    let event1 = {date_begin: "2020-01-14 09:15"};
    Planning.pushEventInOrder(eventArray, event1);
    expect(eventArray.length).toBe(1);
    expect(eventArray[0]).toBe(event1);

    let event2 = {date_begin: "2020-01-14 10:15"};
    Planning.pushEventInOrder(eventArray, event2);
    expect(eventArray.length).toBe(2);
    expect(eventArray[0]).toBe(event1);
    expect(eventArray[1]).toBe(event2);

    let event3 = {date_begin: "2020-01-14 10:15", title: "garbage"};
    Planning.pushEventInOrder(eventArray, event3);
    expect(eventArray.length).toBe(3);
    expect(eventArray[0]).toBe(event1);
    expect(eventArray[1]).toBe(event2);
    expect(eventArray[2]).toBe(event3);

    let event4 = {date_begin: "2020-01-13 09:00"};
    Planning.pushEventInOrder(eventArray, event4);
    expect(eventArray.length).toBe(4);
    expect(eventArray[0]).toBe(event4);
    expect(eventArray[1]).toBe(event1);
    expect(eventArray[2]).toBe(event2);
    expect(eventArray[3]).toBe(event3);
});

test('generateEventAgenda', () => {
    jest.spyOn(Date, 'now')
        .mockImplementation(() =>
            new Date('2020-01-14T00:00:00.000Z').getTime()
        );
    let eventList = [
        {date_begin: "2020-01-14 09:15"},
        {date_begin: "2020-02-01 09:15"},
        {date_begin: "2020-01-15 09:15"},
        {date_begin: "2020-02-01 09:30"},
        {date_begin: "2020-02-01 08:30"},
    ];
    const calendar = Planning.generateEventAgenda(eventList, 2);
    expect(calendar["2020-01-14"].length).toBe(1);
    expect(calendar["2020-01-14"][0]).toBe(eventList[0]);
    expect(calendar["2020-01-15"].length).toBe(1);
    expect(calendar["2020-01-15"][0]).toBe(eventList[2]);
    expect(calendar["2020-02-01"].length).toBe(3);
    expect(calendar["2020-02-01"][0]).toBe(eventList[4]);
    expect(calendar["2020-02-01"][1]).toBe(eventList[1]);
    expect(calendar["2020-02-01"][2]).toBe(eventList[3]);
});

test('getCurrentDateString', () => {
    jest.spyOn(Date, 'now')
        .mockImplementation(() => {
            let date = new Date();
            date.setFullYear(2020, 0, 14);
            date.setHours(15, 30, 54, 65);
            return date.getTime();
        });
    expect(Planning.getCurrentDateString()).toBe('2020-01-14 15:30');
});
