// @flow

import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import i18n from "i18n-js";
import DashboardItem from "../components/Home/EventDashboardItem";
import WebSectionList from "../components/Lists/WebSectionList";
import {FAB, withTheme} from 'react-native-paper';
import FeedItem from "../components/Home/FeedItem";
import SquareDashboardItem from "../components/Home/SmallDashboardItem";
import PreviewEventDashboardItem from "../components/Home/PreviewEventDashboardItem";
import {stringToDate} from "../utils/Planning";
import ActionsDashBoardItem from "../components/Home/ActionsDashboardItem";
import ConnectionManager from "../managers/ConnectionManager";
import {CommonActions} from '@react-navigation/native';
import MaterialHeaderButtons, {Item} from "../components/Custom/HeaderButton";
import {Linking} from "expo";
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
    route: Object,
    theme: Object,
}

/**
 * Class defining the app's home screen
 */
class HomeScreen extends React.Component<Props> {

    colors: Object;

    isLoggedIn: boolean | null;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;

        this.isLoggedIn = null;
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

    componentDidMount() {
        this.props.navigation.addListener('focus', this.onScreenFocus);
        // Handle link open when home is focused
        this.props.navigation.addListener('state', this.handleNavigationParams);
    }

    onScreenFocus = () => {
        if (this.isLoggedIn !== ConnectionManager.getInstance().isLoggedIn()) {
            this.isLoggedIn = ConnectionManager.getInstance().isLoggedIn();
            this.props.navigation.setOptions({
                headerRight: this.getHeaderButton,
            });
        }
        // handle link open when home is not focused or created
        this.handleNavigationParams();
    };

    handleNavigationParams = () => {
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.nextScreen !== undefined && this.props.route.params.nextScreen !== null) {
                this.props.navigation.navigate(this.props.route.params.nextScreen, this.props.route.params.data);
                // reset params to prevent infinite loop
                this.props.navigation.dispatch(CommonActions.setParams({nextScreen: null}));
            }
        }
    };

    getHeaderButton = () => {
        const screen = this.isLoggedIn
            ? "profile"
            : "login";
        const icon = this.isLoggedIn
            ? "account"
            : "login";
        const onPress = () => this.props.navigation.navigate(screen);
        return <MaterialHeaderButtons>
            <Item title="main" iconName={icon} onPress={onPress}/>
        </MaterialHeaderButtons>;
    };

    onProxiwashClick = () => this.props.navigation.navigate('proxiwash');

    onTutorInsaClick = () => this.props.navigation.navigate('tutorinsa');

    onProximoClick = () => this.props.navigation.navigate('proximo');

    onMenuClick = () => this.props.navigation.navigate('self-menu');

    /**
     * Creates the dataset to be used in the FlatList
     *
     * @param fetchedData
     * @return {*}
     */
    createDataset = (fetchedData: Object) => {
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
                id: SECTIONS_ID[0]
            },
            {
                title: i18n.t('homeScreen.newsFeed'),
                data: newsData,
                id: SECTIONS_ID[1]
            }
        ];
    };

    /**
     * Generates the dataset associated to the dashboard to be displayed in the FlatList as a section
     *
     * @param dashboardData
     * @return {*}
     */
    generateDashboardDataset(dashboardData: Object) {
        let dataset = [

            {
                id: 'top',
                content: []
            },
            {
                id: 'actions',
                content: undefined
            },
            {
                id: 'event',
                content: undefined
            },
        ];
        for (let [key, value: number | Object | Array<string>] of Object.entries(dashboardData)) {
            switch (key) {
                case 'available_machines':
                    dataset[0]['content'][0] = {
                        id: 'washers',
                        data: value.washers,
                        icon: 'washing-machine',
                        color: this.colors.proxiwashColor,
                        onPress: this.onProxiwashClick,
                        isAvailable: value.washers > 0
                    };
                    dataset[0]['content'][1] = {
                        ...dataset[0]['content'][0],
                        id: 'dryers',
                        data: value.dryers,
                        icon: 'tumble-dryer',
                        isAvailable: value.dryers > 0
                    };
                    break;
                case 'available_tutorials':
                    dataset[0]['content'][2] = {
                        id: key,
                        data: value,
                        icon: 'school',
                        color: this.colors.tutorinsaColor,
                        onPress: this.onTutorInsaClick,
                        isAvailable: parseInt(value) > 0
                    };
                    break;
                case 'proximo_articles':
                    dataset[0]['content'][3] = {
                        id: key,
                        data: value,
                        icon: 'shopping',
                        color: this.colors.proximoColor,
                        onPress: this.onProximoClick,
                        isAvailable: parseInt(value) > 0
                    };
                    break;
                case 'today_menu':
                    dataset[0]['content'][4] = {
                        id: key,
                        data: 0,
                        icon: 'silverware-fork-knife',
                        color: this.colors.menu,
                        onPress: this.onMenuClick,
                        isAvailable: value.length > 0
                    };
                    break;
                case 'today_events':
                    dataset[2]['content'] = value;
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
            return this.getDashboardEvent(content);
        else if (item['id'] === 'top')
            return this.getDashboardRow(content);
        else
            return this.getDashboardActions();
    }

    getDashboardActions() {
        return <ActionsDashBoardItem {...this.props}/>;
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

    onEventContainerClick = () => this.props.navigation.navigate('planning');

    /**
     * Gets the event render item.
     * If a preview is available, it will be rendered inside
     *
     * @param content
     * @return {*}
     */
    getDashboardEvent(content: Array<Object>) {
        let futureEvents = this.getFutureEvents(content);
        let displayEvent = this.getDisplayEvent(futureEvents);
        const clickPreviewAction = () =>
            this.props.navigation.navigate('home-planning-information', {data: displayEvent});
        return (
            <DashboardItem
                eventNumber={futureEvents.length}
                clickAction={this.onEventContainerClick}
            >
                <PreviewEventDashboardItem
                    event={displayEvent}
                    clickAction={clickPreviewAction}
                />
            </DashboardItem>
        );
    }

    dashboardRowRenderItem = ({item}: Object) => {
        return(
            <SquareDashboardItem
                color={item.color}
                icon={item.icon}
                clickAction={item.onPress}
                isAvailable={item.isAvailable}
                badgeNumber={item.data}
            />
        );
    };

    /**
     * Gets a classic dashboard item.
     *
     * @param content
     * @return {*}
     */
    getDashboardRow(content: Array<Object>) {
        return <FlatList
                data={content}
                renderItem={this.dashboardRowRenderItem}
                horizontal={true}
                contentContainerStyle={{
                marginLeft: 'auto',
                marginRight: 'auto',
                }}
            />;
    }

    /**
     * Gets a render item for the given feed object
     *
     * @param item The feed item to display
     * @return {*}
     */
    getFeedItem(item: Object) {
        const onOutLinkPress = () => Linking.openURL(item.permalink_url);
        return (
            <FeedItem
                title={NAME_AMICALE}
                subtitle={HomeScreen.getFormattedDate(item.created_time)}
                full_picture={item.full_picture}
                message={item.message}
                onOutLinkPress={onOutLinkPress}
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
    getRenderItem = ({item, section}: Object) => {
        return (section['id'] === SECTIONS_ID[0]
            ? this.getDashboardItem(item)
            : this.getFeedItem(item));
    };

    openScanner = () => this.props.navigation.navigate("scanner");

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
                <FAB
                    style={styles.fab}
                    icon="qrcode-scan"
                    onPress={this.openScanner}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default withTheme(HomeScreen);
