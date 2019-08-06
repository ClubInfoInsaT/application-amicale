// @flow

import * as React from 'react';
import {Alert, Platform, View} from 'react-native';
import {Body, Card, CardItem, Left, Right, Text} from 'native-base';
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import FetchedDataSectionList from "../components/FetchedDataSectionList";
import NotificationsManager from "../utils/NotificationsManager";
import PlatformTouchable from "react-native-platform-touchable";
import AsyncStorageManager from "../utils/AsyncStorageManager";
import * as Expo from "expo";

const DATA_URL = "https://etud.insa-toulouse.fr/~vergnet/appli-amicale/dataProxiwash.json";

let reminderNotifTime = 5;

const MACHINE_STATES = {
    TERMINE: "0",
    DISPONIBLE: "1",
    FONCTIONNE: "2",
    HS: "3",
    ERREUR: "4"
};

let stateStrings = {};
let modalStateStrings = {};
let stateIcons = {};
let stateColors = {};


/**
 * Class defining the app's proxiwash screen. This screen shows information about washing machines and
 * dryers, taken from a scrapper reading proxiwash website
 */
export default class ProxiwashScreen extends FetchedDataSectionList {

    refreshInterval: IntervalID;

    /**
     * Creates machine state parameters using current theme and translations
     */
    constructor() {
        super(DATA_URL, 1000 * 30); // Refresh every half minute
        let colors = ThemeManager.getCurrentThemeVariables();
        stateColors[MACHINE_STATES.TERMINE] = colors.proxiwashFinishedColor;
        stateColors[MACHINE_STATES.DISPONIBLE] = colors.proxiwashReadyColor;
        stateColors[MACHINE_STATES.FONCTIONNE] = colors.proxiwashRunningColor;
        stateColors[MACHINE_STATES.HS] = colors.proxiwashBrokenColor;
        stateColors[MACHINE_STATES.ERREUR] = colors.proxiwashErrorColor;

        stateStrings[MACHINE_STATES.TERMINE] = i18n.t('proxiwashScreen.states.finished');
        stateStrings[MACHINE_STATES.DISPONIBLE] = i18n.t('proxiwashScreen.states.ready');
        stateStrings[MACHINE_STATES.FONCTIONNE] = i18n.t('proxiwashScreen.states.running');
        stateStrings[MACHINE_STATES.HS] = i18n.t('proxiwashScreen.states.broken');
        stateStrings[MACHINE_STATES.ERREUR] = i18n.t('proxiwashScreen.states.error');

        modalStateStrings[MACHINE_STATES.TERMINE] = i18n.t('proxiwashScreen.modal.finished');
        modalStateStrings[MACHINE_STATES.DISPONIBLE] = i18n.t('proxiwashScreen.modal.ready');
        modalStateStrings[MACHINE_STATES.FONCTIONNE] = i18n.t('proxiwashScreen.modal.running');
        modalStateStrings[MACHINE_STATES.HS] = i18n.t('proxiwashScreen.modal.broken');
        modalStateStrings[MACHINE_STATES.ERREUR] = i18n.t('proxiwashScreen.modal.error');

        stateIcons[MACHINE_STATES.TERMINE] = 'check-circle';
        stateIcons[MACHINE_STATES.DISPONIBLE] = 'radiobox-blank';
        stateIcons[MACHINE_STATES.FONCTIONNE] = 'progress-check';
        stateIcons[MACHINE_STATES.HS] = 'alert-octagram-outline';
        stateIcons[MACHINE_STATES.ERREUR] = 'alert';

        let dataString = AsyncStorageManager.getInstance().preferences.proxiwashWatchedMachines.current;
        this.state = {
            refreshing: false,
            firstLoading: true,
            fetchedData: {},
            machinesWatched: JSON.parse(dataString),
        };
    }

    /**
     * Setup notification channel for android and add listeners to detect notifications fired
     */
    componentDidMount() {
        super.componentDidMount();
        if (Platform.OS === 'android') {
            Expo.Notifications.createChannelAndroidAsync('reminders', {
                name: 'Reminders',
                priority: 'max',
                vibrate: [0, 250, 250, 250],
            });
        }
        // Remove machine from watch list when receiving last notification
        Expo.Notifications.addListener((notification) => {
            if (notification.data !== undefined) {
                if (this.isMachineWatched(notification.data.id) && notification.data.isMachineFinished === true) {
                    this.removeNotificationFromPrefs(this.getMachineIndexInWatchList(notification.data.id));
                }
            }
        });
    }

    getHeaderTranslation() {
        return i18n.t("screens.proxiwash");
    }

    getUpdateToastTranslations() {
        return [i18n.t("proxiwashScreen.listUpdated"), i18n.t("proxiwashScreen.listUpdateFail")];
    }

    getDryersKeyExtractor(item: Object) {
        return item !== undefined ? "dryer" + item.number : undefined;
    }

    getWashersKeyExtractor(item: Object) {
        return item !== undefined ? "washer" + item.number : undefined;
    }

    /**
     * Get the time remaining based on start/end time and done percent
     *
     * @param startString The string representing the start time. Format: hh:mm
     * @param endString The string representing the end time. Format: hh:mm
     * @param percentDone The percentage done
     * @returns {number} How many minutes are remaining for this machine
     */
    static getRemainingTime(startString: string, endString: string, percentDone: string): number {
        let startArray = startString.split(':');
        let endArray = endString.split(':');
        let startDate = new Date().setHours(parseInt(startArray[0]), parseInt(startArray[1]), 0, 0);
        let endDate = new Date().setHours(parseInt(endArray[0]), parseInt(endArray[1]), 0, 0);
        // Convert milliseconds into minutes
        let time: string = (((100 - parseFloat(percentDone)) / 100) * (endDate - startDate) / (60 * 1000)).toFixed(0);
        return parseInt(time);
    }

    /**
     * Setup notifications for the machine with the given ID.
     * One notification will be sent at the end of the program.
     * Another will be send a few minutes before the end, based on the value of reminderNotifTime
     *
     * @param machineId The machine's ID
     * @param remainingTime The time remaining for this machine
     * @returns {Promise<void>}
     */
    async setupNotifications(machineId: string, remainingTime: number) {
        if (!this.isMachineWatched(machineId)) {
            let endNotificationID = await NotificationsManager.scheduleNotification(
                i18n.t('proxiwashScreen.notifications.machineFinishedTitle'),
                i18n.t('proxiwashScreen.notifications.machineFinishedBody', {number: machineId}),
                new Date().getTime() + remainingTime * (60 * 1000), // Convert back to milliseconds
                {id: machineId, isMachineFinished: true},
                'reminders'
            );
            let reminderNotificationID = await ProxiwashScreen.setupReminderNotification(machineId, remainingTime);
            this.saveNotificationToPrefs(machineId, endNotificationID, reminderNotificationID);
        } else
            this.disableNotification(machineId);
    }

    static async setupReminderNotification(machineId: string, remainingTime: number): Promise<string | null> {
        let reminderNotificationID: string | null = null;
        let reminderNotificationTime = ProxiwashScreen.getReminderNotificationTime();
        if (remainingTime > reminderNotificationTime && reminderNotificationTime > 0) {
            reminderNotificationID = await NotificationsManager.scheduleNotification(
                i18n.t('proxiwashScreen.notifications.machineRunningTitle', {time: reminderNotificationTime}),
                i18n.t('proxiwashScreen.notifications.machineRunningBody', {number: machineId}),
                new Date().getTime() + (remainingTime - reminderNotificationTime) * (60 * 1000), // Convert back to milliseconds
                {id: machineId, isMachineFinished: false},
                'reminders'
            );
        }
        return reminderNotificationID;
    }

    static getReminderNotificationTime(): number {
        let val = AsyncStorageManager.getInstance().preferences.proxiwashNotifications.current;
        if (val !== "never")
            reminderNotifTime = parseInt(val);
        else
            reminderNotifTime = -1;
        return reminderNotifTime;
    }


    /**
     * Stop scheduled notifications for the machine of the given ID.
     * This will also remove the notification if it was already shown.
     *
     * @param machineId The machine's ID
     */
    disableNotification(machineId: string) {
        let data = this.state.machinesWatched;
        if (data.length > 0) {
            let arrayIndex = this.getMachineIndexInWatchList(machineId);
            if (arrayIndex !== -1) {
                NotificationsManager.cancelScheduledNotification(data[arrayIndex].endNotificationID);
                if (data[arrayIndex].reminderNotificationID !== null)
                    NotificationsManager.cancelScheduledNotification(data[arrayIndex].reminderNotificationID);
                this.removeNotificationFromPrefs(arrayIndex);
            }
        }
    }

    /**
     * Get the index of the given machine ID in the watchlist array
     *
     * @param machineId
     * @return
     */
    getMachineIndexInWatchList(machineId: string): number {
        let elem = this.state.machinesWatched.find(function (elem) {
            return elem.machineNumber === machineId
        });
        return this.state.machinesWatched.indexOf(elem);
    }

    /**
     * Add the given notifications associated to a machine ID to the watchlist, and save the array to the preferences
     *
     * @param machineId
     * @param endNotificationID
     * @param reminderNotificationID
     */
    saveNotificationToPrefs(machineId: string, endNotificationID: string, reminderNotificationID: string | null) {
        let data = this.state.machinesWatched;
        data.push({
            machineNumber: machineId,
            endNotificationID: endNotificationID,
            reminderNotificationID: reminderNotificationID
        });
        this.updateNotificationPrefs(data);
    }

    /**
     * remove the given index from the watchlist array and save it to preferences
     *
     * @param index
     */
    removeNotificationFromPrefs(index: number) {
        let data = this.state.machinesWatched;
        data.splice(index, 1);
        this.updateNotificationPrefs(data);
    }

    /**
     * Set the given data as the watchlist and save it to preferences
     *
     * @param data
     */
    updateNotificationPrefs(data: Array<Object>) {
        this.setState({machinesWatched: data});
        let prefKey = AsyncStorageManager.getInstance().preferences.proxiwashWatchedMachines.key;
        AsyncStorageManager.getInstance().savePref(prefKey, JSON.stringify(data));
    }

    /**
     * Checks whether the machine of the given ID has scheduled notifications
     *
     * @param machineID The machine's ID
     * @returns {boolean}
     */
    isMachineWatched(machineID: string) {
        return this.state.machinesWatched.find(function (elem) {
            return elem.machineNumber === machineID
        }) !== undefined;
    }

    createDataset(fetchedData: Object) {
        return [
            {
                title: i18n.t('proxiwashScreen.dryers'),
                icon: 'tumble-dryer',
                data: fetchedData.dryers === undefined ? [] : fetchedData.dryers,
                extraData: super.state,
                keyExtractor: this.getDryersKeyExtractor
            },
            {
                title: i18n.t('proxiwashScreen.washers'),
                icon: 'washing-machine',
                data: fetchedData.washers === undefined ? [] : fetchedData.washers,
                extraData: super.state,
                keyExtractor: this.getWashersKeyExtractor
            },
        ];
    }

    hasTabs(): boolean {
        return true;
    }

    /**
     * Show an alert fo a machine, allowing to enable/disable notifications if running
     *
     * @param title
     * @param item
     * @param remainingTime
     */
    showAlert(title: string, item: Object, remainingTime: number) {
        let buttons = [{text: i18n.t("proxiwashScreen.modal.ok")}];
        let message = modalStateStrings[MACHINE_STATES[item.state]];
        if (MACHINE_STATES[item.state] === MACHINE_STATES.FONCTIONNE) {
            buttons = [
                {
                    text: this.isMachineWatched(item.number) ?
                        i18n.t("proxiwashScreen.modal.disableNotifications") :
                        i18n.t("proxiwashScreen.modal.enableNotifications"),
                    onPress: () => this.setupNotifications(item.number, remainingTime)
                },
                {
                    text: i18n.t("proxiwashScreen.modal.cancel")
                }
            ];
            message = i18n.t('proxiwashScreen.modal.running',
                {
                    start: item.startTime,
                    end: item.endTime,
                    remaining: remainingTime
                });
        }
        Alert.alert(
            title,
            message,
            buttons
        );
    }

    /**
     * Get list item to be rendered
     *
     * @param item The object containing the item's FetchedData
     * @param section The object describing the current SectionList section
     * @param data The full FetchedData used by the SectionList
     * @returns {React.Node}
     */
    getRenderItem(item: Object, section: Object, data: Object) {
        let isMachineRunning = MACHINE_STATES[item.state] === MACHINE_STATES.FONCTIONNE;
        let machineName = (section.title === i18n.t('proxiwashScreen.dryers') ? i18n.t('proxiwashScreen.dryer') : i18n.t('proxiwashScreen.washer')) + ' n°' + item.number;
        let remainingTime = 0;
        if (isMachineRunning)
            remainingTime = ProxiwashScreen.getRemainingTime(item.startTime, item.endTime, item.donePercent);

        return (
            <Card style={{
                flex: 0,
                height: 64,
                marginLeft: 10,
                marginRight: 10
            }}>

                <CardItem
                    style={{
                        backgroundColor: stateColors[MACHINE_STATES[item.state]],
                        paddingRight: 0,
                        paddingLeft: 0,
                        height: '100%',
                    }}
                >
                    <View style={{
                        height: 64,
                        position: 'absolute',
                        right: 0,
                        width: item.donePercent !== '' ? (100 - parseInt(item.donePercent)).toString() + '%' : 0,
                        backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor
                    }}/>
                    <PlatformTouchable
                        onPress={() => this.showAlert(machineName, item, remainingTime)}
                        style={{
                            height: 64,
                            position: 'absolute',
                            zIndex: 10, // Make sure the button is above the text
                            right: 0,
                            width: '100%'
                        }}
                    >
                        <View/>
                    </PlatformTouchable>
                    <Left style={{marginLeft: 10}}>
                        <CustomMaterialIcon
                            icon={section.title === i18n.t('proxiwashScreen.dryers') ? 'tumble-dryer' : 'washing-machine'}
                            fontSize={30}
                        />
                        <Body>
                            <Text>
                                {machineName + ' '}
                                {this.isMachineWatched(item.number) ?
                                    <CustomMaterialIcon
                                        icon='bell-ring'
                                        color={ThemeManager.getCurrentThemeVariables().brandPrimary}
                                        fontSize={20}
                                    /> : ''}
                            </Text>
                            <Text note>
                                {isMachineRunning ? item.startTime + '/' + item.endTime : ''}
                            </Text>
                        </Body>
                    </Left>
                    <Right style={{marginRight: 10}}>
                        <Text style={MACHINE_STATES[item.state] === MACHINE_STATES.TERMINE ?
                            {fontWeight: 'bold'} : {}}
                        >
                            {stateStrings[MACHINE_STATES[item.state]]}
                        </Text>
                        <CustomMaterialIcon icon={stateIcons[MACHINE_STATES[item.state]]}
                                            fontSize={25}
                        />
                    </Right>
                </CardItem>
            </Card>);
    }
}
