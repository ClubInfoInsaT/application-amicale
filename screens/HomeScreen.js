// @flow

import * as React from 'react';
import {View} from 'react-native';
import i18n from "i18n-js";
import DashboardItem from "../components/Home/EventDashboardItem";
import WebSectionList from "../components/Lists/WebSectionList";
import {Portal, Text, withTheme} from 'react-native-paper';
import FeedItem from "../components/Home/FeedItem";
import SquareDashboardItem from "../components/Home/SquareDashboardItem";
import PreviewEventDashboardItem from "../components/Home/PreviewEventDashboardItem";
import {stringToDate} from "../utils/Planning";
import {openBrowser} from "../utils/WebBrowser";
import ImageView from "react-native-image-viewing";
// import DATA from "../dashboard_data.json";


const NAME_AMICALE = 'Amicale INSA Toulouse';
const DATA_URL = "https://etud.insa-toulouse.fr/~amicale_app/dashboard/dashboard_data.json";

const SECTIONS_ID = [
    'dashboard',
    'news_feed'
];

const REFRESH_TIME = 1000 * 20; // Refresh every 20 seconds

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {
    imageModalVisible: boolean,
    imageList: Array<Object>,
}

/**
 * Class defining the app's home screen
 */
class HomeScreen extends React.Component<Props, State> {

    onProxiwashClick: Function;
    onTutorInsaClick: Function;
    onMenuClick: Function;
    onProximoClick: Function;
    getRenderItem: Function;
    createDataset: Function;

    colors: Object;

    state = {
        imageModalVisible: false,
        imageList: [],
    };

    constructor(props) {
        super(props);
        this.onProxiwashClick = this.onProxiwashClick.bind(this);
        this.onTutorInsaClick = this.onTutorInsaClick.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.onProximoClick = this.onProximoClick.bind(this);
        this.getRenderItem = this.getRenderItem.bind(this);
        this.createDataset = this.createDataset.bind(this);
        this.colors = props.theme.colors;
    }

    /**
     * Converts a dateString using Unix Timestamp to a formatted date
     *
     * @param dateString {string} The Unix Timestamp representation of a date
     * @return {string} The formatted output date
     */
    static getFormattedDate(dateString: string) {
        let date = new Date(Number.parseInt(dateString) * 1000);
        return date.toLocaleString();
    }

    onProxiwashClick() {
        this.props.navigation.navigate('Proxiwash');
    }

    onTutorInsaClick() {
        openBrowser("https://www.etud.insa-toulouse.fr/~tutorinsa/", this.colors.primary);
    }

    onProximoClick() {
        this.props.navigation.navigate('Proximo');
    }

    onMenuClick() {
        this.props.navigation.navigate('SelfMenuScreen');
    }

    /**
     * Extract a key for the given item
     *
     * @param item The item to extract the key from
     * @return {*} The extracted key
     */
    getKeyExtractor(item: Object) {
        return item !== undefined ? item.id : undefined;
    }

    /**
     * Creates the dataset to be used in the FlatList
     *
     * @param fetchedData
     * @return {*}
     */
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

    /**
     * Generates the dataset associated to the dashboard to be displayed in the FlatList as a section
     *
     * @param dashboardData
     * @return {*}
     */
    generateDashboardDataset(dashboardData: Object) {
        let dataset = [

            {
                id: 'middle',
                content: []
            },
            {
                id: 'event',
                content: undefined
            },
        ];
        for (let [key, value] of Object.entries(dashboardData)) {
            switch (key) {
                case 'today_events':
                    dataset[1]['content'] = value;
                    break;
                case 'available_machines':
                    dataset[0]['content'][0] = {id: key, data: value};
                    break;
                case 'available_tutorials':
                    dataset[0]['content'][1] = {id: key, data: value};
                    break;
                case 'proximo_articles':
                    dataset[0]['content'][2] = {id: key, data: value};
                    break;
                case 'today_menu':
                    dataset[0]['content'][3] = {id: key, data: value};
                    break;

            }
        }
        return dataset
    }

    /**
     * Gets a dashboard item
     *
     * @param item The item to display
     * @return {*}
     */
    getDashboardItem(item: Object) {
        let content = item['content'];
        if (item['id'] === 'event')
            return this.getDashboardEventItem(content);
        else if (item['id'] === 'middle')
            return this.getDashboardMiddleItem(content);
    }

    /**
     * Gets the time limit depending on the current day:
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
     * Gets the duration (in milliseconds) of an event
     *
     * @param event {Object}
     * @return {number} The number of milliseconds
     */
    getEventDuration(event: Object): number {
        let start = stringToDate(event['date_begin']);
        let end = stringToDate(event['date_end']);
        let duration = 0;
        if (start !== undefined && start !== null && end !== undefined && end !== null)
            duration = end - start;
        return duration;
    }

    /**
     * Gets events starting after the limit
     *
     * @param events
     * @param limit
     * @return {Array<Object>}
     */
    getEventsAfterLimit(events: Object, limit: Date): Array<Object> {
        let validEvents = [];
        for (let event of events) {
            let startDate = stringToDate(event['date_begin']);
            if (startDate !== undefined && startDate !== null && startDate >= limit) {
                validEvents.push(event);
            }
        }
        return validEvents;
    }

    /**
     * Gets the event with the longest duration in the given array.
     * If all events have the same duration, return the first in the array.
     *
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
     * Gets events that have not yet ended/started
     *
     * @param events
     */
    getFutureEvents(events: Array<Object>): Array<Object> {
        let validEvents = [];
        let now = new Date();
        for (let event of events) {
            let startDate = stringToDate(event['date_begin']);
            let endDate = stringToDate(event['date_end']);
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
     * Gets the event to display in the preview
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

    /**
     * Gets the event render item.
     * If a preview is available, it will be rendered inside
     *
     * @param content
     * @return {*}
     */
    getDashboardEventItem(content: Array<Object>) {
        let icon = 'calendar-range';
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
        const clickContainerAction = () => this.props.navigation.navigate('Planning');
        const clickPreviewAction = () => this.props.navigation.navigate('PlanningDisplayScreen', {data: displayEvent});

        return (
            <DashboardItem
                {...this.props}
                subtitle={subtitle}
                icon={icon}
                clickAction={clickContainerAction}
                title={title}
                isAvailable={isAvailable}
            >
                <PreviewEventDashboardItem
                    {...this.props}
                    event={displayEvent}
                    clickAction={clickPreviewAction}
                />
            </DashboardItem>
        );
    }

    /**
     * Gets a classic dashboard item.
     *
     * @param content
     * @return {*}
     */
    getDashboardMiddleItem(content: Array<Object>) {
        let proxiwashData = content[0]['data'];
        let tutorinsaData = content[1]['data'];
        let proximoData = content[2]['data'];
        let menuData = content[3]['data'];
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
                margin: 10,
            }}>
                <SquareDashboardItem
                    color={this.colors.proxiwashColor}
                    icon={'washing-machine'}
                    clickAction={this.onProxiwashClick}
                    isAvailable={parseInt(proxiwashData['washers']) > 0}
                    badgeNumber={proxiwashData['washers']}
                />
                <SquareDashboardItem
                    color={this.colors.proxiwashColor}
                    icon={'tumble-dryer'}
                    clickAction={this.onProxiwashClick}
                    isAvailable={parseInt(proxiwashData['dryers']) > 0}
                    badgeNumber={proxiwashData['dryers']}
                />
                <SquareDashboardItem
                    color={this.colors.tutorinsaColor}
                    icon={'school'}
                    clickAction={this.onTutorInsaClick}
                    isAvailable={tutorinsaData > 0}
                    badgeNumber={tutorinsaData}
                />
                <SquareDashboardItem
                    color={this.colors.proximoColor}
                    icon={'shopping'}
                    clickAction={this.onProximoClick}
                    isAvailable={parseInt(proximoData) > 0}
                    badgeNumber={parseInt(proximoData)}
                />
                <SquareDashboardItem
                    color={this.colors.menuColor}
                    icon={'silverware-fork-knife'}
                    clickAction={this.onMenuClick}
                    isAvailable={menuData.length > 0}
                    badgeNumber={0}
                />
            </View>
        );
    }

    openLink(link: string) {
        openBrowser(link, this.colors.primary);
    }

    showImageModal(imageList) {
        this.setState({
            imageModalVisible: true,
            imageList: imageList,
        });
    };

    hideImageModal = () => {
        this.setState({imageModalVisible: false});
    };


    /**
     * Gets a render item for the given feed object
     *
     * @param item The feed item to display
     * @return {*}
     */
    getFeedItem(item: Object) {
        const onOutLinkPress = this.openLink.bind(this, item.permalink_url);
        const imageList = [
            {
                uri: item.full_picture,
            }
        ];
        const onPress = this.showImageModal.bind(this, imageList);
        return (
            <FeedItem
                title={NAME_AMICALE}
                subtitle={HomeScreen.getFormattedDate(item.created_time)}
                full_picture={item.full_picture}
                message={item.message}
                onOutLinkPress={onOutLinkPress}
                onImagePress={onPress}
            />
        );
    }

    /**
     * Gets a FlatList render item
     *
     * @param item The item to display
     * @param section The current section
     * @return {*}
     */
    getRenderItem({item, section}: Object) {
        return (section['id'] === SECTIONS_ID[0] ?
            this.getDashboardItem(item) : this.getFeedItem(item));
    }

    render() {
        const nav = this.props.navigation;
        return (
            <View>
                <WebSectionList
                    createDataset={this.createDataset}
                    navigation={nav}
                    autoRefreshTime={REFRESH_TIME}
                    refreshOnFocus={true}
                    fetchUrl={DATA_URL}
                    renderItem={this.getRenderItem}/>
                <Portal>
                    <ImageView
                        images={this.state.imageList}
                        imageIndex={0}
                        presentationStyle={"fullScreen"}
                        visible={this.state.imageModalVisible}
                        onRequestClose={this.hideImageModal}
                    />
                </Portal>
            </View>

        );
    }
}

export default withTheme(HomeScreen);
