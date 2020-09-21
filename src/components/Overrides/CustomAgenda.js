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

// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import {Agenda} from 'react-native-calendars';
import type {CustomThemeType} from '../../managers/ThemeManager';

type PropsType = {
  theme: CustomThemeType,
  onRef: (ref: Agenda) => void,
};

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class CustomAgenda extends React.Component<PropsType> {
  getAgenda(): React.Node {
    const {props} = this;
    return (
      <Agenda
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        ref={props.onRef}
        theme={{
          backgroundColor: props.theme.colors.agendaBackgroundColor,
          calendarBackground: props.theme.colors.background,
          textSectionTitleColor: props.theme.colors.agendaDayTextColor,
          selectedDayBackgroundColor: props.theme.colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: props.theme.colors.primary,
          dayTextColor: props.theme.colors.text,
          textDisabledColor: props.theme.colors.agendaDayTextColor,
          dotColor: props.theme.colors.primary,
          selectedDotColor: '#ffffff',
          arrowColor: 'orange',
          monthTextColor: props.theme.colors.primary,
          indicatorColor: props.theme.colors.primary,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
          agendaDayTextColor: props.theme.colors.agendaDayTextColor,
          agendaDayNumColor: props.theme.colors.agendaDayTextColor,
          agendaTodayColor: props.theme.colors.primary,
          agendaKnobColor: props.theme.colors.primary,
        }}
      />
    );
  }

  render(): React.Node {
    const {props} = this;
    // Completely recreate the component on theme change to force theme reload
    if (props.theme.dark)
      return <View style={{flex: 1}}>{this.getAgenda()}</View>;
    return this.getAgenda();
  }
}

export default withTheme(CustomAgenda);
