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
import AuthenticatedScreen from '../../../components/Amicale/AuthenticatedScreen';
import EquipmentListItem from '../../../components/Lists/Equipment/EquipmentListItem';
import MascotPopup from '../../../components/Mascot/MascotPopup';
import { MASCOT_STYLE } from '../../../components/Mascot/Mascot';
import AsyncStorageManager from '../../../managers/AsyncStorageManager';
import CollapsibleFlatList from '../../../components/Collapsible/CollapsibleFlatList';
import GENERAL_STYLES from '../../../constants/Styles';

type PropsType = {
  navigation: StackNavigationProp<any>;
};

type StateType = {
  mascotDialogVisible: boolean;
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

  authRef: { current: null | AuthenticatedScreen<any> };

  canRefresh: boolean;

  constructor(props: PropsType) {
    super(props);
    this.userRents = null;
    this.state = {
      mascotDialogVisible: AsyncStorageManager.getBool(
        AsyncStorageManager.PREFERENCES.equipmentShowMascot.key
      ),
    };
    this.canRefresh = false;
    this.authRef = React.createRef();
    props.navigation.addListener('focus', this.onScreenFocus);
  }

  onScreenFocus = () => {
    if (
      this.canRefresh &&
      this.authRef.current &&
      this.authRef.current.reload
    ) {
      this.authRef.current.reload();
    }
    this.canRefresh = true;
  };

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

  /**
   * Gets the main screen component with the fetched data
   *
   * @param data The data fetched from the server
   * @returns {*}
   */
  getScreen = (
    data: Array<
      | { devices: Array<DeviceType> }
      | { locations: Array<RentedDeviceType> }
      | null
    >
  ) => {
    const [allDevices, userRents] = data;
    if (userRents) {
      this.userRents = (userRents as {
        locations: Array<RentedDeviceType>;
      }).locations;
    }
    return (
      <CollapsibleFlatList
        keyExtractor={this.keyExtractor}
        renderItem={this.getRenderItem}
        ListHeaderComponent={this.getListHeader()}
        data={
          allDevices
            ? (allDevices as { devices: Array<DeviceType> }).devices
            : null
        }
      />
    );
  };

  showMascotDialog = () => {
    this.setState({ mascotDialogVisible: true });
  };

  hideMascotDialog = () => {
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.equipmentShowMascot.key,
      false
    );
    this.setState({ mascotDialogVisible: false });
  };

  render() {
    const { props, state } = this;
    return (
      <View style={GENERAL_STYLES.flex}>
        <AuthenticatedScreen
          navigation={props.navigation}
          ref={this.authRef}
          requests={[
            {
              link: 'location/all',
              params: {},
              mandatory: true,
            },
            {
              link: 'location/my',
              params: {},
              mandatory: false,
            },
          ]}
          renderFunction={this.getScreen}
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
