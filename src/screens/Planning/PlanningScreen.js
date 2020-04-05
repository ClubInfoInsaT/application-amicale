// @flow

import * as React from 'react';
import {BackHandler, View} from 'react-native';
import i18n from "i18n-js";
import {LocaleConfig} from 'react-native-calendars';
import {readData} from "../../utils/WebData";
import type {eventObject} from "../../utils/Planning";
import {
    generateEventAgenda,
    getCurrentDateString,
    getDateOnlyString,
    getFormattedEventTime,
} from '../../utils/Planning';
import {Avatar, Divider, List} from 'react-native-paper';
import CustomAgenda from "../../components/Custom/CustomAgenda";

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    today: 'Aujourd\'hui'
};


type Props = {
    navigation: Object,
}

type State = {
    refreshing: boolean,
    agendaItems: Object,
    calendarShowing: boolean,
};

const FETCH_URL = "https://www.amicale-insat.fr/api/event/list";
const AGENDA_MONTH_SPAN = 3;

/**
 * Class defining the app's planning screen
 */
export default class PlanningScreen extends React.Component<Props, State> {

    agendaRef: Object;

    lastRefresh: Date;
    minTimeBetweenRefresh = 60;

    didFocusSubscription: Function;
    willBlurSubscription: Function;

    state = {
        refreshing: false,
        agendaItems: {},
        calendarShowing: false,
    };

    onRefresh: Function;
    onCalendarToggled: Function;
    getRenderItem: Function;
    getRenderEmptyDate: Function;
    onAgendaRef: Function;
    onCalendarToggled: Function;
    onBackButtonPressAndroid: Function;
    currentDate = getDateOnlyString(getCurrentDateString());

    constructor(props: any) {
        super(props);
        if (i18n.currentLocale().startsWith("fr")) {
            LocaleConfig.defaultLocale = 'fr';
        }

        // Create references for functions required in the render function
        this.onRefresh = this.onRefresh.bind(this);
        this.onCalendarToggled = this.onCalendarToggled.bind(this);
        this.getRenderItem = this.getRenderItem.bind(this);
        this.getRenderEmptyDate = this.getRenderEmptyDate.bind(this);
        this.onAgendaRef = this.onAgendaRef.bind(this);
        this.onCalendarToggled = this.onCalendarToggled.bind(this);
        this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);
    }

    /**
     * Captures focus and blur events to hook on android back button
     */
    componentDidMount() {
        this.onRefresh();
        this.didFocusSubscription = this.props.navigation.addListener(
            'focus',
            () =>
                BackHandler.addEventListener(
                    'hardwareBackPress',
                    this.onBackButtonPressAndroid
                )
        );
        this.willBlurSubscription = this.props.navigation.addListener(
            'blur',
            () =>
                BackHandler.removeEventListener(
                    'hardwareBackPress',
                    this.onBackButtonPressAndroid
                )
        );
    }

    /**
     * Overrides default android back button behaviour to close the calendar if it was open.
     *
     * @return {boolean}
     */
    onBackButtonPressAndroid() {
        if (this.state.calendarShowing) {
            this.agendaRef.chooseDay(this.agendaRef.state.selectedDay);
            return true;
        } else {
            return false;
        }
    };

    /**
     * Function used to check if a row has changed
     *
     * @param r1
     * @param r2
     * @return {boolean}
     */
    rowHasChanged(r1: Object, r2: Object) {
        return false;
        // if (r1 !== undefined && r2 !== undefined)
        //     return r1.title !== r2.title;
        // else return !(r1 === undefined && r2 === undefined);
    }

    /**
     * Refreshes data and shows an animation while doing it
     */
    onRefresh = () => {
        let canRefresh;
        if (this.lastRefresh !== undefined)
            canRefresh = (new Date().getTime() - this.lastRefresh.getTime()) / 1000 > this.minTimeBetweenRefresh;
        else
            canRefresh = true;

        if (canRefresh) {
            this.setState({refreshing: true});
            readData(FETCH_URL)
                .then((fetchedData) => {
                    this.setState({
                        refreshing: false,
                        agendaItems: generateEventAgenda(fetchedData, AGENDA_MONTH_SPAN)
                    });
                    this.lastRefresh = new Date();
                })
                .catch(() => {
                    this.setState({
                        refreshing: false,
                    });
                });
        }
    };

    /**
     * Callback used when receiving the agenda ref
     *
     * @param ref
     */
    onAgendaRef(ref: Object) {
        this.agendaRef = ref;
    }

    /**
     * Callback used when a button is pressed to toggle the calendar
     *
     * @param isCalendarOpened True is the calendar is already open, false otherwise
     */
    onCalendarToggled(isCalendarOpened: boolean) {
        this.setState({calendarShowing: isCalendarOpened});
    }

    /**
     * Gets an event render item
     *
     * @param item The current event to render
     * @return {*}
     */
    getRenderItem(item: eventObject) {
        const onPress = this.props.navigation.navigate.bind(this, 'PlanningDisplayScreen', {data: item});
        if (item.logo !== null) {
            return (
                <View>
                    <Divider/>
                    <List.Item
                        title={item.title}
                        description={getFormattedEventTime(item["date_begin"], item["date_end"])}
                        left={() => <Avatar.Image
                            source={{uri: item.logo}}
                            style={{backgroundColor: 'transparent'}}
                        />}
                        onPress={onPress}
                    />
                </View>
            );
        } else {
            return (
                <View>
                    <Divider/>
                    <List.Item
                        title={item.title}
                        description={getFormattedEventTime(item["date_begin"], item["date_end"])}
                        onPress={onPress}
                    />
                </View>
            );
        }
    }

    /**
     * Gets an empty render item for an empty date
     *
     * @return {*}
     */
    getRenderEmptyDate() {
        return (
            <Divider/>
        );
    }

    render() {
        // console.log("rendering PlanningScreen");
        return (
            <CustomAgenda
                // the list of items that have to be displayed in agenda. If you want to render item as empty date
                // the value of date key kas to be an empty array []. If there exists no value for date key it is
                // considered that the date in question is not yet loaded
                items={this.state.agendaItems}
                // initially selected day
                selected={this.currentDate}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={this.currentDate}
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={1}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={AGENDA_MONTH_SPAN}
                // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
                onRefresh={this.onRefresh}
                // callback that fires when the calendar is opened or closed
                onCalendarToggled={this.onCalendarToggled}
                // Set this true while waiting for new data from a refresh
                refreshing={this.state.refreshing}
                renderItem={this.getRenderItem}
                renderEmptyDate={this.getRenderEmptyDate}
                rowHasChanged={this.rowHasChanged}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // ref to this agenda in order to handle back button event
                onRef={this.onAgendaRef}
            />
        );
    }
}
