import React from 'react';
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

const remainderNotifTime = 5;

const MACHINE_STATES = {
    TERMINE: "0",
    DISPONIBLE: "1",
    FONCTIONNE: "2",
    HS: "3",
    ERREUR: "4"
};

let stateStrings = {};

let stateColors = {};


export default class ProxiwashScreen extends React.Component {

    constructor(props) {
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
        this.state = {
            refreshing: false,
            firstLoading: true,
            data: {},
            machinesWatched: [],
        };
    }

    async readData() {
        try {
            let response = await fetch(DATA_URL);
            let responseJson = await response.json();
            // This prevents end notifications from showing
            // let watchList = this.state.machinesWatched;
            // for (let i = 0; i < watchList.length; i++) {
            //     if (responseJson[MACHINE_STATES[watchList[i].machineNumber.state]] !== MACHINE_STATES.FONCTIONNE)
            //         this.disableNotification(watchList[i].machineNumber);
            // }
            this.setState({
                data: responseJson
            });
        } catch (error) {
            console.error(error);
        }
    }

    async componentWillMount() {
        let dataString = await AsyncStorage.getItem(WATCHED_MACHINES_PREFKEY);
        if (dataString === null)
            dataString = '[]';
        this.setState({machinesWatched: JSON.parse(dataString)});
    }

    componentDidMount() {
        this._onRefresh();
    }

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

    static getRemainingTime(startString, endString, percentDone) {
        let startArray = startString.split(':');
        let endArray = endString.split(':');
        let startDate = new Date();
        startDate.setHours(parseInt(startArray[0]), parseInt(startArray[1]), 0, 0);
        let endDate = new Date();
        endDate.setHours(parseInt(endArray[0]), parseInt(endArray[1]), 0, 0);
        return (((100 - percentDone) / 100) * (endDate - startDate) / (60 * 1000)).toFixed(0); // Convert milliseconds into minutes
    }

    async setupNotifications(number, remainingTime) {
        if (!this.isMachineWatched(number)) {
            let endNotifID = await NotificationsManager.scheduleNotification(
                i18n.t('proxiwashScreen.notifications.machineFinishedTitle'),
                i18n.t('proxiwashScreen.notifications.machineFinishedBody', {number: number}),
                new Date().getTime() + remainingTime * (60 * 1000) // Convert back to milliseconds
            );
            let remainderNotifID = undefined;
            if (remainingTime > remainderNotifTime) {
                remainderNotifID = await NotificationsManager.scheduleNotification(
                    i18n.t('proxiwashScreen.notifications.machineRunningTitle', {time: remainderNotifTime}),
                    i18n.t('proxiwashScreen.notifications.machineRunningBody', {number: number}),
                    new Date().getTime() + (remainingTime - remainderNotifTime) * (60 * 1000) // Convert back to milliseconds
                );
            }
            let data = this.state.machinesWatched;
            data.push({machineNumber: number, endNotifID: endNotifID, remainderNotifID: remainderNotifID});
            this.setState({machinesWatched: data});
            AsyncStorage.setItem(WATCHED_MACHINES_PREFKEY, JSON.stringify(data));
        } else
            this.disableNotification(number);
    }

    disableNotification(number) {
        let data = this.state.machinesWatched;
        if (data.length > 0) {
            let elem = this.state.machinesWatched.find(function (elem) {
                return elem.machineNumber === number
            });
            let arrayIndex = data.indexOf(elem);
            NotificationsManager.cancelScheduledNoification(data[arrayIndex].endNotifID);
            if (data[arrayIndex].remainderNotifID !== undefined)
                NotificationsManager.cancelScheduledNoification(data[arrayIndex].remainderNotifID);
            data.splice(arrayIndex, 1);
            this.setState({machinesWatched: data});
            AsyncStorage.setItem(WATCHED_MACHINES_PREFKEY, JSON.stringify(data));
        }
    }

    isMachineWatched(number) {
        return this.state.machinesWatched.find(function (elem) {
            return elem.machineNumber === number
        }) !== undefined;
    }

    renderItem(item, section, data) {
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
