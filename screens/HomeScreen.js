// @flow

import * as React from 'react';
import {Image, Linking, TouchableOpacity, View} from 'react-native';
import {Body, Button, Card, CardItem, Left, Right, Text, Thumbnail, H1, H3, Content} from 'native-base';
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
        super(DATA_URL, 0);
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
                content: {}
            },
            {
                id: 'middle',
                content: [{}, {}]
            },
            {
                id: 'bottom',
                content: {}
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

    getDisplayEvent(events: Array<Object>): Object {
        let displayEvent = undefined;

        if (events.length === 1) {
            displayEvent = this.getEventDisplayData(events[0]);
        } else {
            for (let event of events) {
                if (event['date_begin'] === undefined || event['date_end'] === undefined)
                    continue;

                let date_begin = event['date_begin'].split(' ')[1];
                let date_end = event['date_end'].split(' ')[1];
                let startDate = new Date();
                let endDate = new Date();
                let limit = new Date();
                let now = new Date();
                startDate.setHours(parseInt(date_begin.split(':')[0]), date_begin.split(':')[1], 0);
                endDate.setHours(parseInt(date_end.split(':')[0]), date_end.split(':')[1], 0);
                limit.setHours(18, 0, 0); // Only display events after 18:00 as these are the most important
                if (limit.getTime() < startDate.getTime() && now.getTime() < endDate.getTime()) {
                    displayEvent = this.getEventDisplayData(event);
                    break;
                }
            }
        }
        return displayEvent;
    }

    getEventDisplayData(event: Object): Object {
        let date = '';
        if (event['date_begin'].split(' ').length > 2) {
            date = event['date_begin'].split(' ')[1];
            date = date.split(':')[0] + ':' + date.split(':')[1];
        }
        return {
            logo: event['logo'],
            title: event['title'],
            date: date,
            description: event['description'],
        }
    }


    getDashboardTopItem(content: Array<Object>) {
        let icon = 'calendar-range';
        let color = ThemeManager.getCurrentThemeVariables().planningColor;
        let title = i18n.t('homeScreen.dashboard.todayEventsTitle');
        let isAvailable = content.length > 0;
        let subtitle = '';
        if (isAvailable) {
            subtitle =
                <Text>
                    <Text style={{fontWeight: "bold"}}>{content.length}</Text>
                    <Text>{i18n.t('homeScreen.dashboard.todayEventsSubtitle')}</Text>
                </Text>;
        } else
            subtitle = i18n.t('homeScreen.dashboard.todayEventsSubtitleNA');
        let clickAction = () => this.props.navigation.navigate('Planning');

        let displayEvent = this.getDisplayEvent(content);

        return (
            <Card style={{
                flex: 0,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 30,
                backgroundColor: ThemeManager.getCurrentThemeVariables().cardDefaultBg
            }}>
                <PlatformTouchable
                    onPress={clickAction}
                    style={{
                        zIndex: 100,
                        borderRadius: 30
                    }}
                >
                    <View>
                        <CardItem style={{
                            borderRadius: 30,
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
                                    paddingBottom: 0
                                }}>
                                    <Left>
                                        {displayEvent['logo'] !== '' && displayEvent['logo'] !== null ?
                                            <Thumbnail source={{uri: displayEvent['logo']}} square/> :
                                            <View/>}
                                        <Body>
                                            <Text>{displayEvent['title']}</Text>
                                            <Text note>{displayEvent['date']}</Text>
                                        </Body>
                                    </Left>
                                </CardItem>
                                <CardItem style={{
                                    borderRadius: 30,
                                    backgroundColor: 'transparent',
                                }}>
                                    <Body style={{
                                        height: 70,
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
                                                bottom: 0
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

    getSquareDashboardItem(isAvailable: boolean, icon: string, color: string, title: string, subtitle: string, clickAction: Function, isLeftElement: boolean) {
        return (
            <Card style={{
                flex: 0,
                width: '48%',
                marginLeft: 0,
                marginRight: isLeftElement ? '4%' : 0,
                borderRadius: 30,
                backgroundColor: ThemeManager.getCurrentThemeVariables().cardDefaultBg
            }}>
                <PlatformTouchable
                    onPress={clickAction}
                    style={{
                        zIndex: 100,
                        borderRadius: 30
                    }}
                >
                    <CardItem style={{
                        borderRadius: 30,
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
                    <Text>{i18n.t('homeScreen.dashboard.proximoSubtitle')}</Text>
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
        if (isAvailable) {
            subtitle =
                <Text>
                    <Text style={{
                        fontWeight: parseInt(content['dryers']) > 0 ?
                            'bold' :
                            'normal',
                        color: parseInt(content['dryers']) > 0 ?
                            ThemeManager.getCurrentThemeVariables().textColor :
                            ThemeManager.getCurrentThemeVariables().listNoteColor
                    }}>
                        {content['dryers']}
                    </Text>
                    <Text>{i18n.t('homeScreen.dashboard.proxiwashSubtitle1')}</Text>
                    <Text style={{
                        fontWeight: parseInt(content['washers']) > 0 ?
                            'bold' :
                            'normal',
                        color: parseInt(content['washers']) > 0 ?
                            ThemeManager.getCurrentThemeVariables().textColor :
                            ThemeManager.getCurrentThemeVariables().listNoteColor
                    }}>
                        {content['washers']}
                    </Text>
                    <Text>{i18n.t('homeScreen.dashboard.proxiwashSubtitle2')}</Text>
                </Text>;
        } else
            subtitle = i18n.t('homeScreen.dashboard.proxiwashSubtitleNA');
        let clickAction = () => this.props.navigation.navigate('Proxiwash');
        return (
            <Card style={{
                flex: 0,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 50,
                backgroundColor: ThemeManager.getCurrentThemeVariables().cardDefaultBg
            }}>
                <PlatformTouchable
                    onPress={clickAction}
                    style={{
                        zIndex: 100,
                        borderRadius: 50
                    }}
                >
                    <CardItem style={{
                        borderRadius: 50,
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
