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
  Avatar,
  Card,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import GENERAL_STYLES from '../../constants/Styles';

type PropsType = {
  eventNumber: number;
  clickAction: () => void;
  children?: React.ReactNode;
};

const styles = StyleSheet.create({
  card: {
    width: 'auto',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  avatar: {
    backgroundColor: 'transparent',
  },
  text: {
    fontWeight: 'bold',
  },
});

/**
 * Component used to display a dashboard item containing a preview event
 */
function EventDashBoardItem(props: PropsType) {
  const theme = useTheme();
  const isAvailable = props.eventNumber > 0;
  const iconColor = isAvailable
    ? theme.colors.planningColor
    : theme.colors.textDisabled;
  const textColor = isAvailable ? theme.colors.text : theme.colors.textDisabled;
  let subtitle;
  if (isAvailable) {
    subtitle = (
      <Text>
        <Text style={styles.text}>{props.eventNumber}</Text>
        <Text>
          {props.eventNumber > 1
            ? i18n.t('screens.home.dashboard.todayEventsSubtitlePlural')
            : i18n.t('screens.home.dashboard.todayEventsSubtitle')}
        </Text>
      </Text>
    );
  } else {
    subtitle = i18n.t('screens.home.dashboard.todayEventsSubtitleNA');
  }
  return (
    <Card style={styles.card}>
      <TouchableRipple style={GENERAL_STYLES.flex} onPress={props.clickAction}>
        <View>
          <Card.Title
            title={i18n.t('screens.home.dashboard.todayEventsTitle')}
            titleStyle={{ color: textColor }}
            subtitle={subtitle}
            subtitleStyle={{ color: textColor }}
            left={(iconProps) => (
              <Avatar.Icon
                icon="calendar-range"
                color={iconColor}
                size={iconProps.size}
                style={styles.avatar}
              />
            )}
          />
          <Card.Content>{props.children}</Card.Content>
        </View>
      </TouchableRipple>
    </Card>
  );
}

const areEqual = (prevProps: PropsType, nextProps: PropsType): boolean => {
  return nextProps.eventNumber === prevProps.eventNumber;
};

export default React.memo(EventDashBoardItem, areEqual);
