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

import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import i18n from 'i18n-js';
import AsyncStorageManager from '../managers/AsyncStorageManager';

const PushNotification = require('react-native-push-notification');

// Used to multiply the normal notification id to create the reminder one. It allows to find it back easily
const reminderIdFactor = 100;

/**
 * Async function asking permission to send notifications to the user.
 * Used on ios.
 *
 * @returns {Promise<void>}
 */
export async function askPermissions(): Promise<void> {
  return new Promise((resolve: () => void, reject: () => void) => {
    checkNotifications().then(({status}: {status: string}) => {
      if (status === RESULTS.GRANTED) {
        resolve();
      } else if (status === RESULTS.BLOCKED) {
        reject();
      } else {
        requestNotifications([]).then((result: {status: string}) => {
          if (result.status === RESULTS.GRANTED) {
            resolve();
          } else {
            reject();
          }
        });
      }
    });
  });
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
  const reminder = AsyncStorageManager.getNumber(
    AsyncStorageManager.PREFERENCES.proxiwashNotifications.key,
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
      id: id.toString(),
      date: reminderDate,
    });
  }

  PushNotification.localNotificationSchedule({
    title: i18n.t('screens.proxiwash.notifications.machineFinishedTitle'),
    message: i18n.t('screens.proxiwash.notifications.machineFinishedBody', {
      number: machineID,
    }),
    id: machineID,
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
export async function setupMachineNotification(
  machineID: string,
  isEnabled: boolean,
  endDate: Date | null,
): Promise<void> {
  return new Promise((resolve: () => void, reject: () => void) => {
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
      const reminderId = reminderIdFactor * parseInt(machineID, 10);
      PushNotification.cancelLocalNotifications({id: reminderId.toString()});
      resolve();
    }
  });
}
