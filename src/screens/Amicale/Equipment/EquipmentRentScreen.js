// @flow

import * as React from 'react';
import {
  Button,
  Caption,
  Card,
  Headline,
  Subheading,
  withTheme,
} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {BackHandler, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import i18n from 'i18n-js';
import {CalendarList} from 'react-native-calendars';
import type {DeviceType} from './EquipmentListScreen';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import LoadingConfirmDialog from '../../../components/Dialogs/LoadingConfirmDialog';
import ErrorDialog from '../../../components/Dialogs/ErrorDialog';
import {
  generateMarkedDates,
  getFirstEquipmentAvailability,
  getISODate,
  getRelativeDateString,
  getValidRange,
  isEquipmentAvailable,
} from '../../../utils/EquipmentBooking';
import ConnectionManager from '../../../managers/ConnectionManager';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';

type PropsType = {
  navigation: StackNavigationProp,
  route: {
    params?: {
      item?: DeviceType,
    },
  },
  theme: CustomThemeType,
};

export type MarkedDatesObjectType = {
  [key: string]: {startingDay: boolean, endingDay: boolean, color: string},
};

type StateType = {
  dialogVisible: boolean,
  errorDialogVisible: boolean,
  markedDates: MarkedDatesObjectType,
  currentError: number,
};

class EquipmentRentScreen extends React.Component<PropsType, StateType> {
  item: DeviceType | null;

  bookedDates: Array<string>;

  bookRef: {current: null | Animatable.View};

  canBookEquipment: boolean;

  lockedDates: {
    [key: string]: {startingDay: boolean, endingDay: boolean, color: string},
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      dialogVisible: false,
      errorDialogVisible: false,
      markedDates: {},
      currentError: 0,
    };
    this.resetSelection();
    this.bookRef = React.createRef();
    this.canBookEquipment = false;
    this.bookedDates = [];
    if (props.route.params != null) {
      if (props.route.params.item != null) this.item = props.route.params.item;
      else this.item = null;
    }
    const {item} = this;
    if (item != null) {
      this.lockedDates = {};
      item.booked_at.forEach((date: {begin: string, end: string}) => {
        const range = getValidRange(
          new Date(date.begin),
          new Date(date.end),
          null,
        );
        this.lockedDates = {
          ...this.lockedDates,
          ...generateMarkedDates(false, props.theme, range),
        };
      });
    }
  }

  /**
   * Captures focus and blur events to hook on android back button
   */
  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', () => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      );
    });
    navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      );
    });
  }

  /**
   * Overrides default android back button behaviour to deselect date if any is selected.
   *
   * @return {boolean}
   */
  onBackButtonPressAndroid = (): boolean => {
    if (this.bookedDates.length > 0) {
      this.resetSelection();
      this.updateMarkedSelection();
      return true;
    }
    return false;
  };

  onDialogDismiss = () => {
    this.setState({dialogVisible: false});
  };

  onErrorDialogDismiss = () => {
    this.setState({errorDialogVisible: false});
  };

  /**
   * Sends the selected data to the server and waits for a response.
   * If the request is a success, navigate to the recap screen.
   * If it is an error, display the error to the user.
   *
   * @returns {Promise<void>}
   */
  onDialogAccept = (): Promise<void> => {
    return new Promise((resolve: () => void) => {
      const {item, props} = this;
      const start = this.getBookStartDate();
      const end = this.getBookEndDate();
      if (item != null && start != null && end != null) {
        ConnectionManager.getInstance()
          .authenticatedRequest('location/booking', {
            device: item.id,
            begin: getISODate(start),
            end: getISODate(end),
          })
          .then(() => {
            this.onDialogDismiss();
            props.navigation.replace('equipment-confirm', {
              item: this.item,
              dates: [getISODate(start), getISODate(end)],
            });
            resolve();
          })
          .catch((error: number) => {
            this.onDialogDismiss();
            this.showErrorDialog(error);
            resolve();
          });
      } else {
        this.onDialogDismiss();
        resolve();
      }
    });
  };

  getBookStartDate(): Date | null {
    return this.bookedDates.length > 0 ? new Date(this.bookedDates[0]) : null;
  }

  getBookEndDate(): Date | null {
    const {length} = this.bookedDates;
    return length > 0 ? new Date(this.bookedDates[length - 1]) : null;
  }

  /**
   * Selects a new date on the calendar.
   * If both start and end dates are already selected, unselect all.
   *
   * @param day The day selected
   */
  selectNewDate = (day: {
    dateString: string,
    day: number,
    month: number,
    timestamp: number,
    year: number,
  }) => {
    const selected = new Date(day.dateString);
    const start = this.getBookStartDate();

    if (!this.lockedDates[day.dateString] != null) {
      if (start === null) {
        this.updateSelectionRange(selected, selected);
        this.enableBooking();
      } else if (start.getTime() === selected.getTime()) {
        this.resetSelection();
      } else if (this.bookedDates.length === 1) {
        this.updateSelectionRange(start, selected);
        this.enableBooking();
      } else this.resetSelection();
      this.updateMarkedSelection();
    }
  };

  showErrorDialog = (error: number) => {
    this.setState({
      errorDialogVisible: true,
      currentError: error,
    });
  };

  showDialog = () => {
    this.setState({dialogVisible: true});
  };

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

  enableBooking() {
    if (!this.canBookEquipment) {
      this.showBookButton();
      this.canBookEquipment = true;
    }
  }

  resetSelection() {
    if (this.canBookEquipment) this.hideBookButton();
    this.canBookEquipment = false;
    this.bookedDates = [];
  }

  updateSelectionRange(start: Date, end: Date) {
    this.bookedDates = getValidRange(start, end, this.item);
  }

  updateMarkedSelection() {
    const {theme} = this.props;
    this.setState({
      markedDates: generateMarkedDates(true, theme, this.bookedDates),
    });
  }

  render(): React.Node {
    const {item, props, state} = this;
    const start = this.getBookStartDate();
    const end = this.getBookEndDate();
    let subHeadingText;
    if (start == null) subHeadingText = i18n.t('screens.equipment.booking');
    else if (end != null && start.getTime() !== end.getTime())
      subHeadingText = i18n.t('screens.equipment.bookingPeriod', {
        begin: getRelativeDateString(start),
        end: getRelativeDateString(end),
      });
    else
      i18n.t('screens.equipment.bookingDay', {
        date: getRelativeDateString(start),
      });
    if (item != null) {
      const isAvailable = isEquipmentAvailable(item);
      const firstAvailability = getFirstEquipmentAvailability(item);
      return (
        <View style={{flex: 1}}>
          <CollapsibleScrollView>
            <Card style={{margin: 5}}>
              <Card.Content>
                <View style={{flex: 1}}>
                  <View
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    <Headline style={{textAlign: 'center'}}>
                      {item.name}
                    </Headline>
                    <Caption
                      style={{
                        textAlign: 'center',
                        lineHeight: 35,
                        marginLeft: 10,
                      }}>
                      ({i18n.t('screens.equipment.bail', {cost: item.caution})})
                    </Caption>
                  </View>
                </View>

                <Button
                  icon={isAvailable ? 'check-circle-outline' : 'update'}
                  color={
                    isAvailable
                      ? props.theme.colors.success
                      : props.theme.colors.primary
                  }
                  mode="text">
                  {i18n.t('screens.equipment.available', {
                    date: getRelativeDateString(firstAvailability),
                  })}
                </Button>
                <Subheading
                  style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    minHeight: 50,
                  }}>
                  {subHeadingText}
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
              horizontal
              // Enable paging on horizontal, default = false
              pagingEnabled
              // Handler which gets executed on day press. Default = undefined
              onDayPress={this.selectNewDate}
              // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
              firstDay={1}
              // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
              disableAllTouchEventsForDisabledDays
              // Hide month navigation arrows.
              hideArrows={false}
              // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
              markingType="period"
              markedDates={{...this.lockedDates, ...state.markedDates}}
              theme={{
                backgroundColor: props.theme.colors.agendaBackgroundColor,
                calendarBackground: props.theme.colors.background,
                textSectionTitleColor: props.theme.colors.agendaDayTextColor,
                selectedDayBackgroundColor: props.theme.colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: props.theme.colors.text,
                dayTextColor: props.theme.colors.text,
                textDisabledColor: props.theme.colors.agendaDayTextColor,
                dotColor: props.theme.colors.primary,
                selectedDotColor: '#ffffff',
                arrowColor: props.theme.colors.primary,
                monthTextColor: props.theme.colors.text,
                indicatorColor: props.theme.colors.primary,
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
                  },
                },
              }}
              style={{marginBottom: 50}}
            />
          </CollapsibleScrollView>
          <LoadingConfirmDialog
            visible={state.dialogVisible}
            onDismiss={this.onDialogDismiss}
            onAccept={this.onDialogAccept}
            title={i18n.t('screens.equipment.dialogTitle')}
            titleLoading={i18n.t('screens.equipment.dialogTitleLoading')}
            message={i18n.t('screens.equipment.dialogMessage')}
          />

          <ErrorDialog
            visible={state.errorDialogVisible}
            onDismiss={this.onErrorDialogDismiss}
            errorCode={state.currentError}
          />
          <Animatable.View
            ref={this.bookRef}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              flex: 1,
              transform: [{translateY: 100}],
            }}>
            <Button
              icon="bookmark-check"
              mode="contained"
              onPress={this.showDialog}
              style={{
                width: '80%',
                flex: 1,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 20,
                borderRadius: 10,
              }}>
              {i18n.t('screens.equipment.bookButton')}
            </Button>
          </Animatable.View>
        </View>
      );
    }
    return null;
  }
}

export default withTheme(EquipmentRentScreen);
