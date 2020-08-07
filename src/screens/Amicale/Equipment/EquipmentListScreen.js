// @flow

import * as React from 'react';
import {View} from 'react-native';
import {Button, withTheme} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import i18n from 'i18n-js';
import AuthenticatedScreen from '../../../components/Amicale/AuthenticatedScreen';
import type {ClubType} from '../Clubs/ClubListScreen';
import EquipmentListItem from '../../../components/Lists/Equipment/EquipmentListItem';
import MascotPopup from '../../../components/Mascot/MascotPopup';
import {MASCOT_STYLE} from '../../../components/Mascot/Mascot';
import AsyncStorageManager from '../../../managers/AsyncStorageManager';
import CollapsibleFlatList from '../../../components/Collapsible/CollapsibleFlatList';
import type {ApiGenericDataType} from '../../../utils/WebData';

type PropsType = {
  navigation: StackNavigationProp,
};

type StateType = {
  mascotDialogVisible: boolean,
};

export type DeviceType = {
  id: number,
  name: string,
  caution: number,
  booked_at: Array<{begin: string, end: string}>,
};

export type RentedDeviceType = {
  device_id: number,
  device_name: string,
  begin: string,
  end: string,
};

const LIST_ITEM_HEIGHT = 64;

class EquipmentListScreen extends React.Component<PropsType, StateType> {
  userRents: null | Array<RentedDeviceType>;

  authRef: {current: null | AuthenticatedScreen};

  canRefresh: boolean;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      mascotDialogVisible: AsyncStorageManager.getBool(
        AsyncStorageManager.PREFERENCES.equipmentShowBanner.key,
      ),
    };
    this.canRefresh = false;
    this.authRef = React.createRef();
    props.navigation.addListener('focus', this.onScreenFocus);
  }

  onScreenFocus = () => {
    if (this.canRefresh && this.authRef.current != null)
      this.authRef.current.reload();
    this.canRefresh = true;
  };

  getRenderItem = ({item}: {item: DeviceType}): React.Node => {
    const {navigation} = this.props;
    return (
      <EquipmentListItem
        navigation={navigation}
        item={item}
        userDeviceRentDates={this.getUserDeviceRentDates(item)}
        height={LIST_ITEM_HEIGHT}
      />
    );
  };

  getUserDeviceRentDates(item: DeviceType): [number, number] | null {
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
  getListHeader(): React.Node {
    return (
      <View
        style={{
          width: '100%',
          marginTop: 10,
          marginBottom: 10,
        }}>
        <Button
          mode="contained"
          icon="help-circle"
          onPress={this.showMascotDialog}
          style={{
            marginRight: 'auto',
            marginLeft: 'auto',
          }}>
          {i18n.t('screens.equipment.mascotDialog.title')}
        </Button>
      </View>
    );
  }

  keyExtractor = (item: ClubType): string => item.id.toString();

  /**
   * Gets the main screen component with the fetched data
   *
   * @param data The data fetched from the server
   * @returns {*}
   */
  getScreen = (data: Array<ApiGenericDataType | null>): React.Node => {
    const [allDevices, userRents] = data;
    if (userRents != null) this.userRents = userRents.locations;
    return (
      <CollapsibleFlatList
        keyExtractor={this.keyExtractor}
        renderItem={this.getRenderItem}
        ListHeaderComponent={this.getListHeader()}
        data={allDevices != null ? allDevices.devices : null}
      />
    );
  };

  showMascotDialog = () => {
    this.setState({mascotDialogVisible: true});
  };

  hideMascotDialog = () => {
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.equipmentShowBanner.key,
      false,
    );
    this.setState({mascotDialogVisible: false});
  };

  render(): React.Node {
    const {props, state} = this;
    return (
      <View style={{flex: 1}}>
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
            action: null,
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

export default withTheme(EquipmentListScreen);
