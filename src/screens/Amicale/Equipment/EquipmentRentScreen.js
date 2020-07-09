// @flow

import * as React from 'react';
import {Button, Caption, Card, Headline, Subheading, Text, withTheme} from 'react-native-paper';
import {Collapsible} from "react-navigation-collapsible";
import {withCollapsible} from "../../../utils/withCollapsible";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import type {Device} from "./EquipmentListScreen";
import {Animated, BackHandler} from "react-native";
import * as Animatable from "react-native-animatable";
import {View} from "react-native-animatable";
import i18n from "i18n-js";
import {dateToString, getTimeOnlyString, stringToDate} from "../../../utils/Planning";
import {CalendarList} from "react-native-calendars";
import DateTimePicker from '@react-native-community/datetimepicker';
import LoadingConfirmDialog from "../../../components/Dialogs/LoadingConfirmDialog";
import ConnectionManager from "../../../managers/ConnectionManager";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";

type Props = {
    navigation: StackNavigationProp,
    route: {
        params?: {
            item?: Device,
        },
    },
    theme: CustomTheme,
    collapsibleStack: Collapsible,
}

type State = {
    dialogVisible: boolean,
    errorDialogVisible: boolean,
    markedDates: { [key: string]: { startingDay: boolean, endingDay: boolean, color: string } },
    timePickerVisible: boolean,
    currentError: number,
}

class EquipmentRentScreen extends React.Component<Props, State> {

    state = {
        dialogVisible: false,
        errorDialogVisible: false,
        markedDates: {},
        timePickerVisible: false,
        currentError: 0,
    }

    item: Device | null;
    selectedDates: {
        start: Date | null,
        end: Date | null,
    };

    currentlySelectedDate: Date | null;

    bookRef: { current: null | Animatable.View }
    canBookEquipment: boolean;

    constructor(props: Props) {
        super(props);
        this.resetSelection();
        this.bookRef = React.createRef();
        this.canBookEquipment = false;
        if (this.props.route.params != null) {
            if (this.props.route.params.item != null)
                this.item = this.props.route.params.item;
            else
                this.item = null;
        }
    }

    /**
     * Captures focus and blur events to hook on android back button
     */
    componentDidMount() {
        this.props.navigation.addListener(
            'focus',
            () =>
                BackHandler.addEventListener(
                    'hardwareBackPress',
                    this.onBackButtonPressAndroid
                )
        );
        this.props.navigation.addListener(
            'blur',
            () =>
                BackHandler.removeEventListener(
                    'hardwareBackPress',
                    this.onBackButtonPressAndroid
                )
        );
    }

    /**
     * Overrides default android back button behaviour to deselect date if any is selected.
     *
     * @return {boolean}
     */
    onBackButtonPressAndroid = () => {
        if (this.currentlySelectedDate != null) {
            this.resetSelection();
            this.setState({
                markedDates: this.generateMarkedDates(),
            });
            return true;
        } else
            return false;
    };

    isAvailable(item: Device) {
        const availableDate = stringToDate(item.available_at);
        return availableDate != null && availableDate < new Date();
    }

    /**
     * Gets the string representation of the given date.
     *
     * If the given date is the same day as today, only return the tile.
     * Otherwise, return the full date.
     *
     * @param dateString The string representation of the wanted date
     * @returns {string}
     */
    getDateString(dateString: string): string {
        const today = new Date();
        const date = stringToDate(dateString);
        if (date != null && today.getDate() === date.getDate()) {
            const str = getTimeOnlyString(dateString);
            return str != null ? str : "";
        } else
            return dateString;
    }

    /**
     * Gets the minimum date for renting equipment
     *
     * @param item The item to rent
     * @param isAvailable True is it is available right now
     * @returns {Date}
     */
    getMinDate(item: Device, isAvailable: boolean) {
        let date = new Date();
        if (isAvailable)
            return date;
        else {
            const limit = stringToDate(item.available_at)
            return limit != null ? limit : date;
        }
    }

    /**
     * Selects a new date on the calendar.
     * If both start and end dates are already selected, unselect all.
     *
     * @param day The day selected
     */
    selectNewDate = (day: { dateString: string, day: number, month: number, timestamp: number, year: number }) => {
        this.currentlySelectedDate = new Date(day.dateString);

        if (!this.canBookEquipment) {
            const start = this.selectedDates.start;
            if (start == null)
                this.selectedDates.start = this.currentlySelectedDate;
            else if (this.currentlySelectedDate < start) {
                this.selectedDates.end = start;
                this.selectedDates.start = this.currentlySelectedDate;
            } else
                this.selectedDates.end = this.currentlySelectedDate;
        } else
            this.resetSelection();

        if (this.selectedDates.start != null) {
            this.setState({
                markedDates: this.generateMarkedDates(),
                timePickerVisible: true,
            });
        } else {
            this.setState({
                markedDates: this.generateMarkedDates(),
            });
        }
    }

    resetSelection() {
        if (this.canBookEquipment)
            this.hideBookButton();
        this.canBookEquipment = false;
        this.selectedDates = {start: null, end: null};
        this.currentlySelectedDate = null;
    }

    /**
     * Deselect the currently selected date
     */
    deselectCurrentDate() {
        let currentlySelectedDate = this.currentlySelectedDate;
        const start = this.selectedDates.start;
        const end = this.selectedDates.end;
        if (currentlySelectedDate != null && start != null) {
            if (currentlySelectedDate === start && end === null)
                this.resetSelection();
            else if (end != null && currentlySelectedDate === end) {
                this.currentlySelectedDate = start;
                this.selectedDates.end = null;
            } else if (currentlySelectedDate === start) {
                this.currentlySelectedDate = end;
                this.selectedDates.start = this.selectedDates.end;
                this.selectedDates.end = null;
            }
        }
    }

    /**
     * Saves the selected time to the currently selected date.
     * If no the time selection was canceled, cancels the current selecction
     *
     * @param event The click event
     * @param date The date selected
     */
    onTimeChange = (event: { nativeEvent: { timestamp: number }, type: string }, date: Date) => {
        let currentDate = this.currentlySelectedDate;
        const item = this.item;
        if (item != null && event.type === "set" && currentDate != null) {
            currentDate.setHours(date.getHours());
            currentDate.setMinutes(date.getMinutes());

            const isAvailable = this.isAvailable(item);
            let limit = this.getMinDate(item, isAvailable);
            // Prevent selecting a date before now
            if (this.getISODate(currentDate) === this.getISODate(limit) && currentDate < limit) {
                currentDate.setHours(limit.getHours());
                currentDate.setMinutes(limit.getMinutes());
            }

            if (this.selectedDates.start != null && this.selectedDates.end != null) {
                if (this.selectedDates.start > this.selectedDates.end) {
                    const temp = this.selectedDates.start;
                    this.selectedDates.start = this.selectedDates.end;
                    this.selectedDates.end = temp;
                }
                this.canBookEquipment = true;
                this.showBookButton();
            }
        } else
            this.deselectCurrentDate();

        this.setState({
            timePickerVisible: false,
            markedDates: this.generateMarkedDates(),
        });
    }

    /**
     * Returns the ISO date format (without the time)
     *
     * @param date The date to recover the ISO format from
     * @returns {*}
     */
    getISODate(date: Date) {
        return date.toISOString().split("T")[0];
    }

    /**
     * Generates the object containing all marked dates between the start and end dates selected
     *
     * @returns {{}}
     */
    generateMarkedDates() {
        let markedDates = {}
        const start = this.selectedDates.start;
        const end = this.selectedDates.end;
        if (start != null) {
            const startISODate = this.getISODate(start);
            if (end != null && this.getISODate(end) !== startISODate) {
                markedDates[startISODate] = {
                    startingDay: true,
                    endingDay: false,
                    color: this.props.theme.colors.primary
                };
                markedDates[this.getISODate(end)] = {
                    startingDay: false,
                    endingDay: true,
                    color: this.props.theme.colors.primary
                };
                let date = new Date(start);
                date.setDate(date.getDate() + 1);
                while (date < end && this.getISODate(date) !== this.getISODate(end)) {
                    markedDates[this.getISODate(date)] =
                        {startingDay: false, endingDay: false, color: this.props.theme.colors.danger};
                    date.setDate(date.getDate() + 1);
                }
            } else {
                markedDates[startISODate] = {
                    startingDay: true,
                    endingDay: true,
                    color: this.props.theme.colors.primary
                };
            }
        }
        return markedDates;
    }

    /**
     * Shows the book button by plying a fade animation
     */
    showBookButton() {
        if (this.bookRef.current != null) {
            this.bookRef.current.fadeInUp(500);
        }
    }

    /**
     * Hides the book button by plying a fade animation
     */
    hideBookButton() {
        if (this.bookRef.current != null) {
            this.bookRef.current.fadeOutDown(500);
        }
    }

    showDialog = () => {
        this.setState({dialogVisible: true});
    }

    showErrorDialog = (error: number) => {
        this.setState({
            errorDialogVisible: true,
            currentError: error,
        });
    }

    onDialogDismiss = () => {
        this.setState({dialogVisible: false});
    }

    onErrorDialogDismiss = () => {
        this.setState({errorDialogVisible: false});
    }

    /**
     * Sends the selected data to the server and waits for a response.
     * If the request is a success, navigate to the recap screen.
     * If it is an error, display the error to the user.
     *
     * @returns {Promise<R>}
     */
    onDialogAccept = () => {
        return new Promise((resolve) => {
            const item = this.item;
            const start = this.selectedDates.start;
            const end = this.selectedDates.end;
            if (item != null && start != null && end != null) {
                ConnectionManager.getInstance().authenticatedRequest(
                    "", // TODO set path
                    {
                        "id": item.id,
                        "start": dateToString(start, false),
                        "end": dateToString(end, false),
                    })
                    .then(() => {
                        console.log("Success, replace screen");
                        resolve();
                    })
                    .catch((error: number) => {
                        this.onDialogDismiss();
                        this.showErrorDialog(error);
                        resolve();
                    });
            } else
                resolve();
        });
    }

    render() {
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        let startString = <Caption>{i18n.t('equipmentScreen.notSet')}</Caption>;
        let endString = <Caption>{i18n.t('equipmentScreen.notSet')}</Caption>;
        const start = this.selectedDates.start;
        const end = this.selectedDates.end;
        if (start != null)
            startString = dateToString(start, false);
        if (end != null)
            endString = dateToString(end, false);

        const item = this.item;
        if (item != null) {
            const isAvailable = this.isAvailable(item);
            return (
                <View style={{flex: 1}}>
                    <Animated.ScrollView
                        // Animations
                        onScroll={onScroll}
                        contentContainerStyle={{
                            paddingTop: containerPaddingTop,
                            minHeight: '100%'
                        }}
                        scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}>
                        <Card style={{margin: 5}}>
                            <Card.Content>
                                <View style={{flex: 1}}>
                                    <View style={{
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                    }}>
                                        <Headline style={{textAlign: "center"}}>
                                            {item.name}
                                        </Headline>
                                        <Caption style={{
                                            textAlign: "center",
                                            lineHeight: 35,
                                            marginLeft: 10,
                                        }}>
                                            ({i18n.t('equipmentScreen.bail', {cost: item.caution})})
                                        </Caption>
                                    </View>
                                </View>

                                <Button
                                    icon={isAvailable ? "check-circle-outline" : "update"}
                                    color={isAvailable ? this.props.theme.colors.success : this.props.theme.colors.primary}
                                    mode="text"
                                >
                                    {
                                        isAvailable
                                            ? i18n.t('equipmentScreen.available')
                                            : i18n.t('equipmentScreen.availableAt', {date: this.getDateString(item.available_at)})
                                    }
                                </Button>
                                <Text style={{
                                    textAlign: "center",
                                    marginBottom: 10
                                }}>
                                    {i18n.t('equipmentScreen.booking')}
                                </Text>
                                <Subheading style={{textAlign: "center"}}>
                                    {i18n.t('equipmentScreen.startDate')}
                                    {startString}
                                </Subheading>
                                <Subheading style={{textAlign: "center"}}>
                                    {i18n.t('equipmentScreen.endDate')}
                                    {endString}
                                </Subheading>
                            </Card.Content>
                        </Card>
                        {this.state.timePickerVisible
                            ? <DateTimePicker
                                value={new Date()}
                                mode={"time"}
                                display={"clock"}
                                is24Hour={true}
                                onChange={this.onTimeChange}
                            />
                            : null}
                        <CalendarList
                            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                            minDate={this.getMinDate(item, isAvailable)}
                            // Max amount of months allowed to scroll to the past. Default = 50
                            pastScrollRange={0}
                            // Max amount of months allowed to scroll to the future. Default = 50
                            futureScrollRange={3}
                            // Enable horizontal scrolling, default = false
                            horizontal={true}
                            // Enable paging on horizontal, default = false
                            pagingEnabled={true}
                            // Handler which gets executed on day press. Default = undefined
                            onDayPress={this.selectNewDate}
                            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                            firstDay={1}
                            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                            disableAllTouchEventsForDisabledDays={true}
                            // Hide month navigation arrows.
                            hideArrows={false}
                            // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                            markingType={'period'}
                            markedDates={this.state.markedDates}

                            theme={{
                                backgroundColor: this.props.theme.colors.agendaBackgroundColor,
                                calendarBackground: this.props.theme.colors.background,
                                textSectionTitleColor: this.props.theme.colors.agendaDayTextColor,
                                selectedDayBackgroundColor: this.props.theme.colors.primary,
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: this.props.theme.colors.text,
                                dayTextColor: this.props.theme.colors.text,
                                textDisabledColor: this.props.theme.colors.agendaDayTextColor,
                                dotColor: this.props.theme.colors.primary,
                                selectedDotColor: '#ffffff',
                                arrowColor: this.props.theme.colors.primary,
                                monthTextColor: this.props.theme.colors.text,
                                indicatorColor: this.props.theme.colors.primary,
                                textDayFontFamily: 'monospace',
                                textMonthFontFamily: 'monospace',
                                textDayHeaderFontFamily: 'monospace',
                                textDayFontWeight: '300',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '300',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 16,
                                'stylesheet.day.period': {
                                    base: {
                                        overflow: 'hidden',
                                        height: 34,
                                        width: 34,
                                        alignItems: 'center',

                                    }
                                }
                            }}
                            style={{marginBottom: 50}}
                        />
                    </Animated.ScrollView>
                    <LoadingConfirmDialog
                        visible={this.state.dialogVisible}
                        onDismiss={this.onDialogDismiss}
                        onAccept={this.onDialogAccept}
                        title={i18n.t('equipmentScreen.dialogTitle')}
                        titleLoading={i18n.t('equipmentScreen.dialogTitleLoading')}
                        message={i18n.t('equipmentScreen.dialogMessage')}
                    />

                    <ErrorDialog
                        visible={this.state.errorDialogVisible}
                        onDismiss={this.onErrorDialogDismiss}
                        errorCode={this.state.currentError}
                    />
                    <Animatable.View
                        ref={this.bookRef}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            flex: 1,
                            transform: [
                                {translateY: 100},
                            ]
                        }}>
                        <Button
                            icon="bookmark-check"
                            mode="contained"
                            onPress={this.showDialog}
                            style={{
                                width: "80%",
                                flex: 1,
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginBottom: 20,
                                borderRadius: 10
                            }}
                        >
                            {i18n.t('equipmentScreen.bookButton')}
                        </Button>
                    </Animatable.View>

                </View>

            )
        } else
            return <View/>;
    }

}

export default withCollapsible(withTheme(EquipmentRentScreen));
