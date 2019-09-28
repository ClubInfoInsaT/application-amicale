// @flow

import * as React from 'react';
import {Alert, Platform, View} from 'react-native';
import {Body, Card, CardItem, Left, Right, Text} from 'native-base';
import ThemeManager from '../../utils/ThemeManager';
import i18n from "i18n-js";
import CustomMaterialIcon from "../../components/CustomMaterialIcon";
import FetchedDataSectionList from "../../components/FetchedDataSectionList";
import NotificationsManager from "../../utils/NotificationsManager";
import PlatformTouchable from "react-native-platform-touchable";
import Touchable from "react-native-platform-touchable";
import AsyncStorageManager from "../../utils/AsyncStorageManager";
import * as Expo from "expo";

const DATA_URL = "https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/washinsa/washinsa.json";

const MACHINE_STATES = {
    "TERMINE": "0",
    "DISPONIBLE": "1",
    "EN COURS": "2",
    "HS": "3",
    "ERREUR": "4"
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
        stateColors[MACHINE_STATES["EN COURS"]] = colors.proxiwashRunningColor;
        stateColors[MACHINE_STATES.HS] = colors.proxiwashBrokenColor;
        stateColors[MACHINE_STATES.ERREUR] = colors.proxiwashErrorColor;

        stateStrings[MACHINE_STATES.TERMINE] = i18n.t('proxiwashScreen.states.finished');
        stateStrings[MACHINE_STATES.DISPONIBLE] = i18n.t('proxiwashScreen.states.ready');
        stateStrings[MACHINE_STATES["EN COURS"]] = i18n.t('proxiwashScreen.states.running');
        stateStrings[MACHINE_STATES.HS] = i18n.t('proxiwashScreen.states.broken');
        stateStrings[MACHINE_STATES.ERREUR] = i18n.t('proxiwashScreen.states.error');

        modalStateStrings[MACHINE_STATES.TERMINE] = i18n.t('proxiwashScreen.modal.finished');
        modalStateStrings[MACHINE_STATES.DISPONIBLE] = i18n.t('proxiwashScreen.modal.ready');
        modalStateStrings[MACHINE_STATES["EN COURS"]] = i18n.t('proxiwashScreen.modal.running');
        modalStateStrings[MACHINE_STATES.HS] = i18n.t('proxiwashScreen.modal.broken');
        modalStateStrings[MACHINE_STATES.ERREUR] = i18n.t('proxiwashScreen.modal.error');

        stateIcons[MACHINE_STATES.TERMINE] = 'check-circle';
        stateIcons[MACHINE_STATES.DISPONIBLE] = 'radiobox-blank';
        stateIcons[MACHINE_STATES["EN COURS"]] = 'progress-check';
        stateIcons[MACHINE_STATES.HS] = 'alert-octagram-outline';
        stateIcons[MACHINE_STATES.ERREUR] = 'alert';

        // let dataString = AsyncStorageManager.getInstance().preferences.proxiwashWatchedMachines.current;
        this.state = {
            refreshing: false,
            firstLoading: true,
            fetchedData: {},
            // machinesWatched: JSON.parse(dataString),
            machinesWatched: [],
        };
        this.setMinTimeRefresh(30);
    }

    /**
     * Setup notification channel for android and add listeners to detect notifications fired
     */
    componentDidMount() {
        super.componentDidMount();

        if (AsyncStorageManager.getInstance().preferences.expoToken.current !== '') {
            // Get latest watchlist from server
            NotificationsManager.getMachineNotificationWatchlist((fetchedList) => {
                this.setState({machinesWatched: fetchedList})
            });
            // Get updated watchlist after received notification
            Expo.Notifications.addListener((notification) => {
                NotificationsManager.getMachineNotificationWatchlist((fetchedList) => {
                    this.setState({machinesWatched: fetchedList})
                });
            });
            if (Platform.OS === 'android') {
                Expo.Notifications.createChannelAndroidAsync('reminders', {
                    name: 'Reminders',
                    priority: 'max',
                    vibrate: [0, 250, 250, 250],
                });
            }
        }
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
     * Setup notifications for the machine with the given ID.
     * One notification will be sent at the end of the program.
     * Another will be send a few minutes before the end, based on the value of reminderNotifTime
     *
     * @param machineId The machine's ID
     * @returns {Promise<void>}
     */
    setupNotifications(machineId: string) {
        if (AsyncStorageManager.getInstance().preferences.expoToken.current !== '') {
            if (!this.isMachineWatched(machineId)) {
                NotificationsManager.setupMachineNotification(machineId, true);
                this.saveNotificationToState(machineId);
            } else
                this.disableNotification(machineId);
        } else {
            this.showNotificationsDisabledWarning();
        }
    }

    showNotificationsDisabledWarning() {
        Alert.alert(
            i18n.t("proxiwashScreen.modal.notificationErrorTitle"),
            i18n.t("proxiwashScreen.modal.notificationErrorDescription"),
        );
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
            let arrayIndex = data.indexOf(machineId);
            if (arrayIndex !== -1) {
                NotificationsManager.setupMachineNotification(machineId, false);
                this.removeNotificationFroState(arrayIndex);
            }
        }
    }

    /**
     * Add the given notifications associated to a machine ID to the watchlist, and save the array to the preferences
     *
     * @param machineId
     */
    saveNotificationToState(machineId: string) {
        let data = this.state.machinesWatched;
        data.push(machineId);
        this.updateNotificationState(data);
    }

    /**
     * remove the given index from the watchlist array and save it to preferences
     *
     * @param index
     */
    removeNotificationFroState(index: number) {
        let data = this.state.machinesWatched;
        data.splice(index, 1);
        this.updateNotificationState(data);
    }

    /**
     * Set the given data as the watchlist and save it to preferences
     *
     * @param data
     */
    updateNotificationState(data: Array<Object>) {
        this.setState({machinesWatched: data});
        // let prefKey = AsyncStorageManager.getInstance().preferences.proxiwashWatchedMachines.key;
        // AsyncStorageManager.getInstance().savePref(prefKey, JSON.stringify(data));
    }

    /**
     * Checks whether the machine of the given ID has scheduled notifications
     *
     * @param machineID The machine's ID
     * @returns {boolean}
     */
    isMachineWatched(machineID: string) {
        return this.state.machinesWatched.indexOf(machineID) !== -1;
    }

    createDataset(fetchedData: Object) {
        return [
            {
                title: i18n.t('proxiwashScreen.washers'),
                icon: 'washing-machine',
                data: fetchedData.washers === undefined ? [] : fetchedData.washers,
                extraData: super.state,
                keyExtractor: this.getWashersKeyExtractor
            },
            {
                title: i18n.t('proxiwashScreen.dryers'),
                icon: 'tumble-dryer',
                data: fetchedData.dryers === undefined ? [] : fetchedData.dryers,
                extraData: super.state,
                keyExtractor: this.getDryersKeyExtractor
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
     * @param isDryer
     */
    showAlert(title: string, item: Object, isDryer: boolean) {
        let buttons = [{text: i18n.t("proxiwashScreen.modal.ok")}];
        let message = modalStateStrings[MACHINE_STATES[item.state]];
        if (MACHINE_STATES[item.state] === MACHINE_STATES["EN COURS"]) {
            buttons = [
                {
                    text: this.isMachineWatched(item.number) ?
                        i18n.t("proxiwashScreen.modal.disableNotifications") :
                        i18n.t("proxiwashScreen.modal.enableNotifications"),
                    onPress: () => this.setupNotifications(item.number)
                },
                {
                    text: i18n.t("proxiwashScreen.modal.cancel")
                }
            ];
            message = i18n.t('proxiwashScreen.modal.running',
                {
                    start: item.startTime,
                    end: item.endTime,
                    remaining: item.remainingTime
                });
        } else if (MACHINE_STATES[item.state] === MACHINE_STATES.DISPONIBLE) {
            if (isDryer)
                message += '\n' + i18n.t('proxiwashScreen.dryersTariff');
            else
                message += '\n' + i18n.t('proxiwashScreen.washersTariff');
        }
        Alert.alert(
            title,
            message,
            buttons
        );
    }

    getRightButton(): * {
        return (
            <Touchable
                style={{padding: 6}}
                onPress={() => this.props.navigation.navigate('ProxiwashAboutScreen')}>
                <CustomMaterialIcon
                    color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                    icon="information"/>
            </Touchable>
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
        let isMachineRunning = MACHINE_STATES[item.state] === MACHINE_STATES["EN COURS"];
        let machineName = (section.title === i18n.t('proxiwashScreen.dryers') ? i18n.t('proxiwashScreen.dryer') : i18n.t('proxiwashScreen.washer')) + ' n°' + item.number;
        let isDryer = section.title === i18n.t('proxiwashScreen.dryers');
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
                        onPress={() => this.showAlert(machineName, item, isDryer)}
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
                            icon={isDryer ? 'tumble-dryer' : 'washing-machine'}
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