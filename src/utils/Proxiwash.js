// @flow

import type {Machine} from "../screens/Proxiwash/ProxiwashScreen";
import ProxiwashConstants from "../constants/ProxiwashConstants";

export function getMachineEndDate(machine: Machine) {
    const array = machine.endTime.split(":");
    let date = new Date();
    date.setHours(parseInt(array[0]), parseInt(array[1]));
    if (date < new Date())
        date.setDate(date.getDate() + 1);
    return date;
}

/**
 * Checks whether the machine of the given ID has scheduled notifications
 *
 * @param machine
 * @param machineList
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

function getMachineOfId(id: string, allMachines: Array<Machine>) {
    for (let i = 0; i < allMachines.length; i++) {
        if (allMachines[i].number === id)
            return allMachines[i];
    }
    return null;
}

export function getCleanedMachineWatched(machineList: Array<Machine>, allMachines: Array<Machine>) {
    let newList = [];
    for (let i = 0; i < machineList.length; i++) {
        let machine = getMachineOfId(machineList[i].number, allMachines);
        if (machine !== null
            && machineList[i].number === machine.number && machineList[i].endTime === machine.endTime
            && ProxiwashConstants.machineStates[machineList[i].state] === ProxiwashConstants.machineStates["EN COURS"]) {
            newList.push(machine);
        }
    }
    return newList;
}