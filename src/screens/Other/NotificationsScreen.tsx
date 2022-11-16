/*
 * Copyright (c) 2019 - 2022 Arnaud Vergnet & Paul ALNET.
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
import { StyleSheet, View, RefreshControl } from 'react-native';
import i18n from 'i18n-js';
import { StackNavigationProp } from '@react-navigation/stack';
import { readData } from '../../utils/WebData';
import { PlanningEventType } from '../../utils/Planning';
import Urls from '../../constants/Urls';
import { Card } from 'react-native-paper';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import CustomHTML from '../../components/Overrides/CustomHTML';

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  card: {
    margin: 5,
  },
});

type PropsType = {
  navigation: StackNavigationProp<any>;
};

/**
 * Class defining the app's notification display screen
 */
function NotificationsScreen(props: PropsType) {
  let minTimeBetweenRefresh = 6;

  const [lastRefresh, setLastRefresh] = React.useState<Date | null>(null);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  // const [agendaRef, setAgendaRef] = React.useState<Agenda<any> | null>(null);
  const [notificationItems, setNotificationItems] = React.useState<
    Array<PlanningEventType>
  >([]);

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

    if (canRefresh && !refreshing) {
      setRefreshing(true);
      readData<Array<PlanningEventType>>(Urls.amicale.events)
        .then((fetchedData) => {
          setRefreshing(false);
          setNotificationItems(fetchedData);
          setLastRefresh(new Date());
        })
        .catch(() => {
          setRefreshing(false);
        });
    }
  };

  React.useEffect(onRefresh);

  const renderNotificationCard = (item: PlanningEventType) => {
    return (
      <Card style={styles.card} key={item.id}>
        <Card.Title title={item.title} subtitle={item.place} />
        <Card.Content>
          {item.description !== null && item.description !== '<p><br></p>' ? (
            <CustomHTML html={item.description} />
          ) : (
            <View />
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderNotifications = (notifications: Array<PlanningEventType>) => {
    return notifications.map(renderNotificationCard);
  };

  return (
    <CollapsibleScrollView
      style={styles.container}
      hasTab={true}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={40}
        />
      }
    >
      {renderNotifications(notificationItems)}
    </CollapsibleScrollView>
  );
}

export default NotificationsScreen;
