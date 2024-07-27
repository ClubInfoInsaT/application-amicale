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
  dateToDateString,
  dateToTimeString,
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

type GetEventsResponseType = {
  data: {
    events: PlanningEventType[];
  };
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
function PlanningScreen(props: PropsType) {
  let agendaRef: null | Agenda<any>;
  let minTimeBetweenRefresh = 5;
  let currentDate: string | null = dateToDateString(new Date());

  if (i18n.currentLocale().startsWith('fr')) {
    LocaleConfig.defaultLocale = 'fr';
  }

  const [lastRefresh, setLastRefresh] = React.useState<Date | null>(null);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  // const [agendaRef, setAgendaRef] = React.useState<Agenda<any> | null>(null);
  const [agendaItems, setAgendaItems] = React.useState<{
    [key: string]: Array<PlanningEventType>;
  }>({});
  const [calendarShowing, setCalendarShowing] = React.useState<boolean>(false);

  React.useEffect(() => {
    const { navigation } = props;
    onRefresh();
    navigation.addListener('focus', () => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid
      );
    });
    navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid
      );
    });
  });

  /**
   * Overrides default android back button behaviour to close the calendar if it was open.
   *
   * @return {boolean}
   */
  const onBackButtonPressAndroid = (): boolean => {
    if (calendarShowing && agendaRef != null) {
      // @ts-ignore
      agendaRef.chooseDay(agendaRef.state.selectedDay);
      return true;
    }
    return false;
  };

  /**
   * Refreshes data and shows an animation while doing it
   */
  const onRefresh = () => {
    let canRefresh;
    if (lastRefresh) {
      canRefresh =
        (new Date().getTime() - lastRefresh.getTime()) / 1000 >
        minTimeBetweenRefresh;
    } else {
      canRefresh = true;
    }

    if (!refreshing && canRefresh) {
      setRefreshing(true);
      readData<GetEventsResponseType>(Urls.amicale.events)
        .then((response) => {
          setRefreshing(false);
          setAgendaItems(generateEventAgenda(response.data.events));
          setLastRefresh(new Date());
        })
        .catch(() => {
          setRefreshing(false);
        });
    }
  };

  /**
   * Callback used when receiving the agenda ref
   *
   * @param ref
   */
  const onAgendaRef = (ref: Agenda<any>) => {
    // setAgendaRef(ref);
    agendaRef = ref;
  };

  /**
   * Callback used when a button is pressed to toggle the calendar
   *
   * @param isCalendarOpened True is the calendar is already open, false otherwise
   */
  const onCalendarToggled = (isCalendarOpened: boolean) => {
    setCalendarShowing(isCalendarOpened);
  };

  /**
   * Gets an event render item
   *
   * @param event The current event to render
   * @return {*}
   */
  const getRenderItem = (event: PlanningEventType) => {
    const { navigation } = props;
    const onPress = () => {
      navigation.navigate(MainRoutes.PlanningInformation, {
        type: 'full',
        data: event,
      });
    };
    const logoUrl = event.logo;
    const date = new Date(event.start * 1000);
    let subtitle = dateToTimeString(date, true);
    if (event.location) subtitle += ' @ ' + event.location.trim();
    if (logoUrl) {
      return (
        <View>
          <Divider />
          <List.Item
            title={event.title}
            description={subtitle}
            left={() => (
              <Avatar.Image source={{ uri: logoUrl }} style={styles.icon} />
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
          title={event.title}
          description={subtitle}
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
  const getRenderEmptyDate = () => <Divider />;

  /**
   * Renders screen when no events are available. Also displays while loading.
   * Tapping the text attempts to reload
   */
  const getRenderNoEvents = () => {
    // TODO i18n
    return (
      <View>
        <Divider />
        <List.Item
          title={refreshing ? 'En cours de chargement...' : 'Aucun événement'}
          description={
            refreshing
              ? undefined
              : "Aucun événement n'est prévu pour le moment."
          }
          onPress={onRefresh}
        />
      </View>
    );
  };

  return (
    <View style={GENERAL_STYLES.flex}>
      <CustomAgenda
        {...props}
        // the list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key kas to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        items={agendaItems}
        // initially selected day
        selected={currentDate ? currentDate : undefined}
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        minDate={currentDate ? currentDate : undefined}
        // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={1}
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange={AGENDA_MONTH_SPAN}
        // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
        onRefresh={onRefresh}
        // callback that fires when the calendar is opened or closed
        onCalendarToggled={onCalendarToggled}
        // Set this true while waiting for new data from a refresh
        refreshing={refreshing}
        renderItem={getRenderItem}
        renderEmptyDate={getRenderEmptyDate}
        // Specify what should be rendered instead of ActivityIndicator
        renderEmptyData={getRenderNoEvents}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay={1}
        // ref to this agenda in order to handle back button event
        onRef={onAgendaRef}
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

export default PlanningScreen;
