// @flow

import * as React from 'react';
import {SectionList, RefreshControl, View} from 'react-native';
import {Body, Container, Icon, Left, ListItem, Right, Text, Toast, H2, Button} from 'native-base';
import CustomHeader from "../components/CustomHeader";
import ThemeManager from '../utils/ThemeManager';
import NotificationsManager from '../utils/NotificationsManager';
import i18n from "i18n-js";
import {AsyncStorage} from 'react-native'
import CustomMaterialIcon from "../components/CustomMaterialIcon";

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

let stateColors = {};

type Props = {
    navigation: Object,
};

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    data: Object,
    machinesWatched: Array<Object>
};

/**
 * Class defining the app's proxiwash screen. This screen shows information about washing machines and
 * dryers, taken from a scrapper reading proxiwash website
 */
export default class ProxiwashScreen extends React.Component<Props, State> {

    state = {
        refreshing: false,
        firstLoading: true,
        data: {},
        machinesWatched: [],
    };

    /**
     * Creates machine state parameters using current theme and translations
     *
     * @param props
     */
    constructor(props: Props) {
        super(props);
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
    }

    /**
     * Read the data from the proxiwash scrapper and set it to current state to reload the screen
     *
     * @returns {Promise<void>}
     */
    async readData() {
        try {
            let response = await fetch(DATA_URL);
            let responseJson = await response.json();
            this.setState({
                data: responseJson
            });
        } catch (error) {
            console.error(error);
        }
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
     * Refresh the data on first screen load
     */
    componentDidMount() {
        this._onRefresh();
    }

    /**
     * Show the refresh inddicator and wait for data to be fetched from the scrapper
     *
     * @private
     */
    _onRefresh = () => {
        this.setState({refreshing: true});
        this.readData().then(() => {
            this.setState({
                refreshing: false,
                firstLoading: false
            });
            Toast.show({
                text: i18n.t('proxiwashScreen.listUpdated'),
                buttonText: 'OK',
                type: "success",
                duration: 2000
            })
        });
    };

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

    /**
     * Get list item to be rendered
     *
     * @param item The object containing the item's data
     * @param section The object describing the current SectionList section
     * @param data The full data used by the SectionList
     * @returns {React.Node}
     */
    renderItem(item: Object, section: Object, data: Object) {
        return (
            <ListItem
                thumbnail
                style={{
                    marginLeft: 0,
                    backgroundColor: stateColors[MACHINE_STATES[item.state]]
                }}
            >
                <View style={{
                    height: '100%',
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    right: 0,
                    width: item.donePercent !== '' ? (100 - parseInt(item.donePercent)).toString() + '%' : 0,
                    backgroundColor: ThemeManager.getInstance().getCurrentThemeVariables().containerBgColor
                }}>
                </View>
                <Left>
                    <CustomMaterialIcon icon={section.title === data[0].title ? 'tumble-dryer' : 'washing-machine'}
                                        fontSize={30}
                    />
                </Left>
                <Body>
                    <Text>
                        {section.title === data[0].title ? i18n.t('proxiwashScreen.dryer') : i18n.t('proxiwashScreen.washer')} n°{item.number}
                    </Text>
                    <Text note>
                        {item.startTime !== '' ? item.startTime + '/' + item.endTime : ''}
                    </Text>
                </Body>
                <Right>
                    {item.startTime !== '' ?
                        <Button
                            style={this.isMachineWatched(item.number) ?
                                {backgroundColor: '#ba7c1f'} : {}}
                            onPress={() => {
                                this.setupNotifications(item.number, ProxiwashScreen.getRemainingTime(item.startTime, item.endTime, item.donePercent))
                            }}>
                            <Text>
                                {ProxiwashScreen.getRemainingTime(item.startTime, item.endTime, item.donePercent) + ' ' + i18n.t('proxiwashScreen.min')}
                            </Text>
                            <Icon name={this.isMachineWatched(item.number) ? 'bell-ring' : 'bell'}
                                  type={'MaterialCommunityIcons'}
                                  style={{fontSize: 30, width: 30}}
                            />
                        </Button>
                        : <Text style={MACHINE_STATES[item.state] === MACHINE_STATES.TERMINE ?
                            {fontWeight: 'bold'} : {}}
                        >{stateStrings[MACHINE_STATES[item.state]]}</Text>

                    }
                </Right>
            </ListItem>);
    }

    /**
     * Renders the machines list.
     * If we are loading for the first time, change the data for the SectionList to display a loading message.
     *
     * @returns {react.Node}
     */
    render() {
        const nav = this.props.navigation;
        const data = [
            {
                title: i18n.t('proxiwashScreen.dryers'),
                data: this.state.data.dryers === undefined ? [] : this.state.data.dryers,
                extraData: this.state
            },
            {
                title: i18n.t('proxiwashScreen.washers'),
                data: this.state.data.washers === undefined ? [] : this.state.data.washers,
                extraData: this.state
            },
        ];
        const loadingData = [
            {
                title: i18n.t('proxiwashScreen.loading'),
                data: []
            }
        ];
        return (
            <Container>
                <CustomHeader navigation={nav} title={'Proxiwash'}/>
                <SectionList
                    sections={this.state.firstLoading ? loadingData : data}
                    keyExtractor={(item) => item.number}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    renderSectionHeader={({section: {title}}) => (
                        <H2 style={{textAlign: 'center', paddingVertical: 10}}>{title}</H2>
                    )}
                    renderItem={({item, section}) =>
                        this.renderItem(item, section, data)
                    }
                />
            </Container>
        );
    }
}
