// @flow

import * as Permissions from 'expo-permissions';
import {Notifications} from 'expo';
import AsyncStorageManager from "./AsyncStorageManager";
import LocaleManager from "./LocaleManager";
import passwords from "../passwords";

const EXPO_TOKEN_SERVER = 'https://etud.insa-toulouse.fr/~amicale_app/expo_notifications/save_token.php';

/**
 * Static class used to manage notifications sent to the user
 */
export default class NotificationsManager {

    /**
     * Async function asking permission to send notifications to the user
     *
     * @returns {Promise}
     */
    static async askPermissions() {
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
    static async initExpoToken() {
        let token = AsyncStorageManager.getInstance().preferences.expoToken.current;
        if (token === '') {
            try {
                await NotificationsManager.askPermissions();
                let expoToken = await Notifications.getExpoPushTokenAsync();
                // Save token for instant use later on
                AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.expoToken.key, expoToken);
            } catch(e) {
                console.log(e);
            }
        }
    }

    static getMachineNotificationWatchlist(callback: Function) {
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
     * Ask the server to enable/disable notifications for the specified machine
     *
     * @param machineID
     * @param isEnabled
     */
    static setupMachineNotification(machineID: string, isEnabled: boolean) {
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
     * Send the selected reminder time for notifications to the server
     * @param time
     */
    static setMachineReminderNotificationTime(time: number) {
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
}
