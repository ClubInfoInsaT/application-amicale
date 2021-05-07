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
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import { Avatar, Button, Card, TouchableRipple } from 'react-native-paper';
import { getTimeOnlyString, isDescriptionEmpty } from '../../utils/Planning';
import CustomHTML from '../Overrides/CustomHTML';
import type { PlanningEventType } from '../../utils/Planning';
import GENERAL_STYLES from '../../constants/Styles';

type PropsType = {
  event?: PlanningEventType | null;
  clickAction: () => void;
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  content: {
    maxHeight: 150,
    overflow: 'hidden',
  },
  actions: {
    marginLeft: 'auto',
    marginTop: 'auto',
    flexDirection: 'row',
  },
  avatar: {
    backgroundColor: 'transparent',
  },
});

/**
 * Component used to display an event preview if an event is available
 */
function PreviewEventDashboardItem(props: PropsType) {
  const { event } = props;
  const isEmpty = event == null ? true : isDescriptionEmpty(event.description);

  if (event != null) {
    const logo = event.logo;
    const getImage = logo
      ? () => (
          <Avatar.Image
            source={{ uri: logo }}
            size={50}
            style={styles.avatar}
          />
        )
      : () => null;
    return (
      <Card style={styles.card} elevation={3}>
        <TouchableRipple
          style={GENERAL_STYLES.flex}
          onPress={props.clickAction}
        >
          <View>
            <Card.Title
              title={event.title}
              subtitle={getTimeOnlyString(event.date_begin)}
              left={getImage}
            />
            {!isEmpty ? (
              <Card.Content style={styles.content}>
                <CustomHTML html={event.description} />
              </Card.Content>
            ) : null}

            <Card.Actions style={styles.actions}>
              <Button icon="chevron-right">
                {i18n.t('screens.home.dashboard.seeMore')}
              </Button>
            </Card.Actions>
          </View>
        </TouchableRipple>
      </Card>
    );
  }
  return null;
}

export default PreviewEventDashboardItem;
