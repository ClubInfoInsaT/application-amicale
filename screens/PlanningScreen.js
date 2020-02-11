// @flow

import * as React from 'react';
import {BackHandler, Image} from 'react-native';
import {H3, Text, View} from 'native-base';
import i18n from "i18n-js";
import ThemeManager from "../utils/ThemeManager";
import {Linking} from "expo";
import BaseContainer from "../components/BaseContainer";
import {Agenda, LocaleConfig} from 'react-native-calendars';
import Touchable from 'react-native-platform-touchable';
import WebDataManager from "../utils/WebDataManager";
import PlanningEventManager from '../utils/PlanningEventManager';

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
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

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

    constructor(props: any) {
        super(props);
        this.webDataManager = new WebDataManager(FETCH_URL);
        this.didFocusSubscription = props.navigation.addListener(
            'didFocus',
            () =>
                BackHandler.addEventListener(
                    'hardwareBackPress',
                    this.onBackButtonPressAndroid
                )
        );
        if (i18n.currentLocale().startsWith("fr")) {
            LocaleConfig.defaultLocale = 'fr';
        }

        // Create references for functions required in the render function
        this._onRefresh = this._onRefresh.bind(this);
        this.onCalendarToggled = this.onCalendarToggled.bind(this);
        this.getRenderItem = this.getRenderItem.bind(this);
        this.getRenderEmptyDate = this.getRenderEmptyDate.bind(this);
        this.setAgendaRef = this.setAgendaRef.bind(this);
        this.onCalendarToggled = this.onCalendarToggled.bind(this);
        this.onCalendarToggled = this.onCalendarToggled.bind(this);
        this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);
    }

    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        return nextState.refreshing === false && this.state.refreshing === true ||
            nextState.agendaItems !== this.state.agendaItems ||
            nextState.calendarShowing !== this.state.calendarShowing;
    }

    componentDidMount() {
        this._onRefresh();
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
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

    componentWillUnmount() {
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.willBlurSubscription && this.willBlurSubscription.remove();
    }

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
        return (
            <Touchable
                style={{
                    backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor,
                    borderRadius: 10,
                    marginRight: 10,
                    marginTop: 17,
                }}
                onPress={() => this.props.navigation.navigate('PlanningDisplayScreen', {data: item})}>
                <View style={{
                    padding: 10,
                    flex: 1,
                    flexDirection: 'row'
                }}>
                    <View style={{
                        width: item.logo !== null ? '70%' : '100%',
                    }}>
                        <Text style={{
                            color: ThemeManager.getCurrentThemeVariables().listNoteColor,
                            marginTop: 5,
                            marginBottom: 10
                        }}>
                            {PlanningEventManager.getFormattedTime(item)}
                        </Text>
                        <H3 style={{marginBottom: 10}}>{item.title}</H3>
                    </View>
                    <View style={{
                        width: item.logo !== null ? '30%' : 0,
                        height: 80
                    }}>
                        {item.logo !== null ?
                            <Image source={{uri: item.logo}}
                                   style={{
                                       flex: 1,
                                       resizeMode: "contain"
                                   }}/>
                            : <View/>}
                    </View>
                </View>
            </Touchable>
        );
    }

    getRenderEmptyDate() {
        return (
            <View style={{
                padding: 10,
                flex: 1,
            }}>
                <View style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: ThemeManager.getCurrentThemeVariables().agendaEmptyLine,
                    marginTop: 'auto',
                    marginBottom: 'auto',
                }}/>
            </View>
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
    _onRefresh = () => {
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
                    console.log(err);
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

    setAgendaRef(ref) {
        this.agendaRef = ref;
    }

    onCalendarToggled(calendarOpened) {
        this.setState({calendarShowing: calendarOpened});
    }

    currentDate = this.getCurrentDate();

    render() {
        // console.log("rendering PlanningScreen");
        return (
            <BaseContainer navigation={this.props.navigation} headerTitle={i18n.t('screens.planning')}>
                <Agenda
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
                    onRefresh={this._onRefresh}
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
                    ref={this.setAgendaRef}
                    // agenda theme
                    theme={{
                        backgroundColor: ThemeManager.getCurrentThemeVariables().agendaBackgroundColor,
                        calendarBackground: ThemeManager.getCurrentThemeVariables().containerBgColor,
                        textSectionTitleColor: ThemeManager.getCurrentThemeVariables().listNoteColor,
                        selectedDayBackgroundColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        dayTextColor: ThemeManager.getCurrentThemeVariables().textColor,
                        textDisabledColor: ThemeManager.getCurrentThemeVariables().textDisabledColor,
                        dotColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        selectedDotColor: '#ffffff',
                        arrowColor: 'orange',
                        monthTextColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        indicatorColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16,
                        agendaDayTextColor: ThemeManager.getCurrentThemeVariables().listNoteColor,
                        agendaDayNumColor: ThemeManager.getCurrentThemeVariables().listNoteColor,
                        agendaTodayColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        agendaKnobColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                    }}
                />
            </BaseContainer>
        );
    }
}
