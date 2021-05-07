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

import * as React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Agenda, AgendaProps } from 'react-native-calendars';
import GENERAL_STYLES from '../../constants/Styles';

type PropsType = {
  onRef: (ref: Agenda<any>) => void;
} & AgendaProps<any>;

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
function CustomAgenda(props: PropsType) {
  const theme = useTheme();
  function getAgenda() {
    return (
      <Agenda
        {...props}
        ref={props.onRef}
        theme={{
          backgroundColor: theme.colors.agendaBackgroundColor,
          calendarBackground: theme.colors.background,
          textSectionTitleColor: theme.colors.agendaDayTextColor,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.text,
          textDisabledColor: theme.colors.agendaDayTextColor,
          dotColor: theme.colors.primary,
          selectedDotColor: '#ffffff',
          arrowColor: 'orange',
          monthTextColor: theme.colors.primary,
          indicatorColor: theme.colors.primary,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
          agendaDayTextColor: theme.colors.agendaDayTextColor,
          agendaDayNumColor: theme.colors.agendaDayTextColor,
          agendaTodayColor: theme.colors.primary,
          agendaKnobColor: theme.colors.primary,
        }}
      />
    );
  }

  // Completely recreate the component on theme change to force theme reload
  if (theme.dark) {
    return <View style={GENERAL_STYLES.flex}>{getAgenda()}</View>;
  }
  return getAgenda();
}

export default CustomAgenda;
