// @flow

import * as React from 'react';
import {Image, Linking, TouchableOpacity, View} from 'react-native';
import {Body, Button, Card, CardItem, Left, Right, Text, Thumbnail, H1, H3} from 'native-base';
import i18n from "i18n-js";
import CustomMaterialIcon from '../components/CustomMaterialIcon';
import FetchedDataSectionList from "../components/FetchedDataSectionList";
import Autolink from 'react-native-autolink';
import ThemeManager from "../utils/ThemeManager";
import PlatformTouchable from "react-native-platform-touchable";

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
        let dataset = [];
        for (let [key, value] of Object.entries(dashboardData)) {
            dataset.push(
                {
                    id: key,
                    data: value
                }
            )
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

    getDashboardItemData(item: Object) {
        let icon = '';
        let title = '';
        let subtitle;
        let clickAction;
        let isAvailable = false;
        let color = ThemeManager.getCurrentThemeVariables().disabledTextColor;
        switch (item['id']) {
            case 'today_events':
                icon = 'calendar-range';
                color = ThemeManager.getCurrentThemeVariables().planningColor;
                title = i18n.t('homeScreen.dashboard.todayEventsTitle');
                isAvailable = item['data'].length > 0;
                if (isAvailable) {
                    subtitle =
                        <Text>
                            <Text style={{fontWeight: "bold"}}>{item['data'].length}</Text>
                            <Text>{i18n.t('homeScreen.dashboard.todayEventsSubtitle')}</Text>
                        </Text>;
                } else
                    subtitle = i18n.t('homeScreen.dashboard.todayEventsSubtitleNA');
                clickAction = () => this.props.navigation.navigate('Planning');
                break;
            case 'proximo_articles':
                icon = 'shopping';
                color = ThemeManager.getCurrentThemeVariables().proximoColor;
                title = i18n.t('homeScreen.dashboard.proximoTitle');
                isAvailable = parseInt(item['data']) > 0;
                if (isAvailable) {
                    subtitle =
                        <Text>
                            <Text style={{fontWeight: "bold"}}>{item['data']}</Text>
                            <Text>{i18n.t('homeScreen.dashboard.proximoSubtitle')}</Text>
                        </Text>;
                } else
                    subtitle = i18n.t('homeScreen.dashboard.proximoSubtitleNA');
                clickAction = () => this.props.navigation.navigate('Proximo');
                break;
            case 'available_machines':
                icon = 'washing-machine';
                color = ThemeManager.getCurrentThemeVariables().proxiwashColor;
                title = i18n.t('homeScreen.dashboard.proxiwashTitle');
                isAvailable = parseInt(item['data']['dryers']) > 0 || parseInt(item['data']['washers']) > 0;
                if (isAvailable) {
                    subtitle =
                        <Text>
                            <Text style={{
                                fontWeight: parseInt(item['data']['dryers']) > 0 ?
                                    'bold' :
                                    'normal',
                                color: parseInt(item['data']['dryers']) > 0 ?
                                    ThemeManager.getCurrentThemeVariables().textColor :
                                    ThemeManager.getCurrentThemeVariables().listNoteColor
                            }}>
                                {item['data']['dryers']}
                            </Text>
                            <Text>{i18n.t('homeScreen.dashboard.proxiwashSubtitle1')}</Text>
                            <Text style={{
                                fontWeight: parseInt(item['data']['washers']) > 0 ?
                                    'bold' :
                                    'normal',
                                color: parseInt(item['data']['washers']) > 0 ?
                                    ThemeManager.getCurrentThemeVariables().textColor :
                                    ThemeManager.getCurrentThemeVariables().listNoteColor
                            }}>
                                {item['data']['washers']}
                            </Text>
                            <Text>{i18n.t('homeScreen.dashboard.proxiwashSubtitle2')}</Text>
                        </Text>;
                } else
                    subtitle = i18n.t('homeScreen.dashboard.proxiwashSubtitleNA');
                clickAction = () => this.props.navigation.navigate('Proxiwash');
                break;
            case 'today_menu':
                icon = 'silverware-fork-knife';
                color = ThemeManager.getCurrentThemeVariables().menuColor;
                title = i18n.t('homeScreen.dashboard.menuTitle');
                isAvailable = item['data'].length > 0;
                if (isAvailable) {
                    subtitle = i18n.t('homeScreen.dashboard.menuSubtitle');
                } else
                    subtitle = i18n.t('homeScreen.dashboard.menuSubtitleNA');
                clickAction = () => this.props.navigation.navigate('SelfMenuScreen');
                break;
        }
        return {
            icon: icon,
            color: color,
            title: title,
            subtitle: subtitle,
            clickAction: clickAction,
            isAvailable: isAvailable
        }
    }


    getRenderItem(item: Object, section: Object, data: Object) {
        if (section['id'] === SECTIONS_ID[0]) {
            let itemData = this.getDashboardItemData(item);
            return (
                <Card style={{
                    flex: 0,
                    marginLeft: 10,
                    marginRight: 10,
                    borderRadius: 50,
                    backgroundColor: ThemeManager.getCurrentThemeVariables().cardDefaultBg
                }}>
                    <PlatformTouchable
                        onPress={itemData['clickAction']}
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
                                    icon={itemData['icon']}
                                    color={
                                        itemData['isAvailable'] ?
                                            itemData['color'] :
                                            ThemeManager.getCurrentThemeVariables().textDisabledColor
                                    }
                                    fontSize={40}
                                    width={40}/>
                                <Body>
                                    <H3 style={{
                                        color: itemData['isAvailable'] ?
                                            ThemeManager.getCurrentThemeVariables().textColor :
                                            ThemeManager.getCurrentThemeVariables().listNoteColor
                                    }}>
                                        {itemData['title']}
                                    </H3>
                                    <Text style={{
                                        color: itemData['isAvailable'] ?
                                            ThemeManager.getCurrentThemeVariables().listNoteColor :
                                            ThemeManager.getCurrentThemeVariables().textDisabledColor
                                    }}>
                                        {itemData['subtitle']}
                                    </Text>
                                </Body>
                            </Left>
                        </CardItem>
                    </PlatformTouchable>
                </Card>
            );
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
