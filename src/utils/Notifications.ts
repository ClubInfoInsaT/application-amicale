/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import i18n from 'i18n-js';
import AsyncStorageManager from '../managers/AsyncStorageManager';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

// Used to multiply the normal notification id to create the reminder one. It allows to find it back easily
const reminderIdFactor = 100;

PushNotification.createChannel(
  {
    channelId: 'reminders', // (required)
    channelName: 'Reminders', // (required)
    channelDescription: 'Get laundry reminders', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: Platform.OS === 'ios',
});

/**
 * Creates a notification for the given machine id at the given date.
 *
 * This creates 2 notifications. One at the exact date, and one a few minutes before, according to user preference.
 *
 * @param machineID The machine id to schedule notifications for. This is used as id and in the notification string.
 * @param date The date to trigger the notification at
 */
function createNotifications(machineID: string, date: Date) {
  const reminder = AsyncStorageManager.getNumber(
    AsyncStorageManager.PREFERENCES.proxiwashNotifications.key
  );
  if (!Number.isNaN(reminder) && reminder > 0) {
    const id = reminderIdFactor * parseInt(machineID, 10);
    const reminderDate = new Date(date);
    reminderDate.setMinutes(reminderDate.getMinutes() - reminder);
    PushNotification.localNotificationSchedule({
      title: i18n.t('screens.proxiwash.notifications.machineRunningTitle', {
        time: reminder,
      }),
      message: i18n.t('screens.proxiwash.notifications.machineRunningBody', {
        number: machineID,
      }),
      id: id,
      date: reminderDate,
    });
  }

  PushNotification.localNotificationSchedule({
    title: i18n.t('screens.proxiwash.notifications.machineFinishedTitle'),
    message: i18n.t('screens.proxiwash.notifications.machineFinishedBody', {
      number: machineID,
    }),
    id: parseInt(machineID, 10),
    date,
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
export function setupMachineNotification(
  machineID: string,
  isEnabled: boolean,
  endDate?: Date | null
) {
  if (isEnabled && endDate) {
    createNotifications(machineID, endDate);
  } else {
    PushNotification.cancelLocalNotifications({ id: machineID });
    const reminderId = reminderIdFactor * parseInt(machineID, 10);
    PushNotification.cancelLocalNotifications({ id: reminderId.toString() });
  }
}
