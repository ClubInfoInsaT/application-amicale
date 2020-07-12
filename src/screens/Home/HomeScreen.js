// @flow

import * as React from 'react';
import {FlatList} from 'react-native';
import i18n from "i18n-js";
import DashboardItem from "../../components/Home/EventDashboardItem";
import WebSectionList from "../../components/Screens/WebSectionList";
import {withTheme} from 'react-native-paper';
import FeedItem from "../../components/Home/FeedItem";
import SquareDashboardItem from "../../components/Home/SmallDashboardItem";
import PreviewEventDashboardItem from "../../components/Home/PreviewEventDashboardItem";
import {stringToDate} from "../../utils/Planning";
import ActionsDashBoardItem from "../../components/Home/ActionsDashboardItem";
import {CommonActions} from '@react-navigation/native';
import MaterialHeaderButtons, {Item} from "../../components/Overrides/CustomHeaderButton";
import AnimatedFAB from "../../components/Animations/AnimatedFAB";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../managers/ThemeManager";
import {View} from "react-native-animatable";
import ConnectionManager from "../../managers/ConnectionManager";
import LogoutDialog from "../../components/Amicale/LogoutDialog";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import AvailableWebsites from "../../constants/AvailableWebsites";
import {MASCOT_STYLE} from "../../components/Mascot/Mascot";
import MascotPopup from "../../components/Mascot/MascotPopup";
// import DATA from "../dashboard_data.json";


const NAME_AMICALE = 'Amicale INSA Toulouse';
const DATA_URL = "https://etud.insa-toulouse.fr/~amicale_app/v2/dashboard/dashboard_data.json";
const FEED_ITEM_HEIGHT = 500;

const SECTIONS_ID = [
    'dashboard',
    'news_feed'
];

const REFRESH_TIME = 1000 * 20; // Refresh every 20 seconds

type rawDashboard = {
    news_feed: {
        data: Array<feedItem>,
    },
    dashboard: fullDashboard,
}

export type feedItem = {
    full_picture: string,
    message: string,
    permalink_url: string,
    created_time: number,
    id: string,
};

type fullDashboard = {
    today_menu: Array<{ [key: string]: any }>,
    proximo_articles: number,
    available_dryers: number,
    available_washers: number,
    today_events: Array<{ [key: string]: any }>,
    available_tutorials: number,
}

type dashboardItem = {
    id: string,
    content: Array<{ [key: string]: any }>
};

type dashboardSmallItem = {
    id: string,
    data: number,
    icon: string,
    color: string,
    onPress: () => void,
    isAvailable: boolean
};

export type event = {
    id: number,
    title: string,
    logo: string | null,
    date_begin: string,
    date_end: string,
    description: string,
    club: string,
    category_id: number,
    url: string,
}

type listSection = {
    title: string,
    data: Array<dashboardItem> | Array<feedItem>,
    id: string
};

type Props = {
    navigation: StackNavigationProp,
    route: { params: any, ... },
    theme: CustomTheme,
}

type State = {
    dialogVisible: boolean,
    mascotDialogVisible: boolean,
}

/**
 * Class defining the app's home screen
 */
class HomeScreen extends React.Component<Props, State> {

    isLoggedIn: boolean | null;

    fabRef: { current: null | AnimatedFAB };
    currentNewFeed: Array<feedItem>;

    constructor(props) {
        super(props);
        this.fabRef = React.createRef();
        this.currentNewFeed = [];
        this.isLoggedIn = ConnectionManager.getInstance().isLoggedIn();
        this.props.navigation.setOptions({
            headerRight: this.getHeaderButton,
        });
        this.state = {
            dialogVisible: false,
            mascotDialogVisible: AsyncStorageManager.getInstance().preferences.homeShowBanner.current === "1"
                && !this.isLoggedIn,
        }
    }

    /**
     * Converts a dateString using Unix Timestamp to a formatted date
     *
     * @param dateString {string} The Unix Timestamp representation of a date
     * @return {string} The formatted output date
     */
    static getFormattedDate(dateString: number) {
        let date = new Date(dateString * 1000);
        return date.toLocaleString();
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', this.onScreenFocus);
        // Handle link open when home is focused
        this.props.navigation.addListener('state', this.handleNavigationParams);
    }

    /**
     * Updates login state and navigation parameters on screen focus
     */
    onScreenFocus = () => {
        if (ConnectionManager.getInstance().isLoggedIn() !== this.isLoggedIn) {
            this.isLoggedIn = ConnectionManager.getInstance().isLoggedIn();
            this.props.navigation.setOptions({
                headerRight: this.getHeaderButton,
            });
        }
        // handle link open when home is not focused or created
        this.handleNavigationParams();
    };

    /**
     * Navigates to the a new screen if navigation parameters specify one
     */
    handleNavigationParams = () => {
        if (this.props.route.params != null) {
            if (this.props.route.params.nextScreen != null) {
                this.props.navigation.navigate(this.props.route.params.nextScreen, this.props.route.params.data);
                // reset params to prevent infinite loop
                this.props.navigation.dispatch(CommonActions.setParams({nextScreen: null}));
            }
        }
    };

    /**
     * Gets header buttons based on login state
     *
     * @returns {*}
     */
    getHeaderButton = () => {
        let onPressLog = () => this.props.navigation.navigate("login", {nextScreen: "profile"});
        let logIcon = "login";
        let logColor = this.props.theme.colors.primary;
        if (this.isLoggedIn) {
            onPressLog = () => this.showDisconnectDialog();
            logIcon = "logout";
            logColor = this.props.theme.colors.text;
        }

        const onPressSettings = () => this.props.navigation.navigate("settings");
        return <MaterialHeaderButtons>
            <Item title="log" iconName={logIcon} color={logColor} onPress={onPressLog}/>
            <Item title={i18n.t("screens.settings.title")} iconName={"settings"} onPress={onPressSettings}/>
        </MaterialHeaderButtons>;
    };

    hideMascotDialog = () => {
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.homeShowBanner.key,
            '0'
        );
        this.setState({mascotDialogVisible: false})
    };

    showDisconnectDialog = () => this.setState({dialogVisible: true});

    hideDisconnectDialog = () => this.setState({dialogVisible: false});

    onProxiwashClick = () => {
        this.props.navigation.navigate("proxiwash");
    };

    onProximoClick = () => {
        this.props.navigation.navigate("proximo");
    };

    onTutorInsaClick = () => {
        this.props.navigation.navigate("website", {host: AvailableWebsites.websites.TUTOR_INSA, title: "Tutor'INSA"});
    };

    onMenuClick = () => {
        this.props.navigation.navigate('self-menu');
    };

    /**
     * Creates the dataset to be used in the FlatList
     *
     * @param fetchedData
     * @return {*}
     */
    createDataset = (fetchedData: rawDashboard) => {
        // fetchedData = DATA;
        let dashboardData;
        if (fetchedData.news_feed != null) {
            this.currentNewFeed = fetchedData.news_feed.data;
        }
        if (fetchedData.dashboard != null)
            dashboardData = this.generateDashboardDataset(fetchedData.dashboard);
        else
            dashboardData = this.generateDashboardDataset(null);
        return [
            {
                title: '',
                data: dashboardData,
                id: SECTIONS_ID[0]
            },
            {
                title: '',
                data: this.currentNewFeed,
                id: SECTIONS_ID[1]
            }
        ];
    };

    /**
     * Generates the dataset associated to the dashboard to be displayed in the FlatList as a section
     *
     * @param dashboardData
     * @return {Array<dashboardItem>}
     */
    generateDashboardDataset(dashboardData: fullDashboard | null): Array<dashboardItem> {
        return [
            {id: 'actions', content: []},
            {
                id: 'top',
                content: [
                    {
                        id: 'washers',
                        data: dashboardData == null ? 0 : dashboardData.available_washers,
                        icon: 'washing-machine',
                        color: this.props.theme.colors.proxiwashColor,
                        onPress: this.onProxiwashClick,
                        isAvailable: dashboardData == null ? false : dashboardData.available_washers > 0
                    },
                    {
                        id: 'dryers',
                        data: dashboardData == null ? 0 : dashboardData.available_dryers,
                        icon: 'tumble-dryer',
                        color: this.props.theme.colors.proxiwashColor,
                        onPress: this.onProxiwashClick,
                        isAvailable: dashboardData == null ? false : dashboardData.available_dryers > 0
                    },
                    {
                        id: 'available_tutorials',
                        data: dashboardData == null ? 0 : dashboardData.available_tutorials,
                        icon: 'school',
                        color: this.props.theme.colors.tutorinsaColor,
                        onPress: this.onTutorInsaClick,
                        isAvailable: dashboardData == null ? false : dashboardData.available_tutorials > 0
                    },
                    {
                        id: 'proximo_articles',
                        data: dashboardData == null ? 0 : dashboardData.proximo_articles,
                        icon: 'shopping',
                        color: this.props.theme.colors.proximoColor,
                        onPress: this.onProximoClick,
                        isAvailable: dashboardData == null ? false : dashboardData.proximo_articles > 0
                    },
                    {
                        id: 'today_menu',
                        data: dashboardData == null ? [] : dashboardData.today_menu,
                        icon: 'silverware-fork-knife',
                        color: this.props.theme.colors.menuColor,
                        onPress: this.onMenuClick,
                        isAvailable: dashboardData == null ? false : dashboardData.today_menu.length > 0
                    },
                ]
            },
            {
                id: 'event',
                content: dashboardData == null ? [] : dashboardData.today_events
            },

        ];
    }

    /**
     * Gets a dashboard item
     *
     * @param item The item to display
     * @return {*}
     */
    getDashboardItem(item: dashboardItem) {
        let content = item.content;
        if (item.id === 'event')
            return this.getDashboardEvent(content);
        else if (item.id === 'top')
            return this.getDashboardRow(content);
        else
            return this.getDashboardActions();
    }

    /**
     * Gets a dashboard item with action buttons
     *
     * @returns {*}
     */
    getDashboardActions() {
        return <ActionsDashBoardItem {...this.props} isLoggedIn={this.isLoggedIn}/>;
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
     * @param event {event}
     * @return {number} The number of milliseconds
     */
    getEventDuration(event: event): number {
        let start = stringToDate(event.date_begin);
        let end = stringToDate(event.date_end);
        let duration = 0;
        if (start != null && end != null)
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
    getEventsAfterLimit(events: Array<event>, limit: Date): Array<event> {
        let validEvents = [];
        for (let event of events) {
            let startDate = stringToDate(event.date_begin);
            if (startDate != null && startDate >= limit) {
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
    getLongestEvent(events: Array<event>): event {
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
    getFutureEvents(events: Array<event>): Array<event> {
        let validEvents = [];
        let now = new Date();
        for (let event of events) {
            let startDate = stringToDate(event.date_begin);
            let endDate = stringToDate(event.date_end);
            if (startDate != null) {
                if (startDate > now)
                    validEvents.push(event);
                else if (endDate != null) {
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
    getDisplayEvent(events: Array<event>): event | null {
        let displayEvent = null;
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
     * Gets the event dashboard render item.
     * If a preview is available, it will be rendered inside
     *
     * @param content
     * @return {*}
     */
    getDashboardEvent(content: Array<event>) {
        let futureEvents = this.getFutureEvents(content);
        let displayEvent = this.getDisplayEvent(futureEvents);
        // const clickPreviewAction = () =>
        //     this.props.navigation.navigate('students', {
        //         screen: 'planning-information',
        //         params: {data: displayEvent}
        //     });
        return (
            <DashboardItem
                eventNumber={futureEvents.length}
                clickAction={this.onEventContainerClick}
            >
                <PreviewEventDashboardItem
                    event={displayEvent != null ? displayEvent : undefined}
                    clickAction={this.onEventContainerClick}
                />
            </DashboardItem>
        );
    }

    /**
     * Gets a dashboard shortcut item
     *
     * @param item
     * @returns {*}
     */
    dashboardRowRenderItem = ({item}: { item: dashboardSmallItem }) => {
        return (
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
     * Gets a dashboard item with a row of shortcut buttons.
     *
     * @param content
     * @return {*}
     */
    getDashboardRow(content: Array<dashboardSmallItem>) {
        return (
            //$FlowFixMe
            <FlatList
                data={content}
                renderItem={this.dashboardRowRenderItem}
                horizontal={true}
                contentContainerStyle={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 5,
                }}
            />);
    }

    /**
     * Gets a render item for the given feed object
     *
     * @param item The feed item to display
     * @return {*}
     */
    getFeedItem(item: feedItem) {
        return (
            <FeedItem
                {...this.props}
                item={item}
                title={NAME_AMICALE}
                subtitle={HomeScreen.getFormattedDate(item.created_time)}
                height={FEED_ITEM_HEIGHT}
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
    getRenderItem = ({item, section}: {
        item: { [key: string]: any },
        section: listSection
    }) => {
        if (section.id === SECTIONS_ID[0]) {
            const data: dashboardItem = item;
            return this.getDashboardItem(data);
        } else {
            const data: feedItem = item;
            return this.getFeedItem(data);
        }
    };

    openScanner = () => this.props.navigation.navigate("scanner");

    onScroll = (event: SyntheticEvent<EventTarget>) => {
        if (this.fabRef.current != null)
            this.fabRef.current.onScroll(event);
    };

    /**
     * Callback when pressing the login button on the banner.
     * This hides the banner and takes the user to the login page.
     */
    onLogin = () => {
        this.hideMascotDialog();
        this.props.navigation.navigate("login", {nextScreen: "profile"});
    }

    render() {
        return (
            <View
                style={{flex: 1}}
            >
                <View style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}>
                    <WebSectionList
                        {...this.props}
                        createDataset={this.createDataset}
                        autoRefreshTime={REFRESH_TIME}
                        refreshOnFocus={true}
                        fetchUrl={DATA_URL}
                        renderItem={this.getRenderItem}
                        itemHeight={FEED_ITEM_HEIGHT}
                        onScroll={this.onScroll}
                        showError={false}
                    />
                </View>
                <MascotPopup
                    visible={this.state.mascotDialogVisible}
                    title={i18n.t("screens.home.mascotDialog.title")}
                    message={i18n.t("screens.home.mascotDialog.message")}
                    icon={"human-greeting"}
                    buttons={{
                        action: {
                            message: i18n.t("screens.home.mascotDialog.login"),
                            icon: "login",
                            onPress: this.onLogin,
                        },
                        cancel: {
                            message: i18n.t("screens.home.mascotDialog.later"),
                            icon: "close",
                            color: this.props.theme.colors.warning,
                            onPress: this.hideMascotDialog,
                        }
                    }}
                    emotion={MASCOT_STYLE.CUTE}
                />
                <AnimatedFAB
                    {...this.props}
                    ref={this.fabRef}
                    icon="qrcode-scan"
                    onPress={this.openScanner}
                />
                <LogoutDialog
                    {...this.props}
                    visible={this.state.dialogVisible}
                    onDismiss={this.hideDisconnectDialog}
                />
            </View>
        );
    }
}

export default withTheme(HomeScreen);
