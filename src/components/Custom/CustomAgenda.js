import * as React from 'react';
import {View} from "react-native";
import {withTheme} from 'react-native-paper';
import {Agenda} from "react-native-calendars";

type Props = {
    theme: Object,
}

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class CustomAgenda extends React.Component<Props> {

    getAgenda() {
        return <Agenda
            {...this.props}
            ref={this.props.onRef}
            theme={{
                backgroundColor: this.props.theme.colors.agendaBackgroundColor,
                calendarBackground: this.props.theme.colors.background,
                textSectionTitleColor: this.props.theme.colors.agendaDayTextColor,
                selectedDayBackgroundColor: this.props.theme.colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: this.props.theme.colors.primary,
                dayTextColor: this.props.theme.colors.text,
                textDisabledColor: this.props.theme.colors.agendaDayTextColor,
                dotColor: this.props.theme.colors.primary,
                selectedDotColor: '#ffffff',
                arrowColor: 'orange',
                monthTextColor: this.props.theme.colors.primary,
                indicatorColor: this.props.theme.colors.primary,
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16,
                agendaDayTextColor: this.props.theme.colors.agendaDayTextColor,
                agendaDayNumColor: this.props.theme.colors.agendaDayTextColor,
                agendaTodayColor: this.props.theme.colors.primary,
                agendaKnobColor: this.props.theme.colors.primary,
            }}
        />;
    }

    render() {
        // Completely recreate the component on theme change to force theme reload
        if (this.props.theme.dark)
            return (
                <View style={{flex: 1}}>
                    {this.getAgenda()}
                </View>
            );
        else
            return this.getAgenda();
    }
}

export default withTheme(CustomAgenda);
