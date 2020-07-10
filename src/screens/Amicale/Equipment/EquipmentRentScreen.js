// @flow

import * as React from 'react';
import {Button, Caption, Card, Headline, Subheading, withTheme} from 'react-native-paper';
import {Collapsible} from "react-navigation-collapsible";
import {withCollapsible} from "../../../utils/withCollapsible";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import type {Device} from "./EquipmentListScreen";
import {Animated, BackHandler} from "react-native";
import * as Animatable from "react-native-animatable";
import {View} from "react-native-animatable";
import i18n from "i18n-js";
import {CalendarList} from "react-native-calendars";
import LoadingConfirmDialog from "../../../components/Dialogs/LoadingConfirmDialog";
import ConnectionManager from "../../../managers/ConnectionManager";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import {
    generateMarkedDates,
    getFirstEquipmentAvailability,
    getISODate,
    getRelativeDateString,
    getValidRange,
    isEquipmentAvailable
} from "../../../utils/EquipmentBooking";

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
    currentError: number,
}

class EquipmentRentScreen extends React.Component<Props, State> {

    state = {
        dialogVisible: false,
        errorDialogVisible: false,
        markedDates: {},
        currentError: 0,
    }

    item: Device | null;
    bookedDates: Array<string>;

    bookRef: { current: null | Animatable.View }
    canBookEquipment: boolean;

    lockedDates: { [key: string]: { startingDay: boolean, endingDay: boolean, color: string } }

    constructor(props: Props) {
        super(props);
        this.resetSelection();
        this.bookRef = React.createRef();
        this.canBookEquipment = false;
        this.bookedDates = [];
        if (this.props.route.params != null) {
            if (this.props.route.params.item != null)
                this.item = this.props.route.params.item;
            else
                this.item = null;
        }
        const item = this.item;
        if (item != null) {
            this.lockedDates = {};
            for (let i = 0; i < item.booked_at.length; i++) {
                const range = getValidRange(new Date(item.booked_at[i].begin), new Date(item.booked_at[i].end), null);
                this.lockedDates = {
                    ...this.lockedDates,
                    ...generateMarkedDates(
                        false,
                        this.props.theme,
                        range
                    )
                };
            }
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
        if (this.bookedDates.length > 0) {
            this.resetSelection();
            this.updateMarkedSelection();
            return true;
        } else
            return false;
    };

    /**
     * Selects a new date on the calendar.
     * If both start and end dates are already selected, unselect all.
     *
     * @param day The day selected
     */
    selectNewDate = (day: { dateString: string, day: number, month: number, timestamp: number, year: number }) => {
        const selected = new Date(day.dateString);
        const start = this.getBookStartDate();

        if (!(this.lockedDates.hasOwnProperty(day.dateString))) {
            if (start === null) {
                this.updateSelectionRange(selected, selected);
                this.enableBooking();
            } else if (start.getTime() === selected.getTime()) {
                this.resetSelection();
            } else if (this.bookedDates.length === 1) {
                this.updateSelectionRange(start, selected);
                this.enableBooking();
            } else
                this.resetSelection();
            this.updateMarkedSelection();
        }
    }

    updateSelectionRange(start: Date, end: Date) {
        this.bookedDates = getValidRange(start, end, this.item);
    }

    updateMarkedSelection() {
        this.setState({
            markedDates: generateMarkedDates(
                true,
                this.props.theme,
                this.bookedDates
            ),
        });
    }

    enableBooking() {
        if (!this.canBookEquipment) {
            this.showBookButton();
            this.canBookEquipment = true;
        }
    }

    resetSelection() {
        if (this.canBookEquipment)
            this.hideBookButton();
        this.canBookEquipment = false;
        this.bookedDates = [];
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
            const start = this.getBookStartDate();
            const end = this.getBookEndDate();
            if (item != null && start != null && end != null) {
                ConnectionManager.getInstance().authenticatedRequest(
                    "location/booking",
                    {
                        "device": item.id,
                        "begin": getISODate(start),
                        "end": getISODate(end),
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

    getBookStartDate() {
        return this.bookedDates.length > 0 ? new Date(this.bookedDates[0]) : null;
    }

    getBookEndDate() {
        const length = this.bookedDates.length;
        return length > 0 ? new Date(this.bookedDates[length - 1]) : null;
    }

    render() {
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;

        const item = this.item;
        const start = this.getBookStartDate();
        const end = this.getBookEndDate();

        if (item != null) {
            const isAvailable = isEquipmentAvailable(item);
            const firstAvailability = getFirstEquipmentAvailability(item);
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
                                    {i18n.t('equipmentScreen.available', {date: getRelativeDateString(firstAvailability)})}
                                </Button>
                                <Subheading style={{
                                    textAlign: "center",
                                    marginBottom: 10,
                                    minHeight: 50
                                }}>
                                    {
                                        start == null
                                            ? i18n.t('equipmentScreen.booking')
                                            : end != null && start.getTime() !== end.getTime()
                                            ? i18n.t('equipmentScreen.bookingPeriod', {
                                                begin: getRelativeDateString(start),
                                                end: getRelativeDateString(end)
                                            })
                                            : i18n.t('equipmentScreen.bookingDay', {
                                                date: getRelativeDateString(start)
                                            })
                                    }

                                </Subheading>
                            </Card.Content>
                        </Card>
                        <CalendarList
                            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                            minDate={new Date()}
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
                            markedDates={{...this.lockedDates, ...this.state.markedDates}}

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
