// @flow

import * as React from 'react';
import {Alert, View} from 'react-native';
import i18n from 'i18n-js';
import {Avatar, Button, Card, Text, withTheme} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {Modalize} from 'react-native-modalize';
import WebSectionList from '../../components/Screens/WebSectionList';
import * as Notifications from '../../utils/Notifications';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import ProxiwashListItem from '../../components/Lists/Proxiwash/ProxiwashListItem';
import ProxiwashConstants from '../../constants/ProxiwashConstants';
import CustomModal from '../../components/Overrides/CustomModal';
import AprilFoolsManager from '../../managers/AprilFoolsManager';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import ProxiwashSectionHeader from '../../components/Lists/Proxiwash/ProxiwashSectionHeader';
import type {CustomThemeType} from '../../managers/ThemeManager';
import {
  getCleanedMachineWatched,
  getMachineEndDate,
  isMachineWatched,
} from '../../utils/Proxiwash';
import {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import type {SectionListDataType} from '../../components/Screens/WebSectionList';

const DATA_URL =
  'https://etud.insa-toulouse.fr/~amicale_app/v2/washinsa/washinsa_data.json';

const modalStateStrings = {};

const REFRESH_TIME = 1000 * 10; // Refresh every 10 seconds
const LIST_ITEM_HEIGHT = 64;

export type ProxiwashMachineType = {
  number: string,
  state: string,
  startTime: string,
  endTime: string,
  donePercent: string,
  remainingTime: string,
  program: string,
};

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomThemeType,
};

type StateType = {
  modalCurrentDisplayItem: React.Node,
  machinesWatched: Array<ProxiwashMachineType>,
};

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
      i18n.t('screens.proxiwash.modal.notificationErrorDescription'),
    );
  }

  modalRef: null | Modalize;

  fetchedData: {
    dryers: Array<ProxiwashMachineType>,
    washers: Array<ProxiwashMachineType>,
  };

  /**
   * Creates machine state parameters using current theme and translations
   */
  constructor() {
    super();
    this.state = {
      modalCurrentDisplayItem: null,
      machinesWatched: AsyncStorageManager.getObject(
        AsyncStorageManager.PREFERENCES.proxiwashWatchedMachines.key,
      ),
    };
    modalStateStrings[ProxiwashConstants.machineStates.AVAILABLE] = i18n.t(
      'screens.proxiwash.modal.ready',
    );
    modalStateStrings[ProxiwashConstants.machineStates.RUNNING] = i18n.t(
      'screens.proxiwash.modal.running',
    );
    modalStateStrings[
      ProxiwashConstants.machineStates.RUNNING_NOT_STARTED
    ] = i18n.t('screens.proxiwash.modal.runningNotStarted');
    modalStateStrings[ProxiwashConstants.machineStates.FINISHED] = i18n.t(
      'screens.proxiwash.modal.finished',
    );
    modalStateStrings[ProxiwashConstants.machineStates.UNAVAILABLE] = i18n.t(
      'screens.proxiwash.modal.broken',
    );
    modalStateStrings[ProxiwashConstants.machineStates.ERROR] = i18n.t(
      'screens.proxiwash.modal.error',
    );
    modalStateStrings[ProxiwashConstants.machineStates.UNKNOWN] = i18n.t(
      'screens.proxiwash.modal.unknown',
    );
  }

  /**
   * Setup notification channel for android and add listeners to detect notifications fired
   */
  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerRight: (): React.Node => (
        <MaterialHeaderButtons>
          <Item
            title="information"
            iconName="information"
            onPress={this.onAboutPress}
          />
        </MaterialHeaderButtons>
      ),
    });
  }

  /**
   * Callback used when pressing the about button.
   * This will open the ProxiwashAboutScreen.
   */
  onAboutPress = () => {
    const {navigation} = this.props;
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
  getModalContent(
    title: string,
    item: ProxiwashMachineType,
    isDryer: boolean,
  ): React.Node {
    const {props, state} = this;
    let button = {
      text: i18n.t('screens.proxiwash.modal.ok'),
      icon: '',
      onPress: undefined,
    };
    let message = modalStateStrings[item.state];
    const onPress = this.onSetupNotificationsPress.bind(this, item);
    if (item.state === ProxiwashConstants.machineStates.RUNNING) {
      let remainingTime = parseInt(item.remainingTime, 10);
      if (remainingTime < 0) remainingTime = 0;

      button = {
        text: isMachineWatched(item, state.machinesWatched)
          ? i18n.t('screens.proxiwash.modal.disableNotifications')
          : i18n.t('screens.proxiwash.modal.enableNotifications'),
        icon: '',
        onPress,
      };
      message = i18n.t('screens.proxiwash.modal.running', {
        start: item.startTime,
        end: item.endTime,
        remaining: remainingTime,
        program: item.program,
      });
    } else if (item.state === ProxiwashConstants.machineStates.AVAILABLE) {
      if (isDryer) message += `\n${i18n.t('screens.proxiwash.dryersTariff')}`;
      else message += `\n${i18n.t('screens.proxiwash.washersTariff')}`;
    }
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
        }}>
        <Card.Title
          title={title}
          left={(): React.Node => (
            <Avatar.Icon
              icon={isDryer ? 'tumble-dryer' : 'washing-machine'}
              color={props.theme.colors.text}
              style={{backgroundColor: 'transparent'}}
            />
          )}
        />
        <Card.Content>
          <Text>{message}</Text>
        </Card.Content>

        {button.onPress !== undefined ? (
          <Card.Actions>
            <Button
              icon={button.icon}
              mode="contained"
              onPress={button.onPress}
              style={{marginLeft: 'auto', marginRight: 'auto'}}>
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
    section: {title: string},
  }): React.Node => {
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
  getRenderItem = ({
    item,
    section,
  }: {
    item: ProxiwashMachineType,
    section: {title: string},
  }): React.Node => {
    const {machinesWatched} = this.state;
    const isDryer = section.title === i18n.t('screens.proxiwash.dryers');
    return (
      <ProxiwashListItem
        item={item}
        onPress={this.showModal}
        isWatched={isMachineWatched(item, machinesWatched)}
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
    const {machinesWatched} = this.state;
    if (!isMachineWatched(machine, machinesWatched)) {
      Notifications.setupMachineNotification(
        machine.number,
        true,
        getMachineEndDate(machine),
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
        },
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
    if (isDryer) data = this.fetchedData.dryers;
    else data = this.fetchedData.washers;
    let count = 0;
    data.forEach((machine: ProxiwashMachineType) => {
      if (machine.state === ProxiwashConstants.machineStates.AVAILABLE)
        count += 1;
    });
    return count;
  }

  /**
   * Creates the dataset to be used by the FlatList
   *
   * @param fetchedData
   * @return {*}
   */
  createDataset = (fetchedData: {
    dryers: Array<ProxiwashMachineType>,
    washers: Array<ProxiwashMachineType>,
  }): SectionListDataType<ProxiwashMachineType> => {
    const {state} = this;
    let data = fetchedData;
    if (AprilFoolsManager.getInstance().isAprilFoolsEnabled()) {
      data = JSON.parse(JSON.stringify(fetchedData)); // Deep copy
      AprilFoolsManager.getNewProxiwashDryerOrderedList(data.dryers);
      AprilFoolsManager.getNewProxiwashWasherOrderedList(data.washers);
    }
    this.fetchedData = data;
    this.state.machinesWatched = getCleanedMachineWatched(
      state.machinesWatched,
      [...data.dryers, ...data.washers],
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
    const {machinesWatched} = this.state;
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
    const {machinesWatched} = this.state;
    const newList = [...machinesWatched];
    machinesWatched.forEach((machine: ProxiwashMachineType, index: number) => {
      if (
        machine.number === selectedMachine.number &&
        machine.endTime === selectedMachine.endTime
      )
        newList.splice(index, 1);
    });
    this.saveNewWatchedList(newList);
  }

  saveNewWatchedList(list: Array<ProxiwashMachineType>) {
    this.setState({machinesWatched: list});
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.proxiwashWatchedMachines.key,
      list,
    );
  }

  render(): React.Node {
    const {state} = this;
    const {navigation} = this.props;
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}>
          <WebSectionList
            createDataset={this.createDataset}
            navigation={navigation}
            fetchUrl={DATA_URL}
            renderItem={this.getRenderItem}
            renderSectionHeader={this.getRenderSectionHeader}
            autoRefreshTime={REFRESH_TIME}
            refreshOnFocus
            updateData={state.machinesWatched.length}
          />
        </View>
        <MascotPopup
          prefKey={AsyncStorageManager.PREFERENCES.proxiwashShowBanner.key}
          title={i18n.t('screens.proxiwash.mascotDialog.title')}
          message={i18n.t('screens.proxiwash.mascotDialog.message')}
          icon="information"
          buttons={{
            action: null,
            cancel: {
              message: i18n.t('screens.proxiwash.mascotDialog.ok'),
              icon: 'check',
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
