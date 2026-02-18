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
import {
  BackHandler,
  NativeEventSubscription,
  StyleSheet,
  View,
} from 'react-native';
import i18n from 'i18n-js';
import { Avatar, Divider, List } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { readData } from '../../utils/WebData';
import {
  generateEventAgenda,
  dateToDateString,
  PlanningEventType,
  getSubtitle,
} from '../../utils/Planning';
import EventList from '../../components/Lists/EventList';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import GENERAL_STYLES from '../../constants/Styles';
import Urls from '../../constants/Urls';
import { MainRoutes } from '../../navigation/MainNavigator';

type PropsType = {
  navigation: StackNavigationProp<any>;
};

type GetEventsResponseType = {
  data: {
    events: PlanningEventType[];
  };
};

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});

/**
 * Class defining the app's planning screen
 */
function PlanningScreen(props: PropsType) {
  let minTimeBetweenRefresh = 5;
  let currentDate: string | null = dateToDateString(new Date());

  const [lastRefresh, setLastRefresh] = React.useState<Date | null>(null);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [agendaItems, setAgendaItems] = React.useState<{
    [key: string]: Array<PlanningEventType>;
  }>({});
  const [selectedDate, setSelectedDate] = React.useState<string | undefined>(
    currentDate ? currentDate : undefined
  );

  React.useEffect(() => {
    const { navigation } = props;
    onRefresh();
    let subscription: NativeEventSubscription;
    navigation.addListener('focus', () => {
      subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid
      );
    });
    navigation.addListener('blur', () => {
      if (subscription) subscription.remove();
    });
  });

  /**
   * Overrides default android back button behaviour (no special handling needed for event list).
   *
   * @return {boolean}
   */
  const onBackButtonPressAndroid = (): boolean => {
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
   * Callback used when a date is selected in the event list
   *
   * @param date The selected date string
   */
  const onDateChange = (date: string) => {
    setSelectedDate(date);
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
    const subtitle = getSubtitle(event, false);
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
      <EventList
        eventsByDate={agendaItems}
        selectedDate={selectedDate}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={getRenderItem}
        renderEmptyDate={getRenderEmptyDate}
        renderEmptyData={getRenderNoEvents}
        onDateChange={onDateChange}
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
