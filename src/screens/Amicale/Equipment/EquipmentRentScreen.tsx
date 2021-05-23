/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  Button,
  Caption,
  Card,
  Headline,
  Subheading,
  useTheme,
} from 'react-native-paper';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { BackHandler, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import i18n from 'i18n-js';
import { CalendarList, PeriodMarking } from 'react-native-calendars';
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
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import { MainStackParamsList } from '../../../navigation/MainNavigator';
import GENERAL_STYLES from '../../../constants/Styles';
import { ApiRejectType } from '../../../utils/WebData';
import { REQUEST_STATUS } from '../../../utils/Requests';
import { useFocusEffect } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import { useAuthenticatedRequest } from '../../../context/loginContext';

type Props = StackScreenProps<MainStackParamsList, 'equipment-rent'>;

export type MarkedDatesObjectType = {
  [key: string]: PeriodMarking;
};

const styles = StyleSheet.create({
  titleContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    textAlign: 'center',
  },
  caption: {
    textAlign: 'center',
    lineHeight: 35,
    marginLeft: 10,
  },
  card: {
    margin: 5,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 10,
    minHeight: 50,
  },
  calendar: {
    marginBottom: 50,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    flex: 1,
    transform: [{ translateY: 100 }],
  },
  button: {
    width: '80%',
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
    borderRadius: 10,
  },
});

function EquipmentRentScreen(props: Props) {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [currentError, setCurrentError] = useState<ApiRejectType>({
    status: REQUEST_STATUS.SUCCESS,
  });
  const [markedDates, setMarkedDates] = useState<MarkedDatesObjectType>({});
  const [dialogVisible, setDialogVisible] = useState(false);

  const item = props.route.params.item;

  const bookedDates = useRef<Array<string>>([]);
  const canBookEquipment = useRef(false);

  const bookRef = useRef<Animatable.View & View>(null);

  let lockedDates: {
    [key: string]: PeriodMarking;
  } = {};

  if (item) {
    item.booked_at.forEach((date: { begin: string; end: string }) => {
      const range = getValidRange(
        new Date(date.begin),
        new Date(date.end),
        null
      );
      lockedDates = {
        ...lockedDates,
        ...generateMarkedDates(false, theme, range),
      };
    });
  }

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid
      );
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid
        );
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  /**
   * Overrides default android back button behaviour to deselect date if any is selected.
   *
   * @return {boolean}
   */
  const onBackButtonPressAndroid = (): boolean => {
    if (bookedDates.current.length > 0) {
      resetSelection();
      updateMarkedSelection();
      return true;
    }
    return false;
  };

  const showDialog = () => setDialogVisible(true);

  const onDialogDismiss = () => setDialogVisible(false);

  const onErrorDialogDismiss = () =>
    setCurrentError({ status: REQUEST_STATUS.SUCCESS });

  const getBookStartDate = (): Date | null => {
    return bookedDates.current.length > 0
      ? new Date(bookedDates.current[0])
      : null;
  };

  const getBookEndDate = (): Date | null => {
    const { length } = bookedDates.current;
    return length > 0 ? new Date(bookedDates.current[length - 1]) : null;
  };

  const start = getBookStartDate();
  const end = getBookEndDate();
  const request = useAuthenticatedRequest(
    'location/booking',
    item && start && end
      ? {
          device: item.id,
          begin: getISODate(start),
          end: getISODate(end),
        }
      : undefined
  );

  /**
   * Sends the selected data to the server and waits for a response.
   * If the request is a success, navigate to the recap screen.
   * If it is an error, display the error to the user.
   *
   * @returns {Promise<void>}
   */
  const onDialogAccept = (): Promise<void> => {
    return new Promise((resolve: () => void) => {
      if (item != null && start != null && end != null) {
        request()
          .then(() => {
            onDialogDismiss();
            navigation.replace('equipment-confirm', {
              item: item,
              dates: [getISODate(start), getISODate(end)],
            });
            resolve();
          })
          .catch((error: ApiRejectType) => {
            onDialogDismiss();
            setCurrentError(error);
            resolve();
          });
      } else {
        onDialogDismiss();
        resolve();
      }
    });
  };

  /**
   * Selects a new date on the calendar.
   * If both start and end dates are already selected, unselect all.
   *
   * @param day The day selected
   */
  const selectNewDate = (day: {
    dateString: string;
    day: number;
    month: number;
    timestamp: number;
    year: number;
  }) => {
    const selected = new Date(day.dateString);

    if (!lockedDates[day.dateString] != null) {
      if (start === null) {
        updateSelectionRange(selected, selected);
        enableBooking();
      } else if (start.getTime() === selected.getTime()) {
        resetSelection();
      } else if (bookedDates.current.length === 1) {
        updateSelectionRange(start, selected);
        enableBooking();
      } else {
        resetSelection();
      }
      updateMarkedSelection();
    }
  };

  const showBookButton = () => {
    if (bookRef.current && bookRef.current.fadeInUp) {
      bookRef.current.fadeInUp(500);
    }
  };

  const hideBookButton = () => {
    if (bookRef.current && bookRef.current.fadeOutDown) {
      bookRef.current.fadeOutDown(500);
    }
  };

  const enableBooking = () => {
    if (!canBookEquipment.current) {
      showBookButton();
      canBookEquipment.current = true;
    }
  };

  const resetSelection = () => {
    if (canBookEquipment.current) {
      hideBookButton();
    }
    canBookEquipment.current = false;
    bookedDates.current = [];
  };

  const updateSelectionRange = (s: Date, e: Date) => {
    if (item) {
      bookedDates.current = getValidRange(s, e, item);
    } else {
      bookedDates.current = [];
    }
  };

  const updateMarkedSelection = () => {
    setMarkedDates(generateMarkedDates(true, theme, bookedDates.current));
  };

  let subHeadingText;

  if (start == null) {
    subHeadingText = i18n.t('screens.equipment.booking');
  } else if (end != null && start.getTime() !== end.getTime()) {
    subHeadingText = i18n.t('screens.equipment.bookingPeriod', {
      begin: getRelativeDateString(start),
      end: getRelativeDateString(end),
    });
  } else {
    subHeadingText = i18n.t('screens.equipment.bookingDay', {
      date: getRelativeDateString(start),
    });
  }

  if (item) {
    const isAvailable = isEquipmentAvailable(item);
    const firstAvailability = getFirstEquipmentAvailability(item);
    return (
      <View style={GENERAL_STYLES.flex}>
        <CollapsibleScrollView>
          <Card style={styles.card}>
            <Card.Content>
              <View style={GENERAL_STYLES.flex}>
                <View style={styles.titleContainer}>
                  <Headline style={styles.title}>{item.name}</Headline>
                  <Caption style={styles.caption}>
                    ({i18n.t('screens.equipment.bail', { cost: item.caution })})
                  </Caption>
                </View>
              </View>

              <Button
                icon={isAvailable ? 'check-circle-outline' : 'update'}
                color={
                  isAvailable ? theme.colors.success : theme.colors.primary
                }
                mode="text"
              >
                {i18n.t('screens.equipment.available', {
                  date: getRelativeDateString(firstAvailability),
                })}
              </Button>
              <Subheading style={styles.subtitle}>{subHeadingText}</Subheading>
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
            onDayPress={selectNewDate}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
            firstDay={1}
            // Hide month navigation arrows.
            hideArrows={false}
            // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
            markingType={'period'}
            markedDates={{ ...lockedDates, ...markedDates }}
            theme={{
              'backgroundColor': theme.colors.agendaBackgroundColor,
              'calendarBackground': theme.colors.background,
              'textSectionTitleColor': theme.colors.agendaDayTextColor,
              'selectedDayBackgroundColor': theme.colors.primary,
              'selectedDayTextColor': '#ffffff',
              'todayTextColor': theme.colors.text,
              'dayTextColor': theme.colors.text,
              'textDisabledColor': theme.colors.agendaDayTextColor,
              'dotColor': theme.colors.primary,
              'selectedDotColor': '#ffffff',
              'arrowColor': theme.colors.primary,
              'monthTextColor': theme.colors.text,
              'indicatorColor': theme.colors.primary,
              'textDayFontFamily': 'monospace',
              'textMonthFontFamily': 'monospace',
              'textDayHeaderFontFamily': 'monospace',
              'textDayFontWeight': '300',
              'textMonthFontWeight': 'bold',
              'textDayHeaderFontWeight': '300',
              'textDayFontSize': 16,
              'textMonthFontSize': 16,
              'textDayHeaderFontSize': 16,
              'stylesheet.day.period': {
                base: {
                  overflow: 'hidden',
                  height: 34,
                  width: 34,
                  alignItems: 'center',
                },
              },
            }}
            style={styles.calendar}
          />
        </CollapsibleScrollView>
        <LoadingConfirmDialog
          visible={dialogVisible}
          onDismiss={onDialogDismiss}
          onAccept={onDialogAccept}
          title={i18n.t('screens.equipment.dialogTitle')}
          titleLoading={i18n.t('screens.equipment.dialogTitleLoading')}
          message={i18n.t('screens.equipment.dialogMessage')}
        />

        <ErrorDialog
          visible={
            currentError.status !== REQUEST_STATUS.SUCCESS ||
            currentError.code !== undefined
          }
          onDismiss={onErrorDialogDismiss}
          status={currentError.status}
          code={currentError.code}
        />
        <Animatable.View
          ref={bookRef}
          useNativeDriver
          style={styles.buttonContainer}
        >
          <Button
            icon="bookmark-check"
            mode="contained"
            onPress={showDialog}
            style={styles.button}
          >
            {i18n.t('screens.equipment.bookButton')}
          </Button>
        </Animatable.View>
      </View>
    );
  }
  return null;
}

export default EquipmentRentScreen;
