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

// @flow

import type {ProxiwashMachineType} from '../screens/Proxiwash/ProxiwashScreen';

/**
 * Gets the machine end Date object.
 * If the end time is at least 12 hours before the current time,
 * it will be considered as happening the day after.
 * If it is before but less than 12 hours, it will be considered invalid (to fix proxiwash delay)
 *
 * @param machine The machine to get the date from
 * @returns {Date} The date object representing the end time.
 */
export function getMachineEndDate(machine: ProxiwashMachineType): Date | null {
  const array = machine.endTime.split(':');
  let endDate = new Date(Date.now());
  endDate.setHours(parseInt(array[0], 10), parseInt(array[1], 10));

  const limit = new Date(Date.now());
  if (endDate < limit) {
    if (limit.getHours() > 12) {
      limit.setHours(limit.getHours() - 12);
      if (endDate < limit) endDate.setDate(endDate.getDate() + 1);
      else endDate = null;
    } else endDate = null;
  }

  return endDate;
}

/**
 * Checks whether the machine of the given ID has scheduled notifications
 *
 * @param machine The machine to check
 * @param machinesWatched The machine list
 * @returns {boolean}
 */
export function isMachineWatched(
  machine: ProxiwashMachineType,
  machinesWatched: Array<ProxiwashMachineType>,
): boolean {
  let watched = false;
  machinesWatched.forEach((watchedMachine: ProxiwashMachineType) => {
    if (
      watchedMachine.number === machine.number &&
      watchedMachine.endTime === machine.endTime
    )
      watched = true;
  });
  return watched;
}

/**
 * Gets the machine of the given id
 *
 * @param id The machine's ID
 * @param allMachines The machine list
 * @returns {null|ProxiwashMachineType} The machine or null if not found
 */
export function getMachineOfId(
  id: string,
  allMachines: Array<ProxiwashMachineType>,
): ProxiwashMachineType | null {
  let machineFound = null;
  allMachines.forEach((machine: ProxiwashMachineType) => {
    if (machine.number === id) machineFound = machine;
  });
  return machineFound;
}

/**
 * Gets a cleaned machine watched list by removing invalid entries.
 * An entry is considered invalid if the end time in the watched list
 * and in the full list does not match (a new machine cycle started)
 *
 * @param machineWatchedList The current machine watch list
 * @param allMachines The current full machine list
 * @returns {Array<ProxiwashMachineType>}
 */
export function getCleanedMachineWatched(
  machineWatchedList: Array<ProxiwashMachineType>,
  allMachines: Array<ProxiwashMachineType>,
): Array<ProxiwashMachineType> {
  const newList = [];
  machineWatchedList.forEach((watchedMachine: ProxiwashMachineType) => {
    const machine = getMachineOfId(watchedMachine.number, allMachines);
    if (
      machine != null &&
      watchedMachine.number === machine.number &&
      watchedMachine.endTime === machine.endTime
    ) {
      newList.push(machine);
    }
  });
  return newList;
}
