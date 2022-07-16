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

import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import i18n from 'i18n-js';
import EquipmentListItem from '../../../components/Lists/Equipment/EquipmentListItem';
import MascotPopup from '../../../components/Mascot/MascotPopup';
import { MASCOT_STYLE } from '../../../components/Mascot/Mascot';
import GENERAL_STYLES from '../../../constants/Styles';
import { ApiRejectType } from '../../../utils/WebData';
import WebSectionList from '../../../components/Screens/WebSectionList';
import { useAuthenticatedRequest } from '../../../context/loginContext';

export type DeviceType = {
  id: number;
  name: string;
  caution: number;
  booked_at: Array<{ begin: string; end: string }>;
};

export type RentedDeviceType = {
  device_id: number;
  device_name: string;
  begin: string;
  end: string;
};

type ResponseType = {
  devices: Array<DeviceType>;
  locations?: Array<RentedDeviceType>;
};

const LIST_ITEM_HEIGHT = 64;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});

function EquipmentListScreen() {
  const userRents = useRef<undefined | Array<RentedDeviceType>>();
  const [mascotDialogVisible, setMascotDialogVisible] = useState<
    undefined | boolean
  >(undefined);

  const requestAll =
    useAuthenticatedRequest<{ devices: Array<DeviceType> }>('location/all');
  const requestOwn = useAuthenticatedRequest<{
    locations: Array<RentedDeviceType>;
  }>('location/my');

  const getRenderItem = ({ item }: { item: DeviceType }) => {
    return (
      <EquipmentListItem
        item={item}
        userDeviceRentDates={getUserDeviceRentDates(item)}
        height={LIST_ITEM_HEIGHT}
      />
    );
  };

  const getUserDeviceRentDates = (
    item: DeviceType
  ): [string, string] | null => {
    let dates = null;
    if (userRents.current) {
      userRents.current.forEach((device: RentedDeviceType) => {
        if (item.id === device.device_id) {
          dates = [device.begin, device.end];
        }
      });
    }
    return dates;
  };

  const getListHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Button
          mode="contained"
          icon="help-circle"
          onPress={showMascotDialog}
          style={GENERAL_STYLES.centerHorizontal}
        >
          {i18n.t('screens.equipment.mascotDialog.title')}
        </Button>
      </View>
    );
  };

  const keyExtractor = (item: DeviceType): string => item.id.toString();

  const createDataset = (data: ResponseType | undefined) => {
    if (data) {
      if (data.locations) {
        userRents.current = data.locations;
      }
      return [{ title: '', data: data.devices }];
    } else {
      return [];
    }
  };

  const showMascotDialog = () => setMascotDialogVisible(true);

  const hideMascotDialog = () => setMascotDialogVisible(false);

  const request = () => {
    return new Promise(
      (
        resolve: (data: ResponseType) => void,
        reject: (error: ApiRejectType) => void
      ) => {
        requestAll()
          .then((devicesData) => {
            requestOwn()
              .then((rentsData) => {
                resolve({
                  devices: devicesData.devices,
                  locations: rentsData.locations,
                });
              })
              .catch(() =>
                resolve({
                  devices: devicesData.devices,
                })
              );
          })
          .catch(reject);
      }
    );
  };

  return (
    <View style={GENERAL_STYLES.flex}>
      <WebSectionList
        request={request}
        createDataset={createDataset}
        keyExtractor={keyExtractor}
        renderItem={getRenderItem}
        renderListHeaderComponent={getListHeader}
      />
      <MascotPopup
        visible={mascotDialogVisible}
        title={i18n.t('screens.equipment.mascotDialog.title')}
        message={i18n.t('screens.equipment.mascotDialog.message')}
        icon="vote"
        buttons={{
          cancel: {
            message: i18n.t('screens.equipment.mascotDialog.button'),
            icon: 'check',
            onPress: hideMascotDialog,
          },
        }}
        emotion={MASCOT_STYLE.WINK}
      />
    </View>
  );
}

export default EquipmentListScreen;
