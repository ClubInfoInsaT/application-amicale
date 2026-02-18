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
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { dateToDateStringHuman, PlanningEventType } from '../../utils/Planning';
import GENERAL_STYLES from '../../constants/Styles';
import i18n from 'i18n-js';
import { TAB_BAR_HEIGHT } from '../Tabbar/CustomTabBar';

type EventListProps = {
  eventsByDate: { [key: string]: Array<PlanningEventType> };
  selectedDate?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  renderItem: (event: PlanningEventType) => React.ReactElement;
  renderEmptyDate?: () => React.ReactElement;
  renderEmptyData?: () => React.ReactElement;
  onDateChange?: (date: string) => void;
};

/**
 * EventList component that replaces the Agenda functionality
 * Displays events grouped by date in a visually similar way to the calendar agenda
 */
function EventList(props: EventListProps) {
  const theme = useTheme();
  const {
    eventsByDate,
    selectedDate,
    onRefresh,
    refreshing = false,
    renderItem,
    renderEmptyDate,
    renderEmptyData,
    onDateChange,
  } = props;

  // Convert eventsByDate to section data for SectionList
  const sections = React.useMemo(() => {
    const sortedDates = Object.keys(eventsByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    return sortedDates.map((date) => ({
      title: date,
      data: eventsByDate[date],
    }));
  }, [eventsByDate]);

  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    const dayNames = [
      i18n.t('date.daysOfWeek.sunday'),
      i18n.t('date.daysOfWeek.monday'),
      i18n.t('date.daysOfWeek.tuesday'),
      i18n.t('date.daysOfWeek.wednesday'),
      i18n.t('date.daysOfWeek.thursday'),
      i18n.t('date.daysOfWeek.friday'),
      i18n.t('date.daysOfWeek.saturday'),
    ];

    // Get the correct day index (0=Sunday, 1=Monday, etc.)
    const dayIndex = date.getDay();
    return dayNames[dayIndex];
  };

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => {
    const date = new Date(title);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDate === title;

    return (
      <TouchableOpacity
        onPress={() => onDateChange?.(title)}
        style={[
          styles.sectionHeader,
          {
            backgroundColor: isSelected
              ? theme.colors.primary
              : theme.colors.agendaBackgroundColor,
          },
        ]}
      >
        <View style={styles.sectionHeaderContent}>
          <Text
            style={[
              styles.sectionHeaderDay,
              {
                color: isSelected ? '#ffffff' : theme.colors.agendaDayTextColor,
              },
            ]}
          >
            {getDayName(title)}
          </Text>
          <Text
            style={[
              styles.sectionHeaderDate,
              {
                color: isSelected ? '#ffffff' : theme.colors.agendaDayTextColor,
              },
            ]}
          >
            {dateToDateStringHuman(date)}
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
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionItem = ({ item }: { item: PlanningEventType }) =>
    renderItem(item);

  const renderSectionEmpty = () => {
    if (renderEmptyDate) {
      return renderEmptyDate();
    }
    return null;
  };

  const ListEmptyComponent = React.useCallback(() => {
    if (renderEmptyData) {
      return renderEmptyData();
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ color: theme.colors.text }}>
          {i18n.t('screens.planning.noEvents')}
        </Text>
      </View>
    );
  }, [renderEmptyData, theme.colors.text]);

  return (
    <View
      style={[
        GENERAL_STYLES.flex,
        { backgroundColor: theme.colors.agendaBackgroundColor },
      ]}
    >
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderSectionItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={ListEmptyComponent}
        renderSectionFooter={renderSectionEmpty}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          ) : undefined
        }
        stickySectionHeadersEnabled={true}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: TAB_BAR_HEIGHT,
  },
  sectionHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderDay: {
    fontWeight: 'bold',
    fontSize: 16,
    minWidth: 80,
  },
  sectionHeaderDate: {
    fontWeight: 'bold',
    fontSize: 16,
    minWidth: 100,
    textAlign: 'center',
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default EventList;
