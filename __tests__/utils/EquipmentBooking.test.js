import React from 'react';
import * as EquipmentBooking from "../../src/utils/EquipmentBooking";
import i18n from "i18n-js";

test('getISODate', () => {
    let date = new Date("2020-03-05 12:00");
    expect(EquipmentBooking.getISODate(date)).toBe("2020-03-05");
    date = new Date("2020-03-05");
    expect(EquipmentBooking.getISODate(date)).toBe("2020-03-05");
    date = new Date("2020-03-05 00:00"); // Treated as local time
    expect(EquipmentBooking.getISODate(date)).toBe("2020-03-04"); // Treated as UTC
});

test('getCurrentDay', () => {
    jest.spyOn(Date, 'now')
        .mockImplementation(() =>
            new Date('2020-01-14 14:50:35').getTime()
        );
    expect(EquipmentBooking.getCurrentDay().getTime()).toBe(new Date("2020-01-14").getTime());
});

test('isEquipmentAvailable', () => {
    jest.spyOn(Date, 'now')
        .mockImplementation(() =>
            new Date('2020-07-09').getTime()
        );
    let testDevice = {
        id: 1,
        name: "Petit barbecue",
        caution: 100,
        booked_at: [{begin: "2020-07-07", end: "2020-07-10"}]
    };
    expect(EquipmentBooking.isEquipmentAvailable(testDevice)).toBeFalse();

    testDevice.booked_at = [{begin: "2020-07-07", end: "2020-07-09"}];
    expect(EquipmentBooking.isEquipmentAvailable(testDevice)).toBeFalse();

    testDevice.booked_at = [{begin: "2020-07-09", end: "2020-07-10"}];
    expect(EquipmentBooking.isEquipmentAvailable(testDevice)).toBeFalse();

    testDevice.booked_at = [
        {begin: "2020-07-07", end: "2020-07-8"},
        {begin: "2020-07-10", end: "2020-07-12"},
    ];
    expect(EquipmentBooking.isEquipmentAvailable(testDevice)).toBeTrue();
});

test('getFirstEquipmentAvailability', () => {
    jest.spyOn(Date, 'now')
        .mockImplementation(() =>
            new Date('2020-07-09').getTime()
        );
    let testDevice = {
        id: 1,
        name: "Petit barbecue",
        caution: 100,
        booked_at: [{begin: "2020-07-07", end: "2020-07-10"}]
    };
    expect(EquipmentBooking.getFirstEquipmentAvailability(testDevice).getTime()).toBe(new Date("2020-07-11").getTime());
    testDevice.booked_at = [{begin: "2020-07-07", end: "2020-07-09"}];
    expect(EquipmentBooking.getFirstEquipmentAvailability(testDevice).getTime()).toBe(new Date("2020-07-10").getTime());
    testDevice.booked_at = [
        {begin: "2020-07-07", end: "2020-07-09"},
        {begin: "2020-07-10", end: "2020-07-16"},
    ];
    expect(EquipmentBooking.getFirstEquipmentAvailability(testDevice).getTime()).toBe(new Date("2020-07-17").getTime());
    testDevice.booked_at = [
        {begin: "2020-07-07", end: "2020-07-09"},
        {begin: "2020-07-10", end: "2020-07-12"},
        {begin: "2020-07-14", end: "2020-07-16"},
    ];
    expect(EquipmentBooking.getFirstEquipmentAvailability(testDevice).getTime()).toBe(new Date("2020-07-13").getTime());
});

test('getRelativeDateString', () => {
    jest.spyOn(Date, 'now')
        .mockImplementation(() =>
            new Date('2020-07-09').getTime()
        );
    jest.spyOn(i18n, 't')
        .mockImplementation((translationString: string) => {
                const prefix = "equipmentScreen.";
                if (translationString === prefix + "otherYear")
                    return "0";
                else if (translationString === prefix + "otherMonth")
                    return "1";
                else if (translationString === prefix + "thisMonth")
                    return "2";
                else if (translationString === prefix + "tomorrow")
                    return "3";
                else if (translationString === prefix + "today")
                    return "4";
                else
                    return null;
            }
        );
    expect(EquipmentBooking.getRelativeDateString(new Date("2020-07-09"))).toBe("4");
    expect(EquipmentBooking.getRelativeDateString(new Date("2020-07-10"))).toBe("3");
    expect(EquipmentBooking.getRelativeDateString(new Date("2020-07-11"))).toBe("2");
    expect(EquipmentBooking.getRelativeDateString(new Date("2020-07-30"))).toBe("2");
    expect(EquipmentBooking.getRelativeDateString(new Date("2020-08-30"))).toBe("1");
    expect(EquipmentBooking.getRelativeDateString(new Date("2020-11-10"))).toBe("1");
    expect(EquipmentBooking.getRelativeDateString(new Date("2021-11-10"))).toBe("0");
});

test('getValidRange', () => {
    let testDevice = {
        id: 1,
        name: "Petit barbecue",
        caution: 100,
        booked_at: [{begin: "2020-07-07", end: "2020-07-10"}]
    };
    let start = new Date("2020-07-11");
    let end = new Date("2020-07-15");
    let result = [
        "2020-07-11",
        "2020-07-12",
        "2020-07-13",
        "2020-07-14",
        "2020-07-15",
    ];
    expect(EquipmentBooking.getValidRange(start, end, testDevice)).toStrictEqual(result);
    testDevice.booked_at = [
        {begin: "2020-07-07", end: "2020-07-10"},
        {begin: "2020-07-13", end: "2020-07-15"},
    ];
    result = [
        "2020-07-11",
        "2020-07-12",
    ];
    expect(EquipmentBooking.getValidRange(start, end, testDevice)).toStrictEqual(result);

    testDevice.booked_at = [{begin: "2020-07-12", end: "2020-07-13"}];
    result = ["2020-07-11"];
    expect(EquipmentBooking.getValidRange(start, end, testDevice)).toStrictEqual(result);
    testDevice.booked_at = [{begin: "2020-07-07", end: "2020-07-12"},];
    result = [
        "2020-07-13",
        "2020-07-14",
        "2020-07-15",
    ];
    expect(EquipmentBooking.getValidRange(end, start, testDevice)).toStrictEqual(result);
    start = new Date("2020-07-14");
    end = new Date("2020-07-14");
    result = [
        "2020-07-14",
    ];
    expect(EquipmentBooking.getValidRange(start, start, testDevice)).toStrictEqual(result);
    expect(EquipmentBooking.getValidRange(end, start, testDevice)).toStrictEqual(result);
    expect(EquipmentBooking.getValidRange(start, end, null)).toStrictEqual(result);

    start = new Date("2020-07-14");
    end = new Date("2020-07-17");
    result = [
        "2020-07-14",
        "2020-07-15",
        "2020-07-16",
        "2020-07-17",
    ];
    expect(EquipmentBooking.getValidRange(start, end, null)).toStrictEqual(result);

    testDevice.booked_at = [{begin: "2020-07-17", end: "2020-07-17"}];
    result = [
        "2020-07-14",
        "2020-07-15",
        "2020-07-16",
    ];
    expect(EquipmentBooking.getValidRange(start, end, testDevice)).toStrictEqual(result);

    testDevice.booked_at = [
        {begin: "2020-07-12", end: "2020-07-13"},
        {begin: "2020-07-15", end: "2020-07-20"},
    ];
    start = new Date("2020-07-11");
    end = new Date("2020-07-23");
    result = [
        "2020-07-21",
        "2020-07-22",
        "2020-07-23",
    ];
    expect(EquipmentBooking.getValidRange(end, start, testDevice)).toStrictEqual(result);
});

test('generateMarkedDates', () => {
    let theme = {
        colors: {
            primary: "primary",
            danger: "primary",
            textDisabled: "primary",
        }
    }
    let testDevice = {
        id: 1,
        name: "Petit barbecue",
        caution: 100,
        booked_at: [{begin: "2020-07-07", end: "2020-07-10"}]
    };
    let start = new Date("2020-07-11");
    let end = new Date("2020-07-13");
    let range = EquipmentBooking.getValidRange(start, end, testDevice);
    let result = {
        "2020-07-11": {
            startingDay: true,
            endingDay: false,
            color: theme.colors.primary
        },
        "2020-07-12": {
            startingDay: false,
            endingDay: false,
            color: theme.colors.danger
        },
        "2020-07-13": {
            startingDay: false,
            endingDay: true,
            color: theme.colors.primary
        },
    };
    expect(EquipmentBooking.generateMarkedDates(true, theme, range)).toStrictEqual(result);
    result = {
        "2020-07-11": {
            startingDay: true,
            endingDay: false,
            color: theme.colors.textDisabled
        },
        "2020-07-12": {
            startingDay: false,
            endingDay: false,
            color: theme.colors.textDisabled
        },
        "2020-07-13": {
            startingDay: false,
            endingDay: true,
            color: theme.colors.textDisabled
        },
    };
    expect(EquipmentBooking.generateMarkedDates(false, theme, range)).toStrictEqual(result);
    result = {
        "2020-07-11": {
            startingDay: true,
            endingDay: false,
            color: theme.colors.textDisabled
        },
        "2020-07-12": {
            startingDay: false,
            endingDay: false,
            color: theme.colors.textDisabled
        },
        "2020-07-13": {
            startingDay: false,
            endingDay: true,
            color: theme.colors.textDisabled
        },
    };
    range = EquipmentBooking.getValidRange(end, start, testDevice);
    expect(EquipmentBooking.generateMarkedDates(false, theme, range)).toStrictEqual(result);

    testDevice.booked_at = [{begin: "2020-07-13", end: "2020-07-15"},];
    result = {
        "2020-07-11": {
            startingDay: true,
            endingDay: false,
            color: theme.colors.primary
        },
        "2020-07-12": {
            startingDay: false,
            endingDay: true,
            color: theme.colors.primary
        },
    };
    range = EquipmentBooking.getValidRange(start, end, testDevice);
    expect(EquipmentBooking.generateMarkedDates(true, theme, range)).toStrictEqual(result);

    testDevice.booked_at = [{begin: "2020-07-12", end: "2020-07-13"},];
    result = {
        "2020-07-11": {
            startingDay: true,
            endingDay: true,
            color: theme.colors.primary
        },
    };
    range = EquipmentBooking.getValidRange(start, end, testDevice);
    expect(EquipmentBooking.generateMarkedDates(true, theme, range)).toStrictEqual(result);

    testDevice.booked_at = [
        {begin: "2020-07-12", end: "2020-07-13"},
        {begin: "2020-07-15", end: "2020-07-20"},
    ];
    start = new Date("2020-07-11");
    end = new Date("2020-07-23");
    result = {
        "2020-07-11": {
            startingDay: true,
            endingDay: true,
            color: theme.colors.primary
        },
    };
    range = EquipmentBooking.getValidRange(start, end, testDevice);
    expect(EquipmentBooking.generateMarkedDates(true, theme, range)).toStrictEqual(result);

    result = {
        "2020-07-21": {
            startingDay: true,
            endingDay: false,
            color: theme.colors.primary
        },
        "2020-07-22": {
            startingDay: false,
            endingDay: false,
            color: theme.colors.danger
        },
        "2020-07-23": {
            startingDay: false,
            endingDay: true,
            color: theme.colors.primary
        },
    };
    range = EquipmentBooking.getValidRange(end, start, testDevice);
    expect(EquipmentBooking.generateMarkedDates(true, theme, range)).toStrictEqual(result);
});
