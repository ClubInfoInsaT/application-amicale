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

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { dateToDateString, dateToTimeString } from '../../utils/Planning';
import DateManager from '../../managers/DateManager';
import { apiRequest } from '../../utils/WebData';
import CustomHTML from '../../components/Overrides/CustomHTML';
import { TAB_BAR_HEIGHT } from '../../components/Tabbar/CustomTabBar';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import type { PlanningEventType } from '../../utils/Planning';
import ImageGalleryButton from '../../components/Media/ImageGalleryButton';
import {
  MainRoutes,
  MainStackParamsList,
} from '../../navigation/MainNavigator';
import RequestScreen from '../../components/Screens/RequestScreen';

type Props = StackScreenProps<
  MainStackParamsList,
  MainRoutes.PlanningInformation
>;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  button: {
    width: 300,
    height: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

const EVENT_INFO_URL = 'event/info';
4;
function PlanningDisplayScreen(props: Props) {
  const [displayData, setDisplayData] = useState<PlanningEventType | undefined>(
    props.route.params.type === 'full' ? props.route.params.data : undefined
  );
  const eventId =
    props.route.params.type === 'full'
      ? props.route.params.data.id
      : props.route.params.eventId;

  const getScreen = (data: PlanningEventType | undefined) => {
    if (data == null) {
      return <View />;
    }
    const date = new Date(data.start * 1000);
    let subtitle = dateToDateString(date) + ' ' + dateToTimeString(date, true);
    if (data.location) subtitle += ' @ ' + data.location.trim();

    return (
      <CollapsibleScrollView style={styles.container} hasTab>
        <Card.Title title={data.title} subtitle={subtitle} />
        {data.logo !== null ? (
          <ImageGalleryButton
            images={[{ url: data.logo }]}
            style={styles.button}
          />
        ) : null}

        {data.description !== null ? (
          <Card.Content style={{ paddingBottom: TAB_BAR_HEIGHT + 20 }}>
            <CustomHTML html={data.description} />
          </Card.Content>
        ) : (
          <View />
        )}
      </CollapsibleScrollView>
    );
  };

  return (
    <RequestScreen
      request={() =>
        apiRequest<PlanningEventType>(EVENT_INFO_URL, 'POST', {
          id: eventId,
        })
      }
      render={getScreen}
      cache={displayData}
      onCacheUpdate={setDisplayData}
    />
  );
}

export default PlanningDisplayScreen;
