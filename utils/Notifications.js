// @flow

import * as Permissions from 'expo-permissions';
import {Notifications} from 'expo';
import AsyncStorageManager from "../managers/AsyncStorageManager";
import LocaleManager from "../managers/LocaleManager";
import passwords from "../passwords";

const EXPO_TOKEN_SERVER = 'https://etud.insa-toulouse.fr/~amicale_app/expo_notifications/save_token.php';

/**
 * Async function asking permission to send notifications to the user
 *
 * @returns {Promise}
 */
export async function askPermissions() {
    const {status: existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }
    return finalStatus === 'granted';
}

/**
 * Save expo token to allow sending notifications to this device.
 * This token is unique for each device and won't change.
 * It only needs to be fetched once, then it will be saved in storage.
 *
 * @return {Promise<void>}
 */
export async function initExpoToken() {
    let token = AsyncStorageManager.getInstance().preferences.expoToken.current;
    if (token === '') {
        try {
            await askPermissions();
            let expoToken = await Notifications.getExpoPushTokenAsync();
            // Save token for instant use later on
            AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.expoToken.key, expoToken);
        } catch (e) {
            console.log(e);
        }
    }
}

/**
 * Gets the machines watched from the server
 *
 * @param callback Function to execute with the fetched data
 */
export function getMachineNotificationWatchlist(callback: Function) {
    let token = AsyncStorageManager.getInstance().preferences.expoToken.current;
    if (token !== '') {
        let data = {
            function: 'get_machine_watchlist',
            password: passwords.expoNotifications,
            token: token,
        };
        fetch(EXPO_TOKEN_SERVER, {
            method: 'POST',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data) // <-- Post parameters
        }).then((response) => response.json())
            .then((responseJson) => {
                callback(responseJson);
            });
    }
}

/**
 * Asks the server to enable/disable notifications for the specified machine
 *
 * @param machineID The machine ID
 * @param isEnabled True to enable notifications, false to disable
 */
export function setupMachineNotification(machineID: string, isEnabled: boolean) {
    let token = AsyncStorageManager.getInstance().preferences.expoToken.current;
    if (token !== '') {
        let data = {
            function: 'setup_machine_notification',
            password: passwords.expoNotifications,
            locale: LocaleManager.getCurrentLocale(),
            token: token,
            machine_id: machineID,
            enabled: isEnabled
        };
        fetch(EXPO_TOKEN_SERVER, {
            method: 'POST',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data) // <-- Post parameters
        });
    }
}

/**
 * Sends the selected reminder time for notifications to the server
 *
 * @param time The reminder time to use
 */
export function setMachineReminderNotificationTime(time: number) {
    let token = AsyncStorageManager.getInstance().preferences.expoToken.current;
    if (token !== '') {
        let data = {
            function: 'set_machine_reminder',
            password: passwords.expoNotifications,
            token: token,
            time: time,
        };
        fetch(EXPO_TOKEN_SERVER, {
            method: 'POST',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data) // <-- Post parameters
        });
    }
}
