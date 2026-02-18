/*
 * Copyright (c) 2021-2026 Paul Alnet.
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

import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { getISODate } from '../../utils/EquipmentBooking';
import GENERAL_STYLES from '../../constants/Styles';
import i18n from 'i18n-js';
import type { DeviceType } from '../../screens/Amicale/Equipment/EquipmentListScreen';

type DateRangeSelectorProps = {
  minDate: Date;
  futureScrollRange: number;
  firstDay: number;
  lockedDates: { [key: string]: any };
  onDateSelect: (date: Date) => void;
  selectedDates: Array<string>;
  item: DeviceType | null;
};

/**
 * DateRangeSelector component that replaces the CalendarList functionality
 * Allows users to select date ranges for equipment booking
 */
function DateRangeSelector(props: DateRangeSelectorProps) {
  const theme = useTheme();
  const {
    minDate,
    futureScrollRange = 3,
    firstDay = 1,
    lockedDates,
    onDateSelect,
    selectedDates,
  } = props;

  // Generate dates for the range
  const generateDateRange = React.useMemo(() => {
    const dates = [];

    // Add some past dates for context
    const contextStart = new Date(minDate);
    contextStart.setDate(contextStart.getDate() - 3);

    const endDate = new Date(minDate);
    endDate.setMonth(endDate.getMonth() + futureScrollRange);

    for (
      let date = new Date(contextStart);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }

    return dates;
  }, [minDate, futureScrollRange]);

  const getDayName = (date: Date): string => {
    const dayNames = [
      i18n.t('screens.planning.dayNames.sunday'),
      i18n.t('screens.planning.dayNames.monday'),
      i18n.t('screens.planning.dayNames.tuesday'),
      i18n.t('screens.planning.dayNames.wednesday'),
      i18n.t('screens.planning.dayNames.thursday'),
      i18n.t('screens.planning.dayNames.friday'),
      i18n.t('screens.planning.dayNames.saturday'),
    ];

    const dayIndex = (date.getDay() - firstDay + 7) % 7;
    return dayNames[dayIndex];
  };

  const getMonthName = (date: Date): string => {
    const monthNames = [
      i18n.t('screens.planning.monthNames.january'),
      i18n.t('screens.planning.monthNames.february'),
      i18n.t('screens.planning.monthNames.march'),
      i18n.t('screens.planning.monthNames.april'),
      i18n.t('screens.planning.monthNames.may'),
      i18n.t('screens.planning.monthNames.june'),
      i18n.t('screens.planning.monthNames.july'),
      i18n.t('screens.planning.monthNames.august'),
      i18n.t('screens.planning.monthNames.september'),
      i18n.t('screens.planning.monthNames.october'),
      i18n.t('screens.planning.monthNames.november'),
      i18n.t('screens.planning.monthNames.december'),
    ];
    return monthNames[date.getMonth()];
  };

  const isDateLocked = (date: Date): boolean => {
    const dateString = getISODate(date);
    return lockedDates[dateString] !== undefined;
  };

  const isDateSelected = (date: Date): boolean => {
    const dateString = getISODate(date);
    return selectedDates.includes(dateString);
  };

  const isDateInRange = (date: Date): boolean => {
    if (selectedDates.length < 2) return false;

    const dateString = getISODate(date);
    const startDate = new Date(selectedDates[0]);
    const endDate = new Date(selectedDates[selectedDates.length - 1]);
    const currentDate = new Date(dateString);

    return currentDate > startDate && currentDate < endDate;
  };

  const isStartDate = (date: Date): boolean => {
    if (selectedDates.length === 0) return false;
    const dateString = getISODate(date);
    return dateString === selectedDates[0];
  };

  const isEndDate = (date: Date): boolean => {
    if (selectedDates.length === 0) return false;
    const dateString = getISODate(date);
    return dateString === selectedDates[selectedDates.length - 1];
  };

  const renderDateItem = ({ item: date }: { item: Date }) => {
    const isLocked = isDateLocked(date);
    const isSelected = isDateSelected(date);
    const isInRange = isDateInRange(date);
    const isStart = isStartDate(date);
    const isEnd = isEndDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isBeforeMinDate = date < minDate;

    let backgroundColor = theme.colors.agendaBackgroundColor;
    let textColor = theme.colors.text;
    let borderColor = 'transparent';

    if (isBeforeMinDate) {
      backgroundColor = theme.colors.textDisabled;
      textColor = theme.colors.agendaBackgroundColor;
    } else if (isLocked) {
      backgroundColor = theme.colors.textDisabled;
      textColor = theme.colors.agendaBackgroundColor;
    } else if (isSelected) {
      backgroundColor = theme.colors.primary;
      textColor = '#ffffff';
    } else if (isInRange) {
      backgroundColor = theme.colors.danger;
      textColor = '#ffffff';
    }

    if (isStart || isEnd) {
      borderColor = theme.colors.primary;
    }

    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          {
            backgroundColor,
            borderColor,
            opacity: isBeforeMinDate ? 0.5 : 1,
          },
        ]}
        onPress={() => !isLocked && !isBeforeMinDate && onDateSelect(date)}
        disabled={isLocked || isBeforeMinDate}
      >
        <View style={styles.dateItemContent}>
          <Text style={[styles.dateDay, { color: textColor }]}>
            {getDayName(date)}
          </Text>
          <Text style={[styles.dateNumber, { color: textColor }]}>
            {date.getDate()}
          </Text>
          <Text style={[styles.dateMonth, { color: textColor }]}>
            {getMonthName(date)}
          </Text>
          {isToday && (
            <View
              style={[
                styles.todayIndicator,
                {
                  backgroundColor: isSelected
                    ? '#ffffff'
                    : theme.colors.primary,
                },
              ]}
            />
          )}
          {isLocked && (
            <View
              style={[
                styles.lockedIndicator,
                { backgroundColor: theme.colors.danger },
              ]}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMonthHeader = (date: Date) => {
    const monthYear = `${getMonthName(date)} ${date.getFullYear()}`;
    return (
      <View style={styles.monthHeader}>
        <Text style={[styles.monthHeaderText, { color: theme.colors.primary }]}>
          {monthYear}
        </Text>
      </View>
    );
  };

  // Group dates by month
  const datesByMonth = React.useMemo(() => {
    const grouped: Array<{ month: string; dates: Date[] }> = [];
    let currentMonth = '';

    generateDateRange.forEach((date) => {
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      if (monthKey !== currentMonth) {
        grouped.push({
          month: monthKey,
          dates: [date],
        });
        currentMonth = monthKey;
      } else {
        grouped[grouped.length - 1].dates.push(date);
      }
    });

    return grouped;
  }, [generateDateRange]);

  return (
    <View
      style={[
        GENERAL_STYLES.flex,
        { backgroundColor: theme.colors.agendaBackgroundColor },
      ]}
    >
      <FlatList
        data={datesByMonth}
        keyExtractor={(item, index) => item.month + index}
        renderItem={({ item: monthItem }) => (
          <View>
            {renderMonthHeader(monthItem.dates[0])}
            <FlatList
              data={monthItem.dates}
              horizontal
              keyExtractor={(date, index) => getISODate(date) + index}
              renderItem={renderDateItem}
              contentContainerStyle={styles.datesContainer}
            />
          </View>
        )}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  monthHeader: {
    padding: 15,
    backgroundColor: 'transparent',
  },
  monthHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  datesContainer: {
    paddingHorizontal: 5,
  },
  dateItem: {
    width: 80,
    height: 100,
    margin: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
  dateItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  dateMonth: {
    fontSize: 10,
    color: '#666',
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
  },
  lockedIndicator: {
    width: 20,
    height: 2,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 5,
  },
});

export default DateRangeSelector;
