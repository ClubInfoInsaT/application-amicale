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
  Alert,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import i18n from 'i18n-js';
import { Avatar, Button, Card, Text, withTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import WebSectionList from '../../components/Screens/WebSectionList';
import * as Notifications from '../../utils/Notifications';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import ProxiwashListItem from '../../components/Lists/Proxiwash/ProxiwashListItem';
import ProxiwashConstants, {
  MachineStates,
} from '../../constants/ProxiwashConstants';
import CustomModal from '../../components/Overrides/CustomModal';
import AprilFoolsManager from '../../managers/AprilFoolsManager';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import ProxiwashSectionHeader from '../../components/Lists/Proxiwash/ProxiwashSectionHeader';
import {
  getCleanedMachineWatched,
  getMachineEndDate,
  isMachineWatched,
} from '../../utils/Proxiwash';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import type { SectionListDataType } from '../../components/Screens/WebSectionList';
import type { LaundromatType } from './ProxiwashAboutScreen';
import GENERAL_STYLES from '../../constants/Styles';
import { readData } from '../../utils/WebData';

const REFRESH_TIME = 1000 * 10; // Refresh every 10 seconds
const LIST_ITEM_HEIGHT = 64;

export type ProxiwashMachineType = {
  number: string;
  state: MachineStates;
  maxWeight: number;
  startTime: string;
  endTime: string;
  donePercent: string;
  remainingTime: string;
  program: string;
};

type PropsType = {
  navigation: StackNavigationProp<any>;
  theme: ReactNativePaper.Theme;
};

type StateType = {
  modalCurrentDisplayItem: React.ReactNode;
  machinesWatched: Array<ProxiwashMachineType>;
  selectedWash: string;
};

type FetchedDataType = {
  dryers: Array<ProxiwashMachineType>;
  washers: Array<ProxiwashMachineType>;
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

/**
 * Class defining the app's proxiwash screen. This screen shows information about washing machines and
 * dryers, taken from a scrapper reading proxiwash website
 */
class ProxiwashScreen extends React.Component<PropsType, StateType> {
  /**
   * Shows a warning telling the user notifications are disabled for the app
   */
  static showNotificationsDisabledWarning() {
    Alert.alert(
      i18n.t('screens.proxiwash.modal.notificationErrorTitle'),
      i18n.t('screens.proxiwash.modal.notificationErrorDescription')
    );
  }

  modalStateStrings: { [key in MachineStates]: string } = {
    [MachineStates.AVAILABLE]: i18n.t('screens.proxiwash.modal.ready'),
    [MachineStates.RUNNING]: i18n.t('screens.proxiwash.modal.running'),
    [MachineStates.RUNNING_NOT_STARTED]: i18n.t(
      'screens.proxiwash.modal.runningNotStarted'
    ),
    [MachineStates.FINISHED]: i18n.t('screens.proxiwash.modal.finished'),
    [MachineStates.UNAVAILABLE]: i18n.t('screens.proxiwash.modal.broken'),
    [MachineStates.ERROR]: i18n.t('screens.proxiwash.modal.error'),
    [MachineStates.UNKNOWN]: i18n.t('screens.proxiwash.modal.unknown'),
  };

  modalRef: null | Modalize;

  fetchedData: {
    dryers: Array<ProxiwashMachineType>;
    washers: Array<ProxiwashMachineType>;
  };

  /**
   * Creates machine state parameters using current theme and translations
   */
  constructor(props: PropsType) {
    super(props);
    this.modalRef = null;
    this.fetchedData = { dryers: [], washers: [] };
    this.state = {
      modalCurrentDisplayItem: null,
      machinesWatched: AsyncStorageManager.getObject(
        AsyncStorageManager.PREFERENCES.proxiwashWatchedMachines.key
      ),
      selectedWash: AsyncStorageManager.getString(
        AsyncStorageManager.PREFERENCES.selectedWash.key
      ),
    };
  }

  /**
   * Setup notification channel for android and add listeners to detect notifications fired
   */
  componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions({
      headerRight: () => (
        <MaterialHeaderButtons>
          <Item
            title="switch"
            iconName="swap-horizontal"
            onPress={(): void => navigation.navigate('settings')}
          />
          <Item
            title="information"
            iconName="information"
            onPress={this.onAboutPress}
          />
        </MaterialHeaderButtons>
      ),
    });
    navigation.addListener('focus', this.onScreenFocus);
  }

  onScreenFocus = () => {
    const { state } = this;
    const selected = AsyncStorageManager.getString(
      AsyncStorageManager.PREFERENCES.selectedWash.key
    );
    if (selected !== state.selectedWash) {
      this.setState({
        selectedWash: selected,
      });
    }
  };

  /**
   * Callback used when pressing the about button.
   * This will open the ProxiwashAboutScreen.
   */
  onAboutPress = () => {
    const { navigation } = this.props;
    navigation.navigate('proxiwash-about');
  };

  /**
   * Callback used when the user clicks on enable notifications for a machine
   *
   * @param machine The machine to set notifications for
   */
  onSetupNotificationsPress(machine: ProxiwashMachineType) {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.setupNotifications(machine);
  }

  /**
   * Callback used when receiving modal ref
   *
   * @param ref
   */
  onModalRef = (ref: Modalize) => {
    this.modalRef = ref;
  };

  /**
   * Generates the modal content.
   * This shows information for the given machine.
   *
   * @param title The title to use
   * @param item The item to display information for in the modal
   * @param isDryer True if the given item is a dryer
   * @return {*}
   */
  getModalContent(title: string, item: ProxiwashMachineType, isDryer: boolean) {
    const { props, state } = this;
    let button: { text: string; icon: string; onPress: () => void } | undefined;
    let message = this.modalStateStrings[item.state];
    const onPress = () => this.onSetupNotificationsPress(item);
    if (item.state === MachineStates.RUNNING) {
      let remainingTime = parseInt(item.remainingTime, 10);
      if (remainingTime < 0) {
        remainingTime = 0;
      }

      button = {
        text: isMachineWatched(item, state.machinesWatched)
          ? i18n.t('screens.proxiwash.modal.disableNotifications')
          : i18n.t('screens.proxiwash.modal.enableNotifications'),
        icon: '',
        onPress: onPress,
      };
      message = i18n.t('screens.proxiwash.modal.running', {
        start: item.startTime,
        end: item.endTime,
        remaining: remainingTime,
        program: item.program,
      });
    }
    return (
      <View style={styles.modalContainer}>
        <Card.Title
          title={title}
          left={() => (
            <Avatar.Icon
              icon={isDryer ? 'tumble-dryer' : 'washing-machine'}
              color={props.theme.colors.text}
              style={styles.icon}
            />
          )}
        />
        <Card.Content>
          <Text>{message}</Text>
        </Card.Content>

        {button ? (
          <Card.Actions>
            <Button
              icon={button.icon}
              mode="contained"
              onPress={button.onPress}
              style={GENERAL_STYLES.centerHorizontal}
            >
              {button.text}
            </Button>
          </Card.Actions>
        ) : null}
      </View>
    );
  }

  /**
   * Gets the section render item
   *
   * @param section The section to render
   * @return {*}
   */
  getRenderSectionHeader = ({
    section,
  }: {
    section: SectionListData<ProxiwashMachineType>;
  }) => {
    const isDryer = section.title === i18n.t('screens.proxiwash.dryers');
    const nbAvailable = this.getMachineAvailableNumber(isDryer);
    return (
      <ProxiwashSectionHeader
        title={section.title}
        nbAvailable={nbAvailable}
        isDryer={isDryer}
      />
    );
  };

  /**
   * Gets the list item to be rendered
   *
   * @param item The object containing the item's FetchedData
   * @param section The object describing the current SectionList section
   * @returns {React.Node}
   */
  getRenderItem = (data: SectionListRenderItemInfo<ProxiwashMachineType>) => {
    const { machinesWatched } = this.state;
    const isDryer = data.section.title === i18n.t('screens.proxiwash.dryers');
    return (
      <ProxiwashListItem
        item={data.item}
        onPress={this.showModal}
        isWatched={isMachineWatched(data.item, machinesWatched)}
        isDryer={isDryer}
        height={LIST_ITEM_HEIGHT}
      />
    );
  };

  /**
   * Extracts the key for the given item
   *
   * @param item The item to extract the key from
   * @return {*} The extracted key
   */
  getKeyExtractor = (item: ProxiwashMachineType): string => item.number;

  /**
   * Setups notifications for the machine with the given ID.
   * One notification will be sent at the end of the program.
   * Another will be send a few minutes before the end, based on the value of reminderNotifTime
   *
   * @param machine The machine to watch
   */
  setupNotifications(machine: ProxiwashMachineType) {
    const { machinesWatched } = this.state;
    if (!isMachineWatched(machine, machinesWatched)) {
      Notifications.setupMachineNotification(
        machine.number,
        true,
        getMachineEndDate(machine)
      )
        .then(() => {
          this.saveNotificationToState(machine);
        })
        .catch(() => {
          ProxiwashScreen.showNotificationsDisabledWarning();
        });
    } else {
      Notifications.setupMachineNotification(machine.number, false, null).then(
        () => {
          this.removeNotificationFromState(machine);
        }
      );
    }
  }

  /**
   * Gets the number of machines available
   *
   * @param isDryer True if we are only checking for dryer, false for washers
   * @return {number} The number of machines available
   */
  getMachineAvailableNumber(isDryer: boolean): number {
    let data;
    if (isDryer) {
      data = this.fetchedData.dryers;
    } else {
      data = this.fetchedData.washers;
    }
    let count = 0;
    data.forEach((machine: ProxiwashMachineType) => {
      if (machine.state === MachineStates.AVAILABLE) {
        count += 1;
      }
    });
    return count;
  }

  /**
   * Creates the dataset to be used by the FlatList
   *
   * @param fetchedData
   * @return {*}
   */
  createDataset = (
    fetchedData: FetchedDataType | undefined
  ): SectionListDataType<ProxiwashMachineType> => {
    const { state } = this;
    if (fetchedData) {
      let data = fetchedData;
      if (AprilFoolsManager.getInstance().isAprilFoolsEnabled()) {
        data = JSON.parse(JSON.stringify(fetchedData)); // Deep copy
        AprilFoolsManager.getNewProxiwashDryerOrderedList(data.dryers);
        AprilFoolsManager.getNewProxiwashWasherOrderedList(data.washers);
      }
      this.fetchedData = data;
      // TODO dirty, should be refactored
      this.state.machinesWatched = getCleanedMachineWatched(
        state.machinesWatched,
        [...data.dryers, ...data.washers]
      );
      return [
        {
          title: i18n.t('screens.proxiwash.dryers'),
          icon: 'tumble-dryer',
          data: data.dryers === undefined ? [] : data.dryers,
          keyExtractor: this.getKeyExtractor,
        },
        {
          title: i18n.t('screens.proxiwash.washers'),
          icon: 'washing-machine',
          data: data.washers === undefined ? [] : data.washers,
          keyExtractor: this.getKeyExtractor,
        },
      ];
    } else {
      return [];
    }
  };

  /**
   * Callback used when the user clicks on the navigate to settings button.
   * This will hide the banner and open the SettingsScreen
   */
  onGoToSettings = () => {
    const { navigation } = this.props;
    navigation.navigate('settings');
  };

  /**
   * Shows a modal for the given item
   *
   * @param title The title to use
   * @param item The item to display information for in the modal
   * @param isDryer True if the given item is a dryer
   */
  showModal = (title: string, item: ProxiwashMachineType, isDryer: boolean) => {
    this.setState({
      modalCurrentDisplayItem: this.getModalContent(title, item, isDryer),
    });
    if (this.modalRef) {
      this.modalRef.open();
    }
  };

  /**
   * Adds the given notifications associated to a machine ID to the watchlist, and saves the array to the preferences
   *
   * @param machine
   */
  saveNotificationToState(machine: ProxiwashMachineType) {
    const { machinesWatched } = this.state;
    const data = machinesWatched;
    data.push(machine);
    this.saveNewWatchedList(data);
  }

  /**
   * Removes the given index from the watchlist array and saves it to preferences
   *
   * @param selectedMachine
   */
  removeNotificationFromState(selectedMachine: ProxiwashMachineType) {
    const { machinesWatched } = this.state;
    const newList = [...machinesWatched];
    machinesWatched.forEach((machine: ProxiwashMachineType, index: number) => {
      if (
        machine.number === selectedMachine.number &&
        machine.endTime === selectedMachine.endTime
      ) {
        newList.splice(index, 1);
      }
    });
    this.saveNewWatchedList(newList);
  }

  saveNewWatchedList(list: Array<ProxiwashMachineType>) {
    this.setState({ machinesWatched: list });
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.proxiwashWatchedMachines.key,
      list
    );
  }

  render() {
    const { state } = this;
    let data: LaundromatType;
    switch (state.selectedWash) {
      case 'tripodeB':
        data = ProxiwashConstants.tripodeB;
        break;
      default:
        data = ProxiwashConstants.washinsa;
    }
    return (
      <View style={GENERAL_STYLES.flex}>
        <View style={styles.container}>
          <WebSectionList
            request={() => readData<FetchedDataType>(data.url)}
            createDataset={this.createDataset}
            renderItem={this.getRenderItem}
            renderSectionHeader={this.getRenderSectionHeader}
            autoRefreshTime={REFRESH_TIME}
            refreshOnFocus={true}
            extraData={state.machinesWatched.length}
          />
        </View>
        <MascotPopup
          prefKey={AsyncStorageManager.PREFERENCES.proxiwashShowMascot.key}
          title={i18n.t('screens.proxiwash.mascotDialog.title')}
          message={i18n.t('screens.proxiwash.mascotDialog.message')}
          icon="information"
          buttons={{
            action: {
              message: i18n.t('screens.proxiwash.mascotDialog.ok'),
              icon: 'cog',
              onPress: this.onGoToSettings,
            },
            cancel: {
              message: i18n.t('screens.proxiwash.mascotDialog.cancel'),
              icon: 'close',
            },
          }}
          emotion={MASCOT_STYLE.NORMAL}
        />
        <CustomModal onRef={this.onModalRef}>
          {state.modalCurrentDisplayItem}
        </CustomModal>
      </View>
    );
  }
}

export default withTheme(ProxiwashScreen);
