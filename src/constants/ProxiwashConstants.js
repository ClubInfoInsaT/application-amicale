export default {
    machineStates: {
        "AVAILABLE": 0,
        "RUNNING": 1,
        "RUNNING_NOT_STARTED": 2,
        "FINISHED": 3,
        "UNAVAILABLE": 4,
        "ERROR": 5,
        "UNKNOWN": 6,
    },
    stateIcons: {
        0: 'radiobox-blank',
        1: 'progress-check',
        2: 'alert-circle-outline',
        3: 'check-circle',
        4: 'alert-octagram-outline',
        5: 'alert',
        6: 'help-circle-outline',
    }
};
