// @flow

import * as React from 'react';
import {BackHandler, Image, View} from 'react-native';
import i18n from "i18n-js";
import ThemeManager from "../utils/ThemeManager";
import {LocaleConfig} from 'react-native-calendars';
import WebDataManager from "../utils/WebDataManager";
import PlanningEventManager from '../utils/PlanningEventManager';
import {Text, Title, List, Avatar, Divider} from 'react-native-paper';
import CustomAgenda from "../components/CustomAgenda";

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

const FETCH_URL = "https://amicale-insat.fr/event/json/list";

const AGENDA_MONTH_SPAN = 6;

/**
 * Class defining the app's planning screen
 */
export default class PlanningScreen extends React.Component<Props, State> {

    agendaRef: Agenda;
    webDataManager: WebDataManager;

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
    currentDate = this.getCurrentDate();

    constructor(props: any) {
        super(props);
        this.webDataManager = new WebDataManager(FETCH_URL);
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

    onBackButtonPressAndroid() {
        if (this.state.calendarShowing) {
            this.agendaRef.chooseDay(this.agendaRef.state.selectedDay);
            return true;
        } else {
            return false;
        }
    };

    getCurrentDate() {
        let today = new Date();
        return this.getFormattedDate(today);
    }

    getFormattedDate(date: Date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }

    generateEmptyCalendar() {
        let end = new Date(new Date().setMonth(new Date().getMonth() + AGENDA_MONTH_SPAN + 1));
        let daysOfYear = {};
        for (let d = new Date(2019, 8, 1); d <= end; d.setDate(d.getDate() + 1)) {
            daysOfYear[this.getFormattedDate(new Date(d))] = []
        }
        return daysOfYear;
    }

    getRenderItem(item: Object) {
        const onPress = this.props.navigation.navigate.bind(this, 'PlanningDisplayScreen', {data: item});
        if (item.logo !== null) {
            return (
                <View>
                    <Divider/>
                    <List.Item
                        title={item.title}
                        description={PlanningEventManager.getFormattedTime(item)}
                        left={props => <Avatar.Image source={{uri: item.logo}} />}
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
                        description={PlanningEventManager.getFormattedTime(item)}
                        onPress={onPress}
                    />
                </View>
            );
        }
    }

    getRenderEmptyDate() {
        return (
            <Divider/>
        );
    }

    rowHasChanged(r1: Object, r2: Object) {
        if (r1 !== undefined && r2 !== undefined)
            return r1.title !== r2.title;
        else return !(r1 === undefined && r2 === undefined);
    }

    /**
     * Refresh data and show a toast if any error occurred
     * @private
     */
    onRefresh = () => {
        let canRefresh;
        if (this.lastRefresh !== undefined)
            canRefresh = (new Date().getTime() - this.lastRefresh.getTime()) / 1000 > this.minTimeBetweenRefresh;
        else
            canRefresh = true;

        if (canRefresh) {
            this.setState({refreshing: true});
            this.webDataManager.readData()
                .then((fetchedData) => {
                    this.setState({
                        refreshing: false,
                    });
                    this.generateEventAgenda(fetchedData);
                    this.lastRefresh = new Date();
                })
                .catch((err) => {
                    this.setState({
                        refreshing: false,
                    });
                    // console.log(err);
                });
        }
    };

    generateEventAgenda(eventList: Array<Object>) {
        let agendaItems = this.generateEmptyCalendar();
        for (let i = 0; i < eventList.length; i++) {
            if (agendaItems[PlanningEventManager.getEventStartDate(eventList[i])] !== undefined) {
                this.pushEventInOrder(agendaItems, eventList[i], PlanningEventManager.getEventStartDate(eventList[i]));
            }
        }
        this.setState({agendaItems: agendaItems})
    }

    pushEventInOrder(agendaItems: Object, event: Object, startDate: string) {
        if (agendaItems[startDate].length === 0)
            agendaItems[startDate].push(event);
        else {
            for (let i = 0; i < agendaItems[startDate].length; i++) {
                if (PlanningEventManager.isEventBefore(event, agendaItems[startDate][i])) {
                    agendaItems[startDate].splice(i, 0, event);
                    break;
                } else if (i === agendaItems[startDate].length - 1) {
                    agendaItems[startDate].push(event);
                    break;
                }
            }
        }
    }

    onAgendaRef(ref: Agenda) {
        this.agendaRef = ref;
    }

    onCalendarToggled(isCalendarOpened: boolean) {
        this.setState({calendarShowing: isCalendarOpened});
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
