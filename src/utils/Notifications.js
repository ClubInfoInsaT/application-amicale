// @flow

import {checkNotifications, requestNotifications, RESULTS} from 'react-native-permissions';

const PushNotification = require("react-native-push-notification");

/**
 * Async function asking permission to send notifications to the user
 *
 * @returns {Promise}
 */
export async function askPermissions() {
    return new Promise(((resolve, reject) => {
        checkNotifications().then(({status, settings}) => {
            if (status === RESULTS.GRANTED)
                resolve();
            else if (status === RESULTS.BLOCKED)
                reject()
            else {
                requestNotifications().then(({status, settings}) => {
                    if (status === RESULTS.GRANTED)
                        resolve();
                    else
                        reject();
                });
            }
        });
    }));
}

function createNotifications(machineID: string, date: Date) {
    PushNotification.localNotificationSchedule({
        title: "Title",
        message: "Message",
        id: machineID,
        date: date,
    });
}

/**
 * Asks the server to enable/disable notifications for the specified machine
 *
 * @param machineID The machine ID
 * @param isEnabled True to enable notifications, false to disable
 * @param endDate
 */
export async function setupMachineNotification(machineID: string, isEnabled: boolean, endDate?: Date) {
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
            resolve();
        }
    });
}