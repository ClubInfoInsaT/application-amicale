// @flow

import {checkNotifications, requestNotifications, RESULTS} from 'react-native-permissions';
import AsyncStorageManager from "../managers/AsyncStorageManager";
import i18n from "i18n-js";

const PushNotification = require("react-native-push-notification");

// Used to multiply the normal notification id to create the reminder one. It allows to find it back easily
const reminderIdFactor = 100;

/**
 * Async function asking permission to send notifications to the user.
 * Used on ios.
 *
 * @returns {Promise}
 */
export async function askPermissions() {
    return new Promise(((resolve, reject) => {
        checkNotifications().then(({status}) => {
            if (status === RESULTS.GRANTED)
                resolve();
            else if (status === RESULTS.BLOCKED)
                reject()
            else {
                requestNotifications().then(({status}) => {
                    if (status === RESULTS.GRANTED)
                        resolve();
                    else
                        reject();
                });
            }
        });
    }));
}

/**
 * Creates a notification for the given machine id at the given date.
 *
 * This creates 2 notifications. One at the exact date, and one a few minutes before, according to user preference.
 *
 * @param machineID The machine id to schedule notifications for. This is used as id and in the notification string.
 * @param date The date to trigger the notification at
 */
function createNotifications(machineID: string, date: Date) {
    let reminder = parseInt(AsyncStorageManager.getInstance().preferences.proxiwashNotifications.current);
    if (!isNaN(reminder) && reminder > 0) {
        let id = reminderIdFactor * parseInt(machineID);
        let reminderDate = new Date(date);
        reminderDate.setMinutes(reminderDate.getMinutes() - reminder);
        PushNotification.localNotificationSchedule({
            title: i18n.t("proxiwashScreen.notifications.machineRunningTitle", {time: reminder}),
            message: i18n.t("proxiwashScreen.notifications.machineRunningBody", {number: machineID}),
            id: id.toString(),
            date: reminderDate,
        });
        console.log("Setting up notifications for ", date, " and reminder for ", reminderDate);
    } else
        console.log("Setting up notifications for ", date);

    PushNotification.localNotificationSchedule({
        title: i18n.t("proxiwashScreen.notifications.machineFinishedTitle"),
        message: i18n.t("proxiwashScreen.notifications.machineFinishedBody", {number: machineID}),
        id: machineID,
        date: date,
    });
}

/**
 * Enables or disables notifications for the given machine.
 *
 * The function is async as we need to ask user permissions.
 * If user denies, the promise will be rejected, otherwise it will succeed.
 *
 * @param machineID The machine ID to setup notifications for
 * @param isEnabled True to enable notifications, false to disable
 * @param endDate The trigger date, or null if disabling notifications
 */
export async function setupMachineNotification(machineID: string, isEnabled: boolean, endDate: Date | null) {
    return new Promise((resolve, reject) => {
        if (isEnabled && endDate != null) {
            askPermissions()
                .then(() => {
                    createNotifications(machineID, endDate);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        } else {
            PushNotification.cancelLocalNotifications({id: machineID});
            let reminderId = reminderIdFactor * parseInt(machineID);
            PushNotification.cancelLocalNotifications({id: reminderId.toString()});
            resolve();
        }
    });
}
