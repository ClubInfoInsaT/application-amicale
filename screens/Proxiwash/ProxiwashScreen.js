// @flow

import * as React from 'react';
import {Alert, Platform, View} from 'react-native';
import ThemeManager from '../../utils/ThemeManager';
import i18n from "i18n-js";
import WebSectionList from "../../components/WebSectionList";
import NotificationsManager from "../../utils/NotificationsManager";
import AsyncStorageManager from "../../utils/AsyncStorageManager";
import * as Expo from "expo";
import {Divider, IconButton, List, Text, Title} from 'react-native-paper';
import HeaderButton from "../../components/HeaderButton";
import ProxiwashListItem from "../../components/ProxiwashListItem";
import ProxiwashConstants from "../../constants/ProxiwashConstants";

const DATA_URL = "https://etud.insa-toulouse.fr/~amicale_app/washinsa/washinsa.json";

let stateStrings = {};
let modalStateStrings = {};
let stateIcons = {};

const REFRESH_TIME = 1000 * 10; // Refresh every 10 seconds

type Props = {
    navigation: Object,
}

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    fetchedData: Object,
    machinesWatched: Array<string>,
};


/**
 * Class defining the app's proxiwash screen. This screen shows information about washing machines and
 * dryers, taken from a scrapper reading proxiwash website
 */
export default class ProxiwashScreen extends React.Component<Props, State> {

    onAboutPress: Function;
    getRenderItem: Function;
    getRenderSectionHeader: Function;
    createDataset: Function;

    state = {
        refreshing: false,
        firstLoading: true,
        fetchedData: {},
        // machinesWatched: JSON.parse(dataString),
        machinesWatched: [],
    };

    /**
     * Creates machine state parameters using current theme and translations
     */
    constructor() {
        super();
        stateStrings[ProxiwashConstants.machineStates.TERMINE] = i18n.t('proxiwashScreen.states.finished');
        stateStrings[ProxiwashConstants.machineStates.DISPONIBLE] = i18n.t('proxiwashScreen.states.ready');
        stateStrings[ProxiwashConstants.machineStates["EN COURS"]] = i18n.t('proxiwashScreen.states.running');
        stateStrings[ProxiwashConstants.machineStates.HS] = i18n.t('proxiwashScreen.states.broken');
        stateStrings[ProxiwashConstants.machineStates.ERREUR] = i18n.t('proxiwashScreen.states.error');

        modalStateStrings[ProxiwashConstants.machineStates.TERMINE] = i18n.t('proxiwashScreen.modal.finished');
        modalStateStrings[ProxiwashConstants.machineStates.DISPONIBLE] = i18n.t('proxiwashScreen.modal.ready');
        modalStateStrings[ProxiwashConstants.machineStates["EN COURS"]] = i18n.t('proxiwashScreen.modal.running');
        modalStateStrings[ProxiwashConstants.machineStates.HS] = i18n.t('proxiwashScreen.modal.broken');
        modalStateStrings[ProxiwashConstants.machineStates.ERREUR] = i18n.t('proxiwashScreen.modal.error');

        stateIcons[ProxiwashConstants.machineStates.TERMINE] = 'check-circle';
        stateIcons[ProxiwashConstants.machineStates.DISPONIBLE] = 'radiobox-blank';
        stateIcons[ProxiwashConstants.machineStates["EN COURS"]] = 'progress-check';
        stateIcons[ProxiwashConstants.machineStates.HS] = 'alert-octagram-outline';
        stateIcons[ProxiwashConstants.machineStates.ERREUR] = 'alert';

        // let dataString = AsyncStorageManager.getInstance().preferences.proxiwashWatchedMachines.current;
        this.onAboutPress = this.onAboutPress.bind(this);
        this.getRenderItem = this.getRenderItem.bind(this);
        this.getRenderSectionHeader = this.getRenderSectionHeader.bind(this);
        this.createDataset = this.createDataset.bind(this);
    }

    /**
     * Setup notification channel for android and add listeners to detect notifications fired
     */
    componentDidMount() {
        const rightButton = this.getRightButton.bind(this);
        this.props.navigation.setOptions({
            headerRight: rightButton,
        });
        if (AsyncStorageManager.getInstance().preferences.expoToken.current !== '') {
            // Get latest watchlist from server
            NotificationsManager.getMachineNotificationWatchlist((fetchedList) => {
                this.setState({machinesWatched: fetchedList})
            });
            // Get updated watchlist after received notification
            Expo.Notifications.addListener(() => {
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
                title: i18n.t('proxiwashScreen.dryers'),
                icon: 'tumble-dryer',
                data: fetchedData.dryers === undefined ? [] : fetchedData.dryers,
                extraData: this.state,
                keyExtractor: this.getDryersKeyExtractor
            },
            {
                title: i18n.t('proxiwashScreen.washers'),
                icon: 'washing-machine',
                data: fetchedData.washers === undefined ? [] : fetchedData.washers,
                extraData: this.state,
                keyExtractor: this.getWashersKeyExtractor
            },
        ];
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
        let message = modalStateStrings[ProxiwashConstants.machineStates[item.state]];
        const onPress = this.setupNotifications.bind(this, item.number);
        if (ProxiwashConstants.machineStates[item.state] === ProxiwashConstants.machineStates["EN COURS"]) {
            buttons = [
                {
                    text: this.isMachineWatched(item.number) ?
                        i18n.t("proxiwashScreen.modal.disableNotifications") :
                        i18n.t("proxiwashScreen.modal.enableNotifications"),
                    onPress: onPress
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
        } else if (ProxiwashConstants.machineStates[item.state] === ProxiwashConstants.machineStates.DISPONIBLE) {
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

    onAboutPress() {
        this.props.navigation.navigate('ProxiwashAboutScreen');
    }

    getRightButton() {
        return (
            <HeaderButton icon={'information'} onPress={this.onAboutPress}/>
        );
    }

    render() {
        const nav = this.props.navigation;
        return (
            <WebSectionList
                createDataset={this.createDataset}
                navigation={nav}
                refreshTime={REFRESH_TIME}
                fetchUrl={DATA_URL}
                renderItem={this.getRenderItem}
                renderSectionHeader={this.getRenderSectionHeader}/>
        );
    }

    getRenderSectionHeader({section}: Object) {
        return (
            <Title style={{
                marginTop: 10,
                textAlign: 'center'
            }}>
                {section.title}
            </Title>
        );
    }

    /**
     * Get list item to be rendered
     *
     * @param item The object containing the item's FetchedData
     * @param section The object describing the current SectionList section
     * @returns {React.Node}
     */
    getRenderItem({item, section}: Object) {
        const isMachineRunning = ProxiwashConstants.machineStates[item.state] === ProxiwashConstants.machineStates["EN COURS"];
        const machineName = (section.title === i18n.t('proxiwashScreen.dryers') ? i18n.t('proxiwashScreen.dryer') : i18n.t('proxiwashScreen.washer')) + ' n°' + item.number;
        const isDryer = section.title === i18n.t('proxiwashScreen.dryers');
        const onPress = this.showAlert.bind(this, machineName, item, isDryer);
        let width = item.donePercent !== '' ? (parseInt(item.donePercent)).toString() + '%' : 0;
        if (ProxiwashConstants.machineStates[item.state] === '0')
            width = '100%';
        return (
            <ProxiwashListItem
                title={machineName}
                description={isMachineRunning ? item.startTime + '/' + item.endTime : ''}
                onPress={onPress}
                progress={width}
                state={item.state}
                isWatched={this.isMachineWatched(item.number)}
                isDryer={isDryer}
                statusText={stateStrings[ProxiwashConstants.machineStates[item.state]]}
                statusIcon={stateIcons[ProxiwashConstants.machineStates[item.state]]}
            />
        );
    }
}
