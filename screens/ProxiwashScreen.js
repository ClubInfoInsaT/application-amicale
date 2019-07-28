// @flow

import * as React from 'react';
import {AsyncStorage, View} from 'react-native';
import {Body, Card, CardItem, H2, Left, Right, Text} from 'native-base';
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import FetchedDataSectionList from "../components/FetchedDataSectionList";
import NotificationsManager from "../utils/NotificationsManager";

const DATA_URL = "https://etud.insa-toulouse.fr/~vergnet/appli-amicale/dataProxiwash.json";
const WATCHED_MACHINES_PREFKEY = "proxiwash.watchedMachines";

let reminderNotifTime = 5;

const MACHINE_STATES = {
    TERMINE: "0",
    DISPONIBLE: "1",
    FONCTIONNE: "2",
    HS: "3",
    ERREUR: "4"
};

let stateStrings = {};
let stateIcons = {};
let stateColors = {};


/**
 * Class defining the app's proxiwash screen. This screen shows information about washing machines and
 * dryers, taken from a scrapper reading proxiwash website
 */
export default class ProxiwashScreen extends FetchedDataSectionList {

    state = {
        refreshing: false,
        firstLoading: true,
        fetchedData: {},
        machinesWatched: [],
    };

    /**
     * Creates machine state parameters using current theme and translations
     */
    constructor() {
        super();
        let colors = ThemeManager.getInstance().getCurrentThemeVariables();
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

        stateIcons[MACHINE_STATES.TERMINE] = 'check-circle';
        stateIcons[MACHINE_STATES.DISPONIBLE] = 'radiobox-blank';
        stateIcons[MACHINE_STATES.FONCTIONNE] = 'progress-check';
        stateIcons[MACHINE_STATES.HS] = 'alert-octagram-outline';
        stateIcons[MACHINE_STATES.ERREUR] = 'alert';
    }

    getFetchUrl() {
        return DATA_URL;
    }

    getHeaderTranslation() {
        return i18n.t("screens.proxiwash");
    }

    getUpdateToastTranslations() {
        return [i18n.t("proxiwashScreen.listUpdated"), i18n.t("proxiwashScreen.listUpdateFail")];
    }

    getKeyExtractor(item: Object) {
        return item !== undefined ? item.number : undefined;
    }

    /**
     * Get which machines have notifications enabled before loading the screen
     *
     * @returns {Promise<void>}
     */
    async componentWillMount() {
        let dataString = await AsyncStorage.getItem(WATCHED_MACHINES_PREFKEY);
        if (dataString === null)
            dataString = '[]';
        this.setState({
            machinesWatched: JSON.parse(dataString)
        });
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
        let startDate = new Date();
        startDate.setHours(parseInt(startArray[0]), parseInt(startArray[1]), 0, 0);
        let endDate = new Date();
        endDate.setHours(parseInt(endArray[0]), parseInt(endArray[1]), 0, 0);
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
            let endNotifID = await NotificationsManager.scheduleNotification(
                i18n.t('proxiwashScreen.notifications.machineFinishedTitle'),
                i18n.t('proxiwashScreen.notifications.machineFinishedBody', {number: machineId}),
                new Date().getTime() + remainingTime * (60 * 1000) // Convert back to milliseconds
            );
            let reminderNotifID = undefined;
            let val = await AsyncStorage.getItem('proxiwashNotifKey');
            if (val === null)
                val = "5";
            if (val !== "never")
                reminderNotifTime = parseInt(val);
            else
                reminderNotifTime = -1;
            console.log(reminderNotifTime);
            if (remainingTime > reminderNotifTime && reminderNotifTime > 0) {
                reminderNotifID = await NotificationsManager.scheduleNotification(
                    i18n.t('proxiwashScreen.notifications.machineRunningTitle', {time: reminderNotifTime}),
                    i18n.t('proxiwashScreen.notifications.machineRunningBody', {number: machineId}),
                    new Date().getTime() + (remainingTime - reminderNotifTime) * (60 * 1000) // Convert back to milliseconds
                );
            }
            let data = this.state.machinesWatched;
            data.push({machineNumber: machineId, endNotifID: endNotifID, reminderNotifID: reminderNotifID});
            this.setState({machinesWatched: data});
            AsyncStorage.setItem(WATCHED_MACHINES_PREFKEY, JSON.stringify(data));
        } else
            this.disableNotification(machineId);
    }

    /**
     * Stop scheduled notifications for the machine of the given ID.
     * This will also remove the notification if it was already shown.
     *
     * @param machineId The machine's ID
     */
    disableNotification(machineId: string) {
        let data: Object = this.state.machinesWatched;
        if (data.length > 0) {
            let elem = this.state.machinesWatched.find(function (elem) {
                return elem.machineNumber === machineId
            });
            let arrayIndex = data.indexOf(elem);
            NotificationsManager.cancelScheduledNotification(data[arrayIndex].endNotifID);
            if (data[arrayIndex].reminderNotifID !== undefined)
                NotificationsManager.cancelScheduledNotification(data[arrayIndex].reminderNotifID);
            data.splice(arrayIndex, 1);
            this.setState({machinesWatched: data});
            AsyncStorage.setItem(WATCHED_MACHINES_PREFKEY, JSON.stringify(data));
        }
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
                extraData: super.state
            },
            {
                title: i18n.t('proxiwashScreen.washers'),
                icon:  'washing-machine',
                data: fetchedData.washers === undefined ? [] : fetchedData.washers,
                extraData: super.state
            },
        ];
    }

    hasTabs(): boolean {
        return true;
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
        return (
            <Card style={{
                flex: 0,
                height: 64
            }}>

                <CardItem
                    style={{
                        backgroundColor: stateColors[MACHINE_STATES[item.state]],
                        height: '100%'
                    }}
                >
                    <View style={{
                        height: 64,
                        position: 'absolute',
                        right: 0,
                        width: item.donePercent !== '' ? (100 - parseInt(item.donePercent)).toString() + '%' : 0,
                        backgroundColor: ThemeManager.getInstance().getCurrentThemeVariables().containerBgColor
                    }}/>
                    <Left>
                        <CustomMaterialIcon icon={section.title === i18n.t('proxiwashScreen.dryers') ? 'tumble-dryer' : 'washing-machine'}
                                            fontSize={30}
                        />
                        <Body>
                            <Text>
                                {section.title === i18n.t('proxiwashScreen.dryers') ? i18n.t('proxiwashScreen.dryer') : i18n.t('proxiwashScreen.washer')} n°{item.number}
                            </Text>
                            <Text note>
                                {item.startTime !== '' ? item.startTime + '/' + item.endTime : ''}
                            </Text>
                        </Body>
                    </Left>
                    <Right style={{}}>
                        <Text style={MACHINE_STATES[item.state] === MACHINE_STATES.TERMINE ?
                            {fontWeight: 'bold'} : {}}
                        >
                            {stateStrings[MACHINE_STATES[item.state]]}
                        </Text>
                        <CustomMaterialIcon icon={stateIcons[MACHINE_STATES[item.state]]}
                                            fontSize={25}
                        />

                        {/*{item.startTime !== '' ?*/}
                        {/*    <Button*/}
                        {/*        style={this.isMachineWatched(item.number) ?*/}
                        {/*            {backgroundColor: '#ba7c1f'} : {}}*/}
                        {/*        onPress={() => {*/}
                        {/*            this.setupNotifications(item.number, ProxiwashScreen.getRemainingTime(item.startTime, item.endTime, item.donePercent))*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <Text>*/}
                        {/*            {ProxiwashScreen.getRemainingTime(item.startTime, item.endTime, item.donePercent) + ' ' + i18n.t('proxiwashScreen.min')}*/}
                        {/*        </Text>*/}
                        {/*        <Icon*/}
                        {/*            name={this.isMachineWatched(item.number) ? 'bell-ring' : 'bell'}*/}
                        {/*            type={'MaterialCommunityIcons'}*/}
                        {/*            style={{fontSize: 30, width: 30}}*/}
                        {/*        />*/}
                        {/*    </Button>*/}
                        {/*    : (*/}
                        {/*        )*/}
                        {/*}*/}
                    </Right>
                </CardItem>
            </Card>);
    }

    // getRenderSectionHeader(title: String) {
    //     return <H2 style={{textAlign: 'center', paddingVertical: 10}}>{title}</H2>;
    // }
}
