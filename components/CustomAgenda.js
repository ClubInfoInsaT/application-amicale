import * as React from 'react';
import {withTheme} from 'react-native-paper';
import {Agenda} from "react-native-calendars";

/**
 * Abstraction layer for Agenda component, using custom configuration
 *
 * @param props Props to pass to the element. Must specify an onRef prop to get an Agenda ref.
 * @return {*}
 */
function CustomAgenda(props) {
    const {colors} = props.theme;
    return (
        <Agenda
            {...props}
            ref={props.onRef}
            theme={{
                backgroundColor: colors.agendaBackgroundColor,
                calendarBackground: colors.background,
                textSectionTitleColor: colors.agendaDayTextColor,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: colors.primary,
                dayTextColor: colors.text,
                textDisabledColor: colors.agendaDayTextColor,
                dotColor: colors.primary,
                selectedDotColor: '#ffffff',
                arrowColor: 'orange',
                monthTextColor: colors.primary,
                indicatorColor: colors.primary,
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16,
                agendaDayTextColor: colors.agendaDayTextColor,
                agendaDayNumColor: colors.agendaDayTextColor,
                agendaTodayColor: colors.primary,
                agendaKnobColor: colors.primary,
            }}
        />
    );
}

export default withTheme(CustomAgenda);
