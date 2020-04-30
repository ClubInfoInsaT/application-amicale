// @flow

import type {Machine} from "../screens/Proxiwash/ProxiwashScreen";

/**
 * Gets the machine end Date object.
 * If the time is before the current time, it will be considered as tomorrow
 *
 * @param machine The machine to get the date from
 * @returns {Date} The date object representing the end time.
 */
export function getMachineEndDate(machine: Machine) {
    const array = machine.endTime.split(":");
    let date = new Date(Date.now());
    date.setHours(parseInt(array[0]), parseInt(array[1]));
    if (date < new Date(Date.now()))
        date.setDate(date.getDate() + 1);
    return date;
}

/**
 * Checks whether the machine of the given ID has scheduled notifications
 *
 * @param machine The machine to check
 * @param machineList The machine list
 * @returns {boolean}
 */
export function isMachineWatched(machine: Machine, machineList: Array<Machine>) {
    let watched = false;
    for (let i = 0; i < machineList.length; i++) {
        if (machineList[i].number === machine.number && machineList[i].endTime === machine.endTime) {
            watched = true;
            break;
        }
    }
    return watched;
}

/**
 * Gets the machine of the given id
 *
 * @param id The machine's ID
 * @param allMachines The machine list
 * @returns {null|Machine} The machine or null if not found
 */
export function getMachineOfId(id: string, allMachines: Array<Machine>) {
    for (let i = 0; i < allMachines.length; i++) {
        if (allMachines[i].number === id)
            return allMachines[i];
    }
    return null;
}

/**
 * Gets a cleaned machine watched list by removing invalid entries.
 * An entry is considered invalid if the end time in the watched list
 * and in the full list does not match (a new machine cycle started)
 *
 * @param machineWatchedList The current machine watch list
 * @param allMachines The current full machine list
 * @returns {Array<Machine>}
 */
export function getCleanedMachineWatched(machineWatchedList: Array<Machine>, allMachines: Array<Machine>) {
    let newList = [];
    for (let i = 0; i < machineWatchedList.length; i++) {
        let machine = getMachineOfId(machineWatchedList[i].number, allMachines);
        if (machine !== null
            && machineWatchedList[i].number === machine.number
            && machineWatchedList[i].endTime === machine.endTime) {
            newList.push(machine);
        }
    }
    return newList;
}