// @flow

import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

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
     * Async function sending a notification without delay to the user
     *
     * @param title {String} Notification title
     * @param body {String} Notification body text
     * @returns {Promise<import("react").ReactText>} Notification Id
     */
    static async sendNotificationImmediately (title: string, body: string) {
        await NotificationsManager.askPermissions();
        return await Notifications.presentLocalNotificationAsync({
            title: title,
            body: body,
        });
    };

    /**
     * Async function sending notification at the specified time
     *
     * @param title Notification title
     * @param body Notification body text
     * @param time Time at which we should send the notification
     * @returns {Promise<import("react").ReactText>} Notification Id
     */
    static async scheduleNotification(title: string, body: string, time: number): Promise<string> {
        await NotificationsManager.askPermissions();
        return Notifications.scheduleLocalNotificationAsync(
            {
                title: title,
                body: body,
            },
            {
                time: time,
            },
        );
    };

    /**
     * Async function used to cancel the notification of a specific ID
     * @param notificationID {Number} The notification ID
     * @returns {Promise}
     */
    static async cancelScheduledNotification(notificationID: number) {
        await Notifications.cancelScheduledNotificationAsync(notificationID);
    }
}
