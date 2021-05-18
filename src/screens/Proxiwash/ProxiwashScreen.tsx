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

import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import i18n from 'i18n-js';
import { Avatar, Button, Card, Text, useTheme } from 'react-native-paper';
import { Modalize } from 'react-native-modalize';
import WebSectionList from '../../components/Screens/WebSectionList';
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
import { useNavigation } from '@react-navigation/core';
import { setupMachineNotification } from '../../utils/Notifications';
import ProximoListHeader from '../../components/Lists/Proximo/ProximoListHeader';
import { usePreferences } from '../../context/preferencesContext';
import {
  getPreferenceNumber,
  getPreferenceObject,
  getPreferenceString,
  PreferenceKeys,
} from '../../utils/asyncStorage';

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

function ProxiwashScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { preferences, updatePreferences } = usePreferences();
  const [
    modalCurrentDisplayItem,
    setModalCurrentDisplayItem,
  ] = useState<React.ReactElement | null>(null);
  const reminder = getPreferenceNumber(
    PreferenceKeys.proxiwashNotifications,
    preferences
  );

  const getMachinesWatched = () => {
    const data = getPreferenceObject(
      PreferenceKeys.proxiwashWatchedMachines,
      preferences
    ) as Array<ProxiwashMachineType>;
    return data ? (data as Array<ProxiwashMachineType>) : [];
  };

  const getSelectedWash = () => {
    const data = getPreferenceString(PreferenceKeys.selectedWash, preferences);
    if (data !== 'washinsa' && data !== 'tripodeB') {
      return 'washinsa';
    } else {
      return data;
    }
  };

  const machinesWatched: Array<ProxiwashMachineType> = getMachinesWatched();
  const selectedWash: 'washinsa' | 'tripodeB' = getSelectedWash();

  const modalStateStrings: { [key in MachineStates]: string } = {
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

  const modalRef = useRef<Modalize>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialHeaderButtons>
          <Item
            title={'information'}
            iconName={'information'}
            onPress={() => navigation.navigate('proxiwash-about')}
          />
        </MaterialHeaderButtons>
      ),
    });
  }, [navigation]);

  /**
   * Callback used when the user clicks on enable notifications for a machine
   *
   * @param machine The machine to set notifications for
   */
  const onSetupNotificationsPress = (machine: ProxiwashMachineType) => {
    if (modalRef.current) {
      modalRef.current.close();
    }
    setupNotifications(machine);
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
  const getModalContent = (
    title: string,
    item: ProxiwashMachineType,
    isDryer: boolean
  ) => {
    let button: { text: string; icon: string; onPress: () => void } | undefined;
    let message = modalStateStrings[item.state];
    const onPress = () => onSetupNotificationsPress(item);
    if (item.state === MachineStates.RUNNING) {
      let remainingTime = parseInt(item.remainingTime, 10);
      if (remainingTime < 0) {
        remainingTime = 0;
      }

      button = {
        text: isMachineWatched(item, machinesWatched)
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
              color={theme.colors.text}
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
  };

  /**
   * Gets the section render item
   *
   * @param section The section to render
   * @return {*}
   */
  const getRenderSectionHeader = ({
    section,
  }: {
    section: SectionListData<ProxiwashMachineType>;
  }) => {
    const isDryer = section.title === i18n.t('screens.proxiwash.dryers');
    const nbAvailable = getMachineAvailableNumber(section.data);
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
  const getRenderItem = (
    data: SectionListRenderItemInfo<ProxiwashMachineType>
  ) => {
    const isDryer = data.section.title === i18n.t('screens.proxiwash.dryers');
    return (
      <ProxiwashListItem
        item={data.item}
        onPress={showModal}
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
  const getKeyExtractor = (item: ProxiwashMachineType): string => item.number;

  /**
   * Setups notifications for the machine with the given ID.
   * One notification will be sent at the end of the program.
   * Another will be send a few minutes before the end, based on the value of reminderNotifTime
   *
   * @param machine The machine to watch
   */
  const setupNotifications = (machine: ProxiwashMachineType) => {
    if (!isMachineWatched(machine, machinesWatched)) {
      setupMachineNotification(
        machine.number,
        true,
        reminder,
        getMachineEndDate(machine)
      );
      saveNotificationToState(machine);
    } else {
      setupMachineNotification(machine.number, false);
      removeNotificationFromState(machine);
    }
  };

  /**
   * Gets the number of machines available
   *
   * @param isDryer True if we are only checking for dryer, false for washers
   * @return {number} The number of machines available
   */
  const getMachineAvailableNumber = (
    data: ReadonlyArray<ProxiwashMachineType>
  ): number => {
    let count = 0;
    data.forEach((machine: ProxiwashMachineType) => {
      if (machine.state === MachineStates.AVAILABLE) {
        count += 1;
      }
    });
    return count;
  };

  /**
   * Creates the dataset to be used by the FlatList
   *
   * @param fetchedData
   * @return {*}
   */
  const createDataset = (
    fetchedData: FetchedDataType | undefined
  ): SectionListDataType<ProxiwashMachineType> => {
    if (fetchedData) {
      let data = fetchedData;
      if (AprilFoolsManager.getInstance().isAprilFoolsEnabled()) {
        data = JSON.parse(JSON.stringify(fetchedData)); // Deep copy
        AprilFoolsManager.getNewProxiwashDryerOrderedList(data.dryers);
        AprilFoolsManager.getNewProxiwashWasherOrderedList(data.washers);
      }
      fetchedData = data;
      const cleanedList = getCleanedMachineWatched(machinesWatched, [
        ...data.dryers,
        ...data.washers,
      ]);
      if (cleanedList !== machinesWatched) {
        updatePreferences(PreferenceKeys.proxiwashWatchedMachines, cleanedList);
      }
      return [
        {
          title: i18n.t('screens.proxiwash.dryers'),
          icon: 'tumble-dryer',
          data: data.dryers === undefined ? [] : data.dryers,
          keyExtractor: getKeyExtractor,
        },
        {
          title: i18n.t('screens.proxiwash.washers'),
          icon: 'washing-machine',
          data: data.washers === undefined ? [] : data.washers,
          keyExtractor: getKeyExtractor,
        },
      ];
    } else {
      return [];
    }
  };

  /**
   * Shows a modal for the given item
   *
   * @param title The title to use
   * @param item The item to display information for in the modal
   * @param isDryer True if the given item is a dryer
   */
  const showModal = (
    title: string,
    item: ProxiwashMachineType,
    isDryer: boolean
  ) => {
    setModalCurrentDisplayItem(getModalContent(title, item, isDryer));
    if (modalRef.current) {
      modalRef.current.open();
    }
  };

  /**
   * Adds the given notifications associated to a machine ID to the watchlist, and saves the array to the preferences
   *
   * @param machine
   */
  const saveNotificationToState = (machine: ProxiwashMachineType) => {
    let data = [...machinesWatched];
    data.push(machine);
    saveNewWatchedList(data);
  };

  /**
   * Removes the given index from the watchlist array and saves it to preferences
   *
   * @param selectedMachine
   */
  const removeNotificationFromState = (
    selectedMachine: ProxiwashMachineType
  ) => {
    const newList = machinesWatched.filter(
      (m) => m.number !== selectedMachine.number
    );
    saveNewWatchedList(newList);
  };

  const saveNewWatchedList = (list: Array<ProxiwashMachineType>) => {
    updatePreferences(PreferenceKeys.proxiwashWatchedMachines, list);
  };

  const renderListHeaderComponent = (
    data: FetchedDataType | undefined,
    _loading: boolean,
    lastRefreshDate: Date | undefined
  ) => {
    if (data) {
      return (
        <ProximoListHeader date={lastRefreshDate} selectedWash={selectedWash} />
      );
    } else {
      return null;
    }
  };

  let data: LaundromatType;
  switch (selectedWash) {
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
          createDataset={createDataset}
          renderItem={getRenderItem}
          renderSectionHeader={getRenderSectionHeader}
          autoRefreshTime={REFRESH_TIME}
          refreshOnFocus={true}
          extraData={machinesWatched.length}
          renderListHeaderComponent={renderListHeaderComponent}
        />
      </View>
      <MascotPopup
        title={i18n.t('screens.proxiwash.mascotDialog.title')}
        message={i18n.t('screens.proxiwash.mascotDialog.message')}
        icon="information"
        buttons={{
          action: {
            message: i18n.t('screens.proxiwash.mascotDialog.ok'),
            icon: 'cog',
            onPress: () => navigation.navigate('settings'),
          },
          cancel: {
            message: i18n.t('screens.proxiwash.mascotDialog.cancel'),
            icon: 'close',
          },
        }}
        emotion={MASCOT_STYLE.NORMAL}
      />
      <CustomModal ref={modalRef}>{modalCurrentDisplayItem}</CustomModal>
    </View>
  );
}

export default ProxiwashScreen;
