// @flow

import * as React from 'react';
import {Alert, View} from 'react-native';
import i18n from "i18n-js";
import WebSectionList from "../../components/Screens/WebSectionList";
import * as Notifications from "../../utils/Notifications";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import {Avatar, Banner, Button, Card, Text, withTheme} from 'react-native-paper';
import ProxiwashListItem from "../../components/Lists/Proxiwash/ProxiwashListItem";
import ProxiwashConstants from "../../constants/ProxiwashConstants";
import CustomModal from "../../components/Overrides/CustomModal";
import AprilFoolsManager from "../../managers/AprilFoolsManager";
import MaterialHeaderButtons, {Item} from "../../components/Overrides/CustomHeaderButton";
import ProxiwashSectionHeader from "../../components/Lists/Proxiwash/ProxiwashSectionHeader";
import {withCollapsible} from "../../utils/withCollapsible";
import type {CustomTheme} from "../../managers/ThemeManager";
import {Collapsible} from "react-navigation-collapsible";
import {StackNavigationProp} from "@react-navigation/stack";
import {getCleanedMachineWatched, getMachineEndDate, isMachineWatched} from "../../utils/Proxiwash";
import {Modalize} from "react-native-modalize";

const DATA_URL = "https://etud.insa-toulouse.fr/~amicale_app/v2/washinsa/washinsa_data.json";

let modalStateStrings = {};

const REFRESH_TIME = 1000 * 10; // Refresh every 10 seconds
const LIST_ITEM_HEIGHT = 64;

export type Machine = {
    number: string,
    state: string,
    startTime: string,
    endTime: string,
    donePercent: string,
    remainingTime: string,
    program: string,
}

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
    collapsibleStack: Collapsible,
}

type State = {
    refreshing: boolean,
    modalCurrentDisplayItem: React.Node,
    machinesWatched: Array<Machine>,
    bannerVisible: boolean,
};


/**
 * Class defining the app's proxiwash screen. This screen shows information about washing machines and
 * dryers, taken from a scrapper reading proxiwash website
 */
class ProxiwashScreen extends React.Component<Props, State> {

    modalRef: null | Modalize;

    fetchedData: {
        dryers: Array<Machine>,
        washers: Array<Machine>,
    };

    state = {
        refreshing: false,
        modalCurrentDisplayItem: null,
        machinesWatched: JSON.parse(AsyncStorageManager.getInstance().preferences.proxiwashWatchedMachines.current),
        bannerVisible: false,
    };

    /**
     * Creates machine state parameters using current theme and translations
     */
    constructor(props) {
        super(props);
        modalStateStrings[ProxiwashConstants.machineStates.AVAILABLE] = i18n.t('proxiwashScreen.modal.ready');
        modalStateStrings[ProxiwashConstants.machineStates.RUNNING] = i18n.t('proxiwashScreen.modal.running');
        modalStateStrings[ProxiwashConstants.machineStates.RUNNING_NOT_STARTED] = i18n.t('proxiwashScreen.modal.runningNotStarted');
        modalStateStrings[ProxiwashConstants.machineStates.FINISHED] = i18n.t('proxiwashScreen.modal.finished');
        modalStateStrings[ProxiwashConstants.machineStates.UNAVAILABLE] = i18n.t('proxiwashScreen.modal.broken');
        modalStateStrings[ProxiwashConstants.machineStates.ERROR] = i18n.t('proxiwashScreen.modal.error');
        modalStateStrings[ProxiwashConstants.machineStates.UNKNOWN] = i18n.t('proxiwashScreen.modal.unknown');
    }

    /**
     * Callback used when closing the banner.
     * This hides the banner and saves to preferences to prevent it from reopening
     */
    onHideBanner = () => {
        this.setState({bannerVisible: false});
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.proxiwashShowBanner.key,
            '0'
        );
    };

    /**
     * Setup notification channel for android and add listeners to detect notifications fired
     */
    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () =>
                <MaterialHeaderButtons>
                    <Item title="information" iconName="information" onPress={this.onAboutPress}/>
                </MaterialHeaderButtons>,
        });
        setTimeout(this.onBannerTimeout, 2000);
    }

    onBannerTimeout = () => {
        this.setState({bannerVisible: AsyncStorageManager.getInstance().preferences.proxiwashShowBanner.current === "1"})
    }

    /**
     * Callback used when pressing the about button.
     * This will open the ProxiwashAboutScreen.
     */
    onAboutPress = () => this.props.navigation.navigate('proxiwash-about');

    /**
     * Extracts the key for the given item
     *
     * @param item The item to extract the key from
     * @return {*} The extracted key
     */
    getKeyExtractor = (item: Machine) => item.number;

    /**
     * Setups notifications for the machine with the given ID.
     * One notification will be sent at the end of the program.
     * Another will be send a few minutes before the end, based on the value of reminderNotifTime
     *
     * @param machine The machine to watch
     */
    setupNotifications(machine: Machine) {
        if (!isMachineWatched(machine, this.state.machinesWatched)) {
            Notifications.setupMachineNotification(machine.number, true, getMachineEndDate(machine))
                .then(() => {
                    this.saveNotificationToState(machine);
                })
                .catch(() => {
                    this.showNotificationsDisabledWarning();
                });
        } else {
            Notifications.setupMachineNotification(machine.number, false, null)
                .then(() => {
                    this.removeNotificationFromState(machine);
                });
        }
    }

    /**
     * Shows a warning telling the user notifications are disabled for the app
     */
    showNotificationsDisabledWarning() {
        Alert.alert(
            i18n.t("proxiwashScreen.modal.notificationErrorTitle"),
            i18n.t("proxiwashScreen.modal.notificationErrorDescription"),
        );
    }

    /**
     * Adds the given notifications associated to a machine ID to the watchlist, and saves the array to the preferences
     *
     * @param machine
     */
    saveNotificationToState(machine: Machine) {
        let data = this.state.machinesWatched;
        data.push(machine);
        this.saveNewWatchedList(data);
    }

    /**
     * Removes the given index from the watchlist array and saves it to preferences
     *
     * @param machine
     */
    removeNotificationFromState(machine: Machine) {
        let data = this.state.machinesWatched;
        for (let i = 0; i < data.length; i++) {
            if (data[i].number === machine.number && data[i].endTime === machine.endTime) {
                data.splice(i, 1);
                break;
            }
        }
        this.saveNewWatchedList(data);
    }

    saveNewWatchedList(list: Array<Machine>) {
        this.setState({machinesWatched: list});
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.proxiwashWatchedMachines.key,
            JSON.stringify(list),
        );
    }

    /**
     * Creates the dataset to be used by the flatlist
     *
     * @param fetchedData
     * @return {*}
     */
    createDataset = (fetchedData: Object) => {
        let data = fetchedData;
        if (AprilFoolsManager.getInstance().isAprilFoolsEnabled()) {
            data = JSON.parse(JSON.stringify(fetchedData)); // Deep copy
            AprilFoolsManager.getNewProxiwashDryerOrderedList(data.dryers);
            AprilFoolsManager.getNewProxiwashWasherOrderedList(data.washers);
        }
        this.fetchedData = data;
        this.state.machinesWatched =
            getCleanedMachineWatched(this.state.machinesWatched, [...data.dryers, ...data.washers]);
        return [
            {
                title: i18n.t('proxiwashScreen.dryers'),
                icon: 'tumble-dryer',
                data: data.dryers === undefined ? [] : data.dryers,
                keyExtractor: this.getKeyExtractor
            },
            {
                title: i18n.t('proxiwashScreen.washers'),
                icon: 'washing-machine',
                data: data.washers === undefined ? [] : data.washers,
                keyExtractor: this.getKeyExtractor
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
    showModal = (title: string, item: Object, isDryer: boolean) => {
        this.setState({
            modalCurrentDisplayItem: this.getModalContent(title, item, isDryer)
        });
        if (this.modalRef) {
            this.modalRef.open();
        }
    };

    /**
     * Callback used when the user clicks on enable notifications for a machine
     *
     * @param machine The machine to set notifications for
     */
    onSetupNotificationsPress(machine: Machine) {
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.setupNotifications(machine);
    }

    /**
     * Generates the modal content.
     * This shows information for the given machine.
     *
     * @param title The title to use
     * @param item The item to display information for in the modal
     * @param isDryer True if the given item is a dryer
     * @return {*}
     */
    getModalContent(title: string, item: Machine, isDryer: boolean) {
        let button = {
            text: i18n.t("proxiwashScreen.modal.ok"),
            icon: '',
            onPress: undefined
        };
        let message = modalStateStrings[item.state];
        const onPress = this.onSetupNotificationsPress.bind(this, item);
        if (item.state === ProxiwashConstants.machineStates.RUNNING) {
            let remainingTime = parseInt(item.remainingTime)
            if (remainingTime < 0)
                remainingTime = 0;

            button =
                {
                    text: isMachineWatched(item, this.state.machinesWatched) ?
                        i18n.t("proxiwashScreen.modal.disableNotifications") :
                        i18n.t("proxiwashScreen.modal.enableNotifications"),
                    icon: '',
                    onPress: onPress
                }
            ;
            message = i18n.t('proxiwashScreen.modal.running',
                {
                    start: item.startTime,
                    end: item.endTime,
                    remaining: remainingTime,
                    program: item.program
                });
        } else if (item.state === ProxiwashConstants.machineStates.AVAILABLE) {
            if (isDryer)
                message += '\n' + i18n.t('proxiwashScreen.dryersTariff');
            else
                message += '\n' + i18n.t('proxiwashScreen.washersTariff');
        }
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <Card.Title
                    title={title}
                    left={() => <Avatar.Icon
                        icon={isDryer ? 'tumble-dryer' : 'washing-machine'}
                        color={this.props.theme.colors.text}
                        style={{backgroundColor: 'transparent'}}/>}

                />
                <Card.Content>
                    <Text>{message}</Text>
                </Card.Content>

                {button.onPress !== undefined ?
                    <Card.Actions>
                        <Button
                            icon={button.icon}
                            mode="contained"
                            onPress={button.onPress}
                            style={{marginLeft: 'auto', marginRight: 'auto'}}
                        >
                            {button.text}
                        </Button>
                    </Card.Actions> : null}
            </View>
        );
    }

    /**
     * Callback used when receiving modal ref
     *
     * @param ref
     */
    onModalRef = (ref: Object) => {
        this.modalRef = ref;
    };

    /**
     * Gets the number of machines available
     *
     * @param isDryer True if we are only checking for dryer, false for washers
     * @return {number} The number of machines available
     */
    getMachineAvailableNumber(isDryer: boolean) {
        let data;
        if (isDryer)
            data = this.fetchedData.dryers;
        else
            data = this.fetchedData.washers;
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].state === ProxiwashConstants.machineStates.AVAILABLE)
                count += 1;
        }
        return count;
    }

    /**
     * Gets the section render item
     *
     * @param section The section to render
     * @return {*}
     */
    getRenderSectionHeader = ({section}: Object) => {
        const isDryer = section.title === i18n.t('proxiwashScreen.dryers');
        const nbAvailable = this.getMachineAvailableNumber(isDryer);
        return (
            <ProxiwashSectionHeader
                title={section.title}
                nbAvailable={nbAvailable}
                isDryer={isDryer}/>
        );
    };

    /**
     * Gets the list item to be rendered
     *
     * @param item The object containing the item's FetchedData
     * @param section The object describing the current SectionList section
     * @returns {React.Node}
     */
    getRenderItem = ({item, section}: Object) => {
        const isDryer = section.title === i18n.t('proxiwashScreen.dryers');
        return (
            <ProxiwashListItem
                item={item}
                onPress={this.showModal}
                isWatched={isMachineWatched(item, this.state.machinesWatched)}
                isDryer={isDryer}
                height={LIST_ITEM_HEIGHT}
            />
        );
    };

    render() {
        const nav = this.props.navigation;
        const {containerPaddingTop} = this.props.collapsibleStack;
        return (
            <View
                style={{flex: 1}}
            >
                <View style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}>
                    <WebSectionList
                        createDataset={this.createDataset}
                        navigation={nav}
                        fetchUrl={DATA_URL}
                        renderItem={this.getRenderItem}
                        renderSectionHeader={this.getRenderSectionHeader}
                        autoRefreshTime={REFRESH_TIME}
                        refreshOnFocus={true}
                        updateData={this.state.machinesWatched.length}/>
                </View>
                <Banner
                    style={{
                        marginTop: containerPaddingTop,
                        backgroundColor: this.props.theme.colors.surface
                    }}
                    visible={this.state.bannerVisible}
                    actions={[
                        {
                            label: i18n.t('proxiwashScreen.bannerButton'),
                            onPress: this.onHideBanner,
                        },
                    ]}
                    icon={() => <Avatar.Icon
                        icon={'bell'}
                        size={40}
                    />}
                >
                    {i18n.t('proxiwashScreen.enableNotificationsTip')}
                </Banner>
                <CustomModal onRef={this.onModalRef}>
                    {this.state.modalCurrentDisplayItem}
                </CustomModal>
            </View>
        );
    }
}

export default withCollapsible(withTheme(ProxiwashScreen));
