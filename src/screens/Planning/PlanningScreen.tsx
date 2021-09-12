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
import { BackHandler, StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { Avatar, Divider, List } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { readData } from '../../utils/WebData';
import {
  generateEventAgenda,
  getCurrentDateString,
  getDateOnlyString,
  getTimeOnlyString,
  PlanningEventType,
} from '../../utils/Planning';
import CustomAgenda from '../../components/Overrides/CustomAgenda';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import GENERAL_STYLES from '../../constants/Styles';
import Urls from '../../constants/Urls';
import { MainRoutes } from '../../navigation/MainNavigator';

LocaleConfig.locales.fr = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  today: "Aujourd'hui",
};

type PropsType = {
  navigation: StackNavigationProp<any>;
};

type StateType = {
  refreshing: boolean;
  agendaItems: { [key: string]: Array<PlanningEventType> };
  calendarShowing: boolean;
};

const AGENDA_MONTH_SPAN = 3;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});

/**
 * Class defining the app's planning screen
 */
class PlanningScreen extends React.Component<PropsType, StateType> {
  agendaRef: null | Agenda<any>;

  lastRefresh: Date | null;

  minTimeBetweenRefresh = 60;

  currentDate: string | null;

  constructor(props: PropsType) {
    super(props);
    if (i18n.currentLocale().startsWith('fr')) {
      LocaleConfig.defaultLocale = 'fr';
    }
    this.agendaRef = null;
    this.currentDate = getDateOnlyString(getCurrentDateString());
    this.lastRefresh = null;
    this.state = {
      refreshing: false,
      agendaItems: {},
      calendarShowing: false,
    };
  }

  /**
   * Captures focus and blur events to hook on android back button
   */
  componentDidMount() {
    const { navigation } = this.props;
    this.onRefresh();
    navigation.addListener('focus', () => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid
      );
    });
    navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid
      );
    });
  }

  /**
   * Overrides default android back button behaviour to close the calendar if it was open.
   *
   * @return {boolean}
   */
  onBackButtonPressAndroid = (): boolean => {
    const { calendarShowing } = this.state;
    if (calendarShowing && this.agendaRef != null) {
      // @ts-ignore
      this.agendaRef.chooseDay(this.agendaRef.state.selectedDay);
      return true;
    }
    return false;
  };

  /**
   * Refreshes data and shows an animation while doing it
   */
  onRefresh = () => {
    let canRefresh;
    if (this.lastRefresh) {
      canRefresh =
        (new Date().getTime() - this.lastRefresh.getTime()) / 1000 >
        this.minTimeBetweenRefresh;
    } else {
      canRefresh = true;
    }

    if (canRefresh) {
      this.setState({ refreshing: true });
      readData<Array<PlanningEventType>>(Urls.amicale.events)
        .then((fetchedData) => {
          this.setState({
            refreshing: false,
            agendaItems: generateEventAgenda(fetchedData, AGENDA_MONTH_SPAN),
          });
          this.lastRefresh = new Date();
        })
        .catch(() => {
          this.setState({
            refreshing: false,
          });
        });
    }
  };

  /**
   * Callback used when receiving the agenda ref
   *
   * @param ref
   */
  onAgendaRef = (ref: Agenda<any>) => {
    this.agendaRef = ref;
  };

  /**
   * Callback used when a button is pressed to toggle the calendar
   *
   * @param isCalendarOpened True is the calendar is already open, false otherwise
   */
  onCalendarToggled = (isCalendarOpened: boolean) => {
    this.setState({ calendarShowing: isCalendarOpened });
  };

  /**
   * Gets an event render item
   *
   * @param item The current event to render
   * @return {*}
   */
  getRenderItem = (item: PlanningEventType) => {
    const { navigation } = this.props;
    const onPress = () => {
      navigation.navigate(MainRoutes.PlanningInformation, {
        data: item,
      });
    };
    const logo = item.logo;
    if (logo) {
      return (
        <View>
          <Divider />
          <List.Item
            title={item.title}
            description={getTimeOnlyString(item.date_begin)}
            left={() => (
              <Avatar.Image source={{ uri: logo }} style={styles.icon} />
            )}
            onPress={onPress}
          />
        </View>
      );
    }
    return (
      <View>
        <Divider />
        <List.Item
          title={item.title}
          description={getTimeOnlyString(item.date_begin)}
          onPress={onPress}
        />
      </View>
    );
  };

  /**
   * Gets an empty render item for an empty date
   *
   * @return {*}
   */
  getRenderEmptyDate = () => <Divider />;

  render() {
    const { state, props } = this;
    return (
      <View style={GENERAL_STYLES.flex}>
        <CustomAgenda
          {...props}
          // the list of items that have to be displayed in agenda. If you want to render item as empty date
          // the value of date key kas to be an empty array []. If there exists no value for date key it is
          // considered that the date in question is not yet loaded
          items={state.agendaItems}
          // initially selected day
          selected={this.currentDate ? this.currentDate : undefined}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={this.currentDate ? this.currentDate : undefined}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={1}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={AGENDA_MONTH_SPAN}
          // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
          onRefresh={this.onRefresh}
          // callback that fires when the calendar is opened or closed
          onCalendarToggled={this.onCalendarToggled}
          // Set this true while waiting for new data from a refresh
          refreshing={state.refreshing}
          renderItem={this.getRenderItem}
          renderEmptyDate={this.getRenderEmptyDate}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          // ref to this agenda in order to handle back button event
          onRef={this.onAgendaRef}
          rowHasChanged={(r1: PlanningEventType, r2: PlanningEventType) =>
            r1.id !== r2.id
          }
        />
        <MascotPopup
          title={i18n.t('screens.planning.mascotDialog.title')}
          message={i18n.t('screens.planning.mascotDialog.message')}
          icon="party-popper"
          buttons={{
            cancel: {
              message: i18n.t('screens.planning.mascotDialog.button'),
              icon: 'check',
            },
          }}
          emotion={MASCOT_STYLE.HAPPY}
        />
      </View>
    );
  }
}

export default PlanningScreen;
