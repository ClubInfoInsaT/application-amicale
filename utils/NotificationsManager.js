import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

export default class NotificationsManager {

    static async askPermissions() {
        const {status: existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        return finalStatus === 'granted';
    }

    static async sendNotificationImmediately (title, body) {
        await NotificationsManager.askPermissions();
        return await Notifications.presentLocalNotificationAsync({
            title: title,
            body: body,
        });
    };

    static async scheduleNotification(title, body, time) {
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

    static async cancelScheduledNoification(notifID) {
        await Notifications.cancelScheduledNotificationAsync(notifID);
    }
}
