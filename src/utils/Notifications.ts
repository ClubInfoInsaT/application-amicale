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
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {
  Importance,
  PushNotificationObject,
} from 'react-native-push-notification';
import { Platform } from 'react-native';
import Update from '../constants/Update';

// Used to multiply the normal notification id to create the reminder one. It allows to find it back easily
const reminderIdFactor = 100;
// Allows the channel to be updated when the app updates
const channelIds = {
  laundry: 'reminders' + Update.number,
  amicale: 'amicale' + Update.number,
};

/**
 * Clean channels before creating a new one
 */
function cleanChannels() {
  PushNotification.getChannels((idList) => {
    idList.forEach((i) => {
      if (!Object.values(channelIds).includes(i)) {
        PushNotification.deleteChannel(i);
      }
    });
  });
}

/**
 * Create Laundry notifications channel if it doesn't exist
 */
function ensureLaundryChannel() {
  PushNotification.channelExists(channelIds.laundry, (exists) => {
    if (!exists) {
      PushNotification.createChannel(
        {
          channelId: channelIds.laundry, // (required)
          channelName: i18n.t('screens.proxiwash.notifications.channel.title'), // (required)
          channelDescription: i18n.t(
            'screens.proxiwash.notifications.channel.description'
          ), // (optional) default: undefined.
          playSound: true, // (optional) default: true
          soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) =>
          console.log(
            `createChannel returned '${created}' for channel '${channelIds.laundry}'`
          ) // (optional) callback returns whether the channel was created, false means it already existed.
      );
    }
  });
}

/**
 * Create Amicale Push notifications channel if it doesn't exist
 */
function ensureAmicaleChannel() {
  PushNotification.channelExists(channelIds.laundry, (exists) => {
    if (!exists) {
      PushNotification.createChannel(
        {
          channelId: channelIds.amicale,
          channelName: i18n.t(
            'screens.amicaleAbout.notifications.channel.title'
          ),
          channelDescription: i18n.t(
            'screens.amicaleAbout.notifications.channel.description'
          ),
          playSound: true,
          soundName: 'default',
          importance: Importance.HIGH,
          vibrate: true,
        },
        (created) =>
          console.log(
            `createChannel returned '${created}' for channel '${channelIds.amicale}'`
          )
      );
    }
  });
}

export function setupNotifications() {
  cleanChannels();
  ensureLaundryChannel();
  ensureAmicaleChannel();

  PushNotification.subscribeToTopic('amicale');

  PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);

      // process the notification

      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('TOKEN:', token);
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
}

const DEFAULT_NOTIFICATIONS_OPTIONS: Partial<PushNotificationObject> = {
  /* Android Only Properties */
  channelId: channelIds.laundry, // (required) channelId, if the channel doesn't exist, notification will not trigger.
  showWhen: true, // (optional) default: true
  autoCancel: true, // (optional) default: true
  vibrate: true, // (optional) default: true
  vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  priority: 'high', // (optional) set notification priority, default: high
  visibility: 'public', // (optional) set notification visibility, default: private
  ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
  onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false

  when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
  usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
  timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

  invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

  /* iOS and Android properties */
  playSound: true, // (optional) default: true
  soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
};

/**
 * Creates a notification for the given machine id at the given date.
 *
 * This creates 2 notifications. One at the exact date, and one a few minutes before, according to user preference.
 *
 * @param machineID The machine id to schedule notifications for. This is used as id and in the notification string.
 * @param date The date to trigger the notification at
 */
function createNotifications(machineID: string, date: Date, reminder?: number) {
  if (reminder && !Number.isNaN(reminder) && reminder > 0) {
    const id = reminderIdFactor * parseInt(machineID, 10);
    const reminderDate = new Date(date);
    reminderDate.setMinutes(reminderDate.getMinutes() - reminder);
    PushNotification.localNotificationSchedule({
      ...DEFAULT_NOTIFICATIONS_OPTIONS,
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
    ...DEFAULT_NOTIFICATIONS_OPTIONS,
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
  reminder?: number,
  endDate?: Date | null
) {
  if (isEnabled && endDate) {
    createNotifications(machineID, endDate, reminder);
  } else {
    PushNotification.cancelLocalNotification(machineID);
    const reminderId = reminderIdFactor * parseInt(machineID, 10);
    PushNotification.cancelLocalNotification(reminderId.toString());
  }
}
