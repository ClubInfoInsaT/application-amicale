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
import { Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'i18n-js';
import EquipmentListItem from '../../../components/Lists/Equipment/EquipmentListItem';
import MascotPopup from '../../../components/Mascot/MascotPopup';
import { MASCOT_STYLE } from '../../../components/Mascot/Mascot';
import GENERAL_STYLES from '../../../constants/Styles';
import ConnectionManager from '../../../managers/ConnectionManager';
import { ApiRejectType } from '../../../utils/WebData';
import WebSectionList from '../../../components/Screens/WebSectionList';

type PropsType = {
  navigation: StackNavigationProp<any>;
};

type StateType = {
  mascotDialogVisible: boolean | undefined;
};

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

class EquipmentListScreen extends React.Component<PropsType, StateType> {
  userRents: null | Array<RentedDeviceType>;

  constructor(props: PropsType) {
    super(props);
    this.userRents = null;
    this.state = {
      mascotDialogVisible: undefined,
    };
  }

  getRenderItem = ({ item }: { item: DeviceType }) => {
    const { navigation } = this.props;
    return (
      <EquipmentListItem
        navigation={navigation}
        item={item}
        userDeviceRentDates={this.getUserDeviceRentDates(item)}
        height={LIST_ITEM_HEIGHT}
      />
    );
  };

  getUserDeviceRentDates(item: DeviceType): [string, string] | null {
    let dates = null;
    if (this.userRents != null) {
      this.userRents.forEach((device: RentedDeviceType) => {
        if (item.id === device.device_id) {
          dates = [device.begin, device.end];
        }
      });
    }
    return dates;
  }

  /**
   * Gets the list header, with explains this screen's purpose
   *
   * @returns {*}
   */
  getListHeader() {
    return (
      <View style={styles.headerContainer}>
        <Button
          mode="contained"
          icon="help-circle"
          onPress={this.showMascotDialog}
          style={GENERAL_STYLES.centerHorizontal}
        >
          {i18n.t('screens.equipment.mascotDialog.title')}
        </Button>
      </View>
    );
  }

  keyExtractor = (item: DeviceType): string => item.id.toString();

  createDataset = (data: ResponseType | undefined) => {
    if (data) {
      const userRents = data.locations;

      if (userRents) {
        this.userRents = userRents;
      }
      return [{ title: '', data: data.devices }];
    } else {
      return [];
    }
  };

  showMascotDialog = () => {
    this.setState({ mascotDialogVisible: true });
  };

  hideMascotDialog = () => {
    this.setState({ mascotDialogVisible: false });
  };

  request = () => {
    return new Promise(
      (
        resolve: (data: ResponseType) => void,
        reject: (error: ApiRejectType) => void
      ) => {
        ConnectionManager.getInstance()
          .authenticatedRequest<{ devices: Array<DeviceType> }>('location/all')
          .then((devicesData) => {
            ConnectionManager.getInstance()
              .authenticatedRequest<{
                locations: Array<RentedDeviceType>;
              }>('location/my')
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

  render() {
    const { state } = this;
    return (
      <View style={GENERAL_STYLES.flex}>
        <WebSectionList
          request={this.request}
          createDataset={this.createDataset}
          keyExtractor={this.keyExtractor}
          renderItem={this.getRenderItem}
          renderListHeaderComponent={() => this.getListHeader()}
        />
        <MascotPopup
          visible={state.mascotDialogVisible}
          title={i18n.t('screens.equipment.mascotDialog.title')}
          message={i18n.t('screens.equipment.mascotDialog.message')}
          icon="vote"
          buttons={{
            cancel: {
              message: i18n.t('screens.equipment.mascotDialog.button'),
              icon: 'check',
              onPress: this.hideMascotDialog,
            },
          }}
          emotion={MASCOT_STYLE.WINK}
        />
      </View>
    );
  }
}

export default EquipmentListScreen;
