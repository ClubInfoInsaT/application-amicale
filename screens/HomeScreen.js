// @flow

import * as React from 'react';
import {Image, Linking, TouchableOpacity, View} from 'react-native';
import {Body, Button, Card, CardItem, H1, Left, Text, Thumbnail} from 'native-base';
import i18n from "i18n-js";
import CustomMaterialIcon from '../components/CustomMaterialIcon';
import FetchedDataSectionList from "../components/FetchedDataSectionList";
import Autolink from 'react-native-autolink';
import ThemeManager from "../utils/ThemeManager";
import DashboardItem from "../components/DashboardItem";
// import DATA from "../dashboard_data.json";


const ICON_AMICALE = require('../assets/amicale.png');
const NAME_AMICALE = 'Amicale INSA Toulouse';
const DATA_URL = "https://etud.insa-toulouse.fr/~amicale_app/dashboard/dashboard_data.json";

const SECTIONS_ID = [
    'dashboard',
    'news_feed'
];

const REFRESH_TIME = 1000 * 20; // Refresh every 20 seconds

const CARD_BORDER_RADIUS = 10;

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining the app's home screen
 */
export default class HomeScreen extends FetchedDataSectionList {

    onProxiwashClick: Function;
    onTutorInsaClick: Function;
    onMenuClick: Function;
    onProximoClick: Function;

    constructor() {
        super(DATA_URL, REFRESH_TIME);
        this.onProxiwashClick = this.onProxiwashClick.bind(this);
        this.onTutorInsaClick = this.onTutorInsaClick.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.onProximoClick = this.onProximoClick.bind(this);
    }

    onProxiwashClick() {
        this.props.navigation.navigate('Proxiwash');
    }

    onTutorInsaClick() {
        this.props.navigation.navigate('TutorInsaScreen');
    }

    onProximoClick() {
        this.props.navigation.navigate('Proximo');
    }

    onMenuClick() {
        this.props.navigation.navigate('SelfMenuScreen');
    }

    /**
     * Converts a dateString using Unix Timestamp to a formatted date
     * @param dateString {string} The Unix Timestamp representation of a date
     * @return {string} The formatted output date
     */
    static getFormattedDate(dateString: string) {
        let date = new Date(Number.parseInt(dateString) * 1000);
        return date.toLocaleString();
    }

    getHeaderTranslation() {
        return i18n.t("screens.home");
    }

    getUpdateToastTranslations() {
        return [i18n.t("homeScreen.listUpdated"), i18n.t("homeScreen.listUpdateFail")];
    }

    getKeyExtractor(item: Object) {
        return item !== undefined ? item.id : undefined;
    }

    createDataset(fetchedData: Object) {
        // fetchedData = DATA;
        let newsData = [];
        let dashboardData = [];
        if (fetchedData['news_feed'] !== undefined)
            newsData = fetchedData['news_feed']['data'];
        if (fetchedData['dashboard'] !== undefined)
            dashboardData = this.generateDashboardDataset(fetchedData['dashboard']);
        return [
            {
                title: '',
                data: dashboardData,
                extraData: super.state,
                keyExtractor: this.getKeyExtractor,
                id: SECTIONS_ID[0]
            },
            {
                title: i18n.t('homeScreen.newsFeed'),
                data: newsData,
                extraData: super.state,
                keyExtractor: this.getKeyExtractor,
                id: SECTIONS_ID[1]
            }
        ];
    }

    generateDashboardDataset(dashboardData: Object) {
        let dataset = [
            {
                id: 'event',
                content: undefined
            },
            {
                id: 'middle',
                content: [{}, {}]
            },
            {
                id: 'bottom',
                content: [{}, {}]
            },

        ];
        for (let [key, value] of Object.entries(dashboardData)) {
            switch (key) {
                case 'today_events':
                    dataset[0]['content'] = value;
                    break;
                case 'available_machines':
                    dataset[1]['content'][0] = {id: key, data: value};
                    break;
                case 'available_tutorials':
                    dataset[1]['content'][1] = {id: key, data: value};
                    break;
                case 'proximo_articles':
                    dataset[2]['content'][0] = {id: key, data: value};
                    break;
                case 'today_menu':
                    dataset[2]['content'][1] = {id: key, data: value};
                    break;

            }
        }
        return dataset
    }

    getRenderSectionHeader(title: string) {
        if (title === '') {
            return <View/>;
        } else {
            return (
                <View style={{
                    backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor
                }}>
                    <H1 style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 10,
                        marginBottom: 10
                    }}>{title}</H1>
                </View>
            );
        }
    }

    getDashboardItem(item: Object) {
        let content = item['content'];
        if (item['id'] === 'event')
            return this.getDashboardEventItem(content);
        else if (item['id'] === 'middle')
            return this.getDashboardMiddleItem(content);
        else
            return this.getDashboardBottomItem(content);
    }

    /**
     * Convert the date string given by in the event list json to a date object
     * @param dateString
     * @return {Date}
     */
    stringToDate(dateString: ?string): ?Date {
        let date = new Date();
        if (dateString === undefined || dateString === null)
            date = undefined;
        else if (dateString.split(' ').length > 1) {
            let timeStr = dateString.split(' ')[1];
            date.setHours(parseInt(timeStr.split(':')[0]), parseInt(timeStr.split(':')[1]), 0);
        } else
            date = undefined;
        return date;
    }

    /**
     * Get the time limit depending on the current day:
     * 17:30 for every day of the week except for thursday 11:30
     * 00:00 on weekends
     */
    getTodayEventTimeLimit() {
        let now = new Date();
        if (now.getDay() === 4) // Thursday
            now.setHours(11, 30, 0);
        else if (now.getDay() === 6 || now.getDay() === 0) // Weekend
            now.setHours(0, 0, 0);
        else
            now.setHours(17, 30, 0);
        return now;
    }

    /**
     * Get the duration (in milliseconds) of an event
     * @param event {Object}
     * @return {number} The number of milliseconds
     */
    getEventDuration(event: Object): number {
        let start = this.stringToDate(event['date_begin']);
        let end = this.stringToDate(event['date_end']);
        let duration = 0;
        if (start !== undefined && start !== null && end !== undefined && end !== null)
            duration = end - start;
        return duration;
    }

    /**
     * Get events starting after the limit
     *
     * @param events
     * @param limit
     * @return {Array<Object>}
     */
    getEventsAfterLimit(events: Object, limit: Date): Array<Object> {
        let validEvents = [];
        for (let event of events) {
            let startDate = this.stringToDate(event['date_begin']);
            if (startDate !== undefined && startDate !== null && startDate >= limit) {
                validEvents.push(event);
            }
        }
        return validEvents;
    }

    /**
     * Get the event with the longest duration in the given array.
     * If all events have the same duration, return the first in the array.
     * @param events
     */
    getLongestEvent(events: Array<Object>): Object {
        let longestEvent = events[0];
        let longestTime = 0;
        for (let event of events) {
            let time = this.getEventDuration(event);
            if (time > longestTime) {
                longestTime = time;
                longestEvent = event;
            }
        }
        return longestEvent;
    }

    /**
     * Get events that have not yet ended/started
     *
     * @param events
     */
    getFutureEvents(events: Array<Object>): Array<Object> {
        let validEvents = [];
        let now = new Date();
        for (let event of events) {
            let startDate = this.stringToDate(event['date_begin']);
            let endDate = this.stringToDate(event['date_end']);
            if (startDate !== undefined && startDate !== null) {
                if (startDate > now)
                    validEvents.push(event);
                else if (endDate !== undefined && endDate !== null) {
                    if (endDate > now || endDate < startDate) // Display event if it ends the following day
                        validEvents.push(event);
                }
            }
        }
        return validEvents;
    }

    /**
     *
     *
     * @param events
     * @return {Object}
     */
    getDisplayEvent(events: Array<Object>): Object {
        let displayEvent = undefined;
        if (events.length > 1) {
            let eventsAfterLimit = this.getEventsAfterLimit(events, this.getTodayEventTimeLimit());
            if (eventsAfterLimit.length > 0) {
                if (eventsAfterLimit.length === 1)
                    displayEvent = eventsAfterLimit[0];
                else
                    displayEvent = this.getLongestEvent(events);
            } else {
                displayEvent = this.getLongestEvent(events);
            }
        } else if (events.length === 1) {
            displayEvent = events[0];
        }
        return displayEvent;
    }


    clickAction(isAvailable: boolean, displayEvent: Object) {
        if (isAvailable)
            this.props.navigation.navigate('PlanningDisplayScreen', {data: displayEvent});
        else
            this.props.navigation.navigate('PlanningScreen');
    };


    getDashboardEventItem(content: Array<Object>) {
        let icon = 'calendar-range';
        let color = ThemeManager.getCurrentThemeVariables().planningColor;
        let title = i18n.t('homeScreen.dashboard.todayEventsTitle');
        let subtitle;
        let futureEvents = this.getFutureEvents(content);
        let isAvailable = futureEvents.length > 0;
        if (isAvailable) {
            subtitle =
                <Text>
                    <Text style={{fontWeight: "bold"}}>{futureEvents.length}</Text>
                    <Text>
                        {
                            futureEvents.length > 1 ?
                                i18n.t('homeScreen.dashboard.todayEventsSubtitlePlural') :
                                i18n.t('homeScreen.dashboard.todayEventsSubtitle')
                        }
                    </Text>
                </Text>;
        } else
            subtitle = i18n.t('homeScreen.dashboard.todayEventsSubtitleNA');

        let displayEvent = this.getDisplayEvent(futureEvents);

        return (
            <DashboardItem
                subtitle={subtitle}
                color={color}
                icon={icon}
                clickAction={this.clickAction.bind(this, isAvailable, displayEvent)}
                title={title}
                isAvailable={isAvailable}
                displayEvent={displayEvent}
            />
        );
    }


    getDashboardBottomItem(content: Array<Object>) {
        let proximoData = content[0]['data'];
        let menuData = content[1]['data'];
        let proximoIcon = 'shopping';
        let proximoColor = ThemeManager.getCurrentThemeVariables().proximoColor;
        let proximoTitle = i18n.t('homeScreen.dashboard.proximoTitle');
        let isProximoAvailable = parseInt(proximoData) > 0;
        let proximoSubtitle;
        if (isProximoAvailable) {
            proximoSubtitle =
                <Text>
                    <Text style={{fontWeight: "bold"}}>{proximoData}</Text>
                    <Text>
                        {
                            proximoData > 1 ?
                                i18n.t('homeScreen.dashboard.proximoSubtitlePlural') :
                                i18n.t('homeScreen.dashboard.proximoSubtitle')
                        }
                    </Text>
                </Text>;
        } else
            proximoSubtitle = i18n.t('homeScreen.dashboard.proximoSubtitleNA');


        let menuIcon = 'silverware-fork-knife';
        let menuColor = ThemeManager.getCurrentThemeVariables().menuColor;
        let menuTitle = i18n.t('homeScreen.dashboard.menuTitle');
        let isMenuAvailable = menuData.length > 0;
        let menuSubtitle;
        if (isMenuAvailable) {
            menuSubtitle = i18n.t('homeScreen.dashboard.menuSubtitle');
        } else
            menuSubtitle = i18n.t('homeScreen.dashboard.menuSubtitleNA');
        return (
            <View style={{
                flexDirection: 'row',
                marginLeft: 10,
                marginRight: 10,
            }}>
                <DashboardItem
                    isSquare={true}
                    subtitle={menuSubtitle}
                    color={menuColor}
                    icon={menuIcon}
                    clickAction={this.onMenuClick}
                    title={menuTitle}
                    isAvailable={isMenuAvailable}
                    isSquareLeft={true}/>
                <DashboardItem
                    isSquare={true}
                    subtitle={proximoSubtitle}
                    color={proximoColor}
                    icon={proximoIcon}
                    clickAction={this.onProximoClick}
                    title={proximoTitle}
                    isAvailable={isProximoAvailable}/>
            </View>
        );
    }


    getDashboardMiddleItem(content: Array<Object>) {
        let proxiwashData = content[0]['data'];
        let tutorinsaData = content[1]['data'];

        let proxiwashIcon = 'washing-machine';
        let proxiwashColor = ThemeManager.getCurrentThemeVariables().proxiwashColor;
        let proxiwashTitle = i18n.t('homeScreen.dashboard.proxiwashTitle');
        let proxiwashIsAvailable = parseInt(proxiwashData['dryers']) > 0 || parseInt(proxiwashData['washers']) > 0;
        let proxiwashSubtitle;
        let dryerColor = parseInt(proxiwashData['dryers']) > 0 ?
            ThemeManager.getCurrentThemeVariables().textColor :
            ThemeManager.getCurrentThemeVariables().listNoteColor;
        let washerColor = parseInt(proxiwashData['washers']) > 0 ?
            ThemeManager.getCurrentThemeVariables().textColor :
            ThemeManager.getCurrentThemeVariables().listNoteColor;
        let availableDryers = proxiwashData['dryers'];
        let availableWashers = proxiwashData['washers'];
        if (proxiwashIsAvailable) {
            proxiwashSubtitle =
                <Text>
                    <Text style={{
                        fontWeight: parseInt(proxiwashData['dryers']) > 0 ?
                            'bold' :
                            'normal',
                        color: dryerColor
                    }}>
                        {availableDryers}
                    </Text>
                    <Text>
                        {
                            availableDryers > 1 ?
                                i18n.t('homeScreen.dashboard.proxiwashSubtitle1Plural') :
                                i18n.t('homeScreen.dashboard.proxiwashSubtitle1')
                        }
                    </Text>
                    {"\n"}
                    <Text style={{
                        fontWeight: parseInt(proxiwashData['washers']) > 0 ?
                            'bold' :
                            'normal',
                        color: washerColor
                    }}>
                        {availableWashers}
                    </Text>
                    <Text>
                        {
                            availableWashers > 1 ?
                                i18n.t('homeScreen.dashboard.proxiwashSubtitle2Plural') :
                                i18n.t('homeScreen.dashboard.proxiwashSubtitle2')
                        }
                    </Text>
                </Text>;
        } else
            proxiwashSubtitle = i18n.t('homeScreen.dashboard.proxiwashSubtitleNA');

        let tutorinsaIcon = 'school';
        let tutorinsaColor = ThemeManager.getCurrentThemeVariables().tutorinsaColor;
        let tutorinsaTitle = 'Tutor\'INSA';
        let tutorinsaIsAvailable = tutorinsaData > 0;
        let tutorinsaSubtitle;
        if (tutorinsaIsAvailable) {
            tutorinsaSubtitle =
                <Text>
                    <Text style={{fontWeight: "bold"}}>{tutorinsaData}</Text>
                    <Text>
                        {
                            tutorinsaData > 1 ?
                                i18n.t('homeScreen.dashboard.tutorinsaSubtitlePlural') :
                                i18n.t('homeScreen.dashboard.tutorinsaSubtitle')
                        }
                    </Text>
                </Text>;
        } else
            tutorinsaSubtitle = i18n.t('homeScreen.dashboard.tutorinsaSubtitleNA');

        return (
            <View style={{
                flexDirection: 'row',
                marginLeft: 10,
                marginRight: 10,
            }}>
                <DashboardItem
                    isSquare={true}
                    subtitle={proxiwashSubtitle}
                    color={proxiwashColor}
                    icon={proxiwashIcon}
                    clickAction={this.onProxiwashClick}
                    title={proxiwashTitle}
                    isAvailable={proxiwashIsAvailable}
                    isSquareLeft={true}/>
                <DashboardItem
                    isSquare={true}
                    subtitle={tutorinsaSubtitle}
                    color={tutorinsaColor}
                    icon={tutorinsaIcon}
                    clickAction={this.onTutorInsaClick}
                    title={tutorinsaTitle}
                    isAvailable={tutorinsaIsAvailable}/>
            </View>
        );
    }


    getRenderItem(item: Object, section: Object) {
        return (
            section['id'] === SECTIONS_ID[0] ? this.getDashboardItem(item) :
                <Card style={{
                    flex: 0,
                    marginLeft: 10,
                    marginRight: 10,
                    borderRadius: CARD_BORDER_RADIUS,
                }}>
                    <CardItem style={{
                        backgroundColor: 'transparent'
                    }}>
                        <Left>
                            <Thumbnail source={ICON_AMICALE} square/>
                            <Body>
                                <Text>{NAME_AMICALE}</Text>
                                <Text note>{HomeScreen.getFormattedDate(item.created_time)}</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem style={{
                        backgroundColor: 'transparent'
                    }}>
                        <Body>
                            {item.full_picture !== '' && item.full_picture !== undefined ?
                                <TouchableOpacity onPress={openWebLink.bind(null, item.full_picture)}
                                                  style={{width: '100%', height: 250, marginBottom: 5}}>
                                    <Image source={{uri: item.full_picture}}
                                           style={{flex: 1, resizeMode: "contain"}}
                                           resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                : <View/>}
                            {item.message !== undefined ?
                                <Autolink
                                    text={item.message}
                                    hashtag="facebook"
                                    style={{color: ThemeManager.getCurrentThemeVariables().textColor}}
                                /> : <View/>
                            }
                        </Body>
                    </CardItem>
                    <CardItem style={{
                        backgroundColor: 'transparent'
                    }}>
                        <Left>
                            <Button transparent
                                    onPress={openWebLink.bind(null, item.permalink_url)}>
                                <CustomMaterialIcon
                                    icon="facebook"
                                    color="#57aeff"
                                    width={20}/>
                                <Text>En savoir plus</Text>
                            </Button>
                        </Left>
                    </CardItem>
                </Card>
        );
    }
}
