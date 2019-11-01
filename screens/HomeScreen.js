// @flow

import * as React from 'react';
import {Image, Linking, TouchableOpacity, View} from 'react-native';
import {Body, Button, Card, CardItem, Left, Text, Thumbnail, H1, H3} from 'native-base';
import i18n from "i18n-js";
import CustomMaterialIcon from '../components/CustomMaterialIcon';
import FetchedDataSectionList from "../components/FetchedDataSectionList";
import Autolink from 'react-native-autolink';
import ThemeManager from "../utils/ThemeManager";
import PlatformTouchable from "react-native-platform-touchable";
import HTML from 'react-native-render-html';
import {LinearGradient} from 'expo-linear-gradient';


const ICON_AMICALE = require('../assets/amicale.png');
const NAME_AMICALE = 'Amicale INSA Toulouse';
const DATA_URL = "https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/dashboard/dashboard_data.json";

const SECTIONS_ID = [
    'dashboard',
    'news_feed'
];

const REFRESH_TIME = 1000 * 20; // Refresh every 20 seconds


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

    constructor() {
        super(DATA_URL, REFRESH_TIME);
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
                id: 'top',
                content: undefined
            },
            {
                id: 'middle',
                content: [{}, {}]
            },
            {
                id: 'bottom',
                content: undefined
            },

        ];
        for (let [key, value] of Object.entries(dashboardData)) {
            switch (key) {
                case 'today_events':
                    dataset[0]['content'] = value;
                    break;
                case 'proximo_articles':
                    dataset[1]['content'][0] = {id: key, data: value};
                    break;
                case 'today_menu':
                    dataset[1]['content'][1] = {id: key, data: value};
                    break;
                case 'available_machines':
                    dataset[2]['content'] = value;
                    break;
            }
        }
        return dataset
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
        if (item['id'] === 'top')
            return this.getDashboardTopItem(content);
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

    padStr(i: number) {
        return (i < 10) ? "0" + i : "" + i;
    }

    getFormattedEventTime(event: Object): string {
        let formattedStr = '';
        let startDate = this.stringToDate(event['date_begin']);
        let endDate = this.stringToDate(event['date_end']);
        if (startDate !== undefined && startDate !== null && endDate !== undefined && endDate !== null)
            formattedStr = this.padStr(startDate.getHours()) + ':' + this.padStr(startDate.getMinutes()) +
                ' - ' + this.padStr(endDate.getHours()) + ':' + this.padStr(endDate.getMinutes());
        else if (startDate !== undefined && startDate !== null)
            formattedStr = this.padStr(startDate.getHours()) + ':' + this.padStr(startDate.getMinutes());
        return formattedStr
    }


    getDashboardTopItem(content: Array<Object>) {
        let icon = 'calendar-range';
        let color = ThemeManager.getCurrentThemeVariables().planningColor;
        let title = i18n.t('homeScreen.dashboard.todayEventsTitle');
        let subtitle = '';
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
        let clickAction = () => this.props.navigation.navigate('Planning');

        let displayEvent = this.getDisplayEvent(futureEvents);

        return (
            <Card style={{
                flex: 0,
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                borderRadius: 20,
                backgroundColor: ThemeManager.getCurrentThemeVariables().cardDefaultBg,
                overflow: 'hidden',
            }}>
                <PlatformTouchable
                    onPress={clickAction}
                    style={{
                        zIndex: 100,
                    }}
                >
                    <View>
                        <CardItem style={{
                            backgroundColor: 'transparent',
                        }}>
                            <Left>
                                <CustomMaterialIcon
                                    icon={icon}
                                    color={
                                        isAvailable ?
                                            color :
                                            ThemeManager.getCurrentThemeVariables().textDisabledColor
                                    }
                                    fontSize={40}
                                    width={40}/>
                                <Body>
                                    <H3 style={{
                                        color: isAvailable ?
                                            ThemeManager.getCurrentThemeVariables().textColor :
                                            ThemeManager.getCurrentThemeVariables().listNoteColor
                                    }}>
                                        {title}
                                    </H3>
                                    <Text style={{
                                        color: isAvailable ?
                                            ThemeManager.getCurrentThemeVariables().listNoteColor :
                                            ThemeManager.getCurrentThemeVariables().textDisabledColor
                                    }}>
                                        {subtitle}
                                    </Text>
                                </Body>
                            </Left>
                        </CardItem>
                        {displayEvent !== undefined ?
                            <View>
                                <CardItem style={{
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    backgroundColor: 'transparent',
                                }}>
                                    <Left>
                                        {displayEvent['logo'] !== '' && displayEvent['logo'] !== null ?
                                            <Thumbnail source={{uri: displayEvent['logo']}} square/> :
                                            <View/>}
                                        <Body>
                                            <Text>{displayEvent['title']}</Text>
                                            <Text note>{this.getFormattedEventTime(displayEvent)}</Text>
                                        </Body>
                                    </Left>
                                </CardItem>
                                <CardItem style={{
                                    borderRadius: 30,
                                    backgroundColor: 'transparent',
                                }}>
                                    <Body style={{
                                        height: displayEvent['description'].length > 50 ? 70 : 20,
                                        overflow: 'hidden',
                                    }}>
                                        <HTML html={"<div>" + displayEvent['description'] + "</div>"}
                                              tagsStyles={{
                                                  p: {
                                                      color: ThemeManager.getCurrentThemeVariables().textColor,
                                                      fontSize: ThemeManager.getCurrentThemeVariables().fontSizeBase,
                                                  },
                                                  div: {color: ThemeManager.getCurrentThemeVariables().textColor},
                                              }}
                                              onLinkPress={(event, link) => openWebLink(link)}/>
                                        <LinearGradient
                                            colors={['transparent', ThemeManager.getCurrentThemeVariables().cardDefaultBg]}
                                            end={[0, 0.6]}
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: 60,
                                                bottom: 0,
                                            }}>
                                            <View style={{
                                                marginLeft: 'auto',
                                                marginTop: 'auto',
                                                flexDirection: 'row'
                                            }}>
                                                <Text style={{
                                                    marginTop: 'auto',
                                                    marginBottom: 'auto',
                                                    padding: 0,
                                                }}>
                                                    Click to see more
                                                </Text>
                                                <CustomMaterialIcon icon={'chevron-right'}/>
                                            </View>
                                        </LinearGradient>
                                    </Body>
                                </CardItem>
                            </View> :
                            <View/>}
                    </View>
                </PlatformTouchable>
            </Card>
        );
    }

    getSquareDashboardItem(isAvailable: boolean, icon: string, color: string, title: string, subtitle: React.Node, clickAction: Function, isLeftElement: boolean) {
        return (
            <Card style={{
                flex: 0,
                width: '48%',
                marginLeft: 0,
                marginRight: isLeftElement ? '4%' : 0,
                borderRadius: 20,
                backgroundColor: ThemeManager.getCurrentThemeVariables().cardDefaultBg,
                overflow: 'hidden',
            }}>
                <PlatformTouchable
                    onPress={clickAction}
                    style={{
                        zIndex: 100,
                        minHeight: 150,
                    }}
                >
                    <CardItem style={{
                        backgroundColor: 'transparent'
                    }}>
                        <Body>
                            <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                <CustomMaterialIcon
                                    icon={icon}
                                    color={
                                        isAvailable ?
                                            color :
                                            ThemeManager.getCurrentThemeVariables().textDisabledColor
                                    }
                                    fontSize={60}
                                    width={60}/>
                            </View>
                            <H3 style={{
                                color: isAvailable ?
                                    ThemeManager.getCurrentThemeVariables().textColor :
                                    ThemeManager.getCurrentThemeVariables().listNoteColor,
                                textAlign: 'center',
                                width: '100%'
                            }}>
                                {title}
                            </H3>
                            <Text style={{
                                color: isAvailable ?
                                    ThemeManager.getCurrentThemeVariables().listNoteColor :
                                    ThemeManager.getCurrentThemeVariables().textDisabledColor,
                                textAlign: 'center',
                                width: '100%'
                            }}>
                                {subtitle}
                            </Text>
                        </Body>
                    </CardItem>
                </PlatformTouchable>
            </Card>
        );
    }

    getDashboardMiddleItem(content: Object) {
        let proximoData = content[0]['data'];
        let menuData = content[1]['data'];
        let proximoIcon = 'shopping';
        let proximoColor = ThemeManager.getCurrentThemeVariables().proximoColor;
        let proximoTitle = i18n.t('homeScreen.dashboard.proximoTitle');
        let isProximoAvailable = parseInt(proximoData) > 0;
        let proximoSubtitle = '';
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
        let proximoClickAction = () => this.props.navigation.navigate('Proximo');


        let menuIcon = 'silverware-fork-knife';
        let menuColor = ThemeManager.getCurrentThemeVariables().menuColor;
        let menuTitle = i18n.t('homeScreen.dashboard.menuTitle');
        let isMenuAvailable = menuData.length > 0;
        let menuSubtitle = '';
        if (isMenuAvailable) {
            menuSubtitle = i18n.t('homeScreen.dashboard.menuSubtitle');
        } else
            menuSubtitle = i18n.t('homeScreen.dashboard.menuSubtitleNA');
        let menuClickAction = () => this.props.navigation.navigate('SelfMenuScreen');
        return (
            <View style={{
                flexDirection: 'row',
                marginLeft: 10,
                marginRight: 10,
            }}>
                {this.getSquareDashboardItem(isProximoAvailable, proximoIcon, proximoColor, proximoTitle, proximoSubtitle, proximoClickAction, true)}
                {this.getSquareDashboardItem(isMenuAvailable, menuIcon, menuColor, menuTitle, menuSubtitle, menuClickAction, false)}
            </View>
        );
    }


    getDashboardBottomItem(content: Object) {
        let icon = 'washing-machine';
        let color = ThemeManager.getCurrentThemeVariables().proxiwashColor;
        let title = i18n.t('homeScreen.dashboard.proxiwashTitle');
        let isAvailable = parseInt(content['dryers']) > 0 || parseInt(content['washers']) > 0;
        let subtitle;
        let dryerColor = parseInt(content['dryers']) > 0 ?
            ThemeManager.getCurrentThemeVariables().textColor :
            ThemeManager.getCurrentThemeVariables().listNoteColor;
        let washerColor = parseInt(content['washers']) > 0 ?
            ThemeManager.getCurrentThemeVariables().textColor :
            ThemeManager.getCurrentThemeVariables().listNoteColor;
        let availableDryers = content['dryers'];
        let availableWashers = content['washers'];
        if (isAvailable) {
            subtitle =
                <Text>
                    <Text style={{
                        fontWeight: parseInt(content['dryers']) > 0 ?
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
                    <Text style={{
                        fontWeight: parseInt(content['washers']) > 0 ?
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
            subtitle = i18n.t('homeScreen.dashboard.proxiwashSubtitleNA');
        let clickAction = () => this.props.navigation.navigate('Proxiwash');
        return (
            <Card style={{
                flex: 0,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 20,
                backgroundColor: ThemeManager.getCurrentThemeVariables().cardDefaultBg,
                overflow: 'hidden',
            }}>
                <PlatformTouchable
                    onPress={clickAction}
                    style={{
                        zIndex: 100,
                    }}
                >
                    <CardItem style={{
                        backgroundColor: 'transparent'
                    }}>
                        <Left>
                            <CustomMaterialIcon
                                icon={icon}
                                color={
                                    isAvailable ?
                                        color :
                                        ThemeManager.getCurrentThemeVariables().textDisabledColor
                                }
                                fontSize={40}
                                width={40}/>
                            <Body>
                                <H3 style={{
                                    color: isAvailable ?
                                        ThemeManager.getCurrentThemeVariables().textColor :
                                        ThemeManager.getCurrentThemeVariables().listNoteColor
                                }}>
                                    {title}
                                </H3>
                                <Text style={{
                                    color: isAvailable ?
                                        ThemeManager.getCurrentThemeVariables().listNoteColor :
                                        ThemeManager.getCurrentThemeVariables().textDisabledColor
                                }}>
                                    {subtitle}
                                </Text>
                            </Body>
                        </Left>
                    </CardItem>
                </PlatformTouchable>
            </Card>
        );
    }


    getRenderItem(item: Object, section: Object, data: Object) {
        if (section['id'] === SECTIONS_ID[0]) {
            return this.getDashboardItem(item);
        } else {
            return (
                <Card style={{
                    flex: 0,
                    marginLeft: 10,
                    marginRight: 10
                }}>
                    <CardItem>
                        <Left>
                            <Thumbnail source={ICON_AMICALE} square/>
                            <Body>
                                <Text>{NAME_AMICALE}</Text>
                                <Text note>{HomeScreen.getFormattedDate(item.created_time)}</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        <Body>
                            {item.full_picture !== '' && item.full_picture !== undefined ?
                                <TouchableOpacity onPress={() => openWebLink(item.full_picture)}
                                                  style={{width: '100%', height: 250}}>
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
                    <CardItem>
                        <Left>
                            <Button transparent
                                    onPress={() => openWebLink(item.permalink_url)}>
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

}
