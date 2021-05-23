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
import { Avatar, List, useTheme } from 'react-native-paper';
import i18n from 'i18n-js';
import type { DeviceType } from '../../../screens/Amicale/Equipment/EquipmentListScreen';
import {
  getFirstEquipmentAvailability,
  getRelativeDateString,
  isEquipmentAvailable,
} from '../../../utils/EquipmentBooking';
import { StyleSheet } from 'react-native';
import GENERAL_STYLES from '../../../constants/Styles';
import { useNavigation } from '@react-navigation/native';

type PropsType = {
  userDeviceRentDates: [string, string] | null;
  item: DeviceType;
  height: number;
};

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
  item: {
    justifyContent: 'center',
  },
});

function EquipmentListItem(props: PropsType) {
  const theme = useTheme();
  const navigation = useNavigation();
  const { item, userDeviceRentDates, height } = props;
  const isRented = userDeviceRentDates != null;
  const isAvailable = isEquipmentAvailable(item);
  const firstAvailability = getFirstEquipmentAvailability(item);

  let onPress;
  if (isRented) {
    onPress = () => {
      navigation.navigate('equipment-confirm', {
        item,
        dates: userDeviceRentDates,
      });
    };
  } else {
    onPress = () => {
      navigation.navigate('equipment-rent', { item });
    };
  }

  let description;
  if (isRented && userDeviceRentDates) {
    const start = new Date(userDeviceRentDates[0]);
    const end = new Date(userDeviceRentDates[1]);
    if (start.getTime() !== end.getTime()) {
      description = i18n.t('screens.equipment.bookingPeriod', {
        begin: getRelativeDateString(start),
        end: getRelativeDateString(end),
      });
    } else {
      description = i18n.t('screens.equipment.bookingDay', {
        date: getRelativeDateString(start),
      });
    }
  } else if (isAvailable) {
    description = i18n.t('screens.equipment.bail', { cost: item.caution });
  } else {
    description = i18n.t('screens.equipment.available', {
      date: getRelativeDateString(firstAvailability),
    });
  }

  let icon: string;
  if (isRented) {
    icon = 'bookmark-check';
  } else if (isAvailable) {
    icon = 'check-circle-outline';
  } else {
    icon = 'update';
  }

  let color: string;
  if (isRented) {
    color = theme.colors.warning;
  } else if (isAvailable) {
    color = theme.colors.success;
  } else {
    color = theme.colors.primary;
  }

  return (
    <List.Item
      title={item.name}
      description={description}
      onPress={onPress}
      left={() => <Avatar.Icon style={styles.icon} icon={icon} color={color} />}
      right={() => (
        <Avatar.Icon
          style={{
            ...GENERAL_STYLES.centerVertical,
            ...styles.icon,
          }}
          size={48}
          icon="chevron-right"
        />
      )}
      style={{
        height,
        ...styles.item,
      }}
    />
  );
}

const areEqual = (prevProps: PropsType, nextProps: PropsType): boolean => {
  return nextProps.userDeviceRentDates === prevProps.userDeviceRentDates;
};

export default React.memo(EquipmentListItem, areEqual);
