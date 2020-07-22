// @flow

import * as React from 'react';
import {View} from "react-native";
import {Button, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../../components/Amicale/AuthenticatedScreen";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import i18n from "i18n-js";
import type {club} from "../Clubs/ClubListScreen";
import EquipmentListItem from "../../../components/Lists/Equipment/EquipmentListItem";
import MascotPopup from "../../../components/Mascot/MascotPopup";
import {MASCOT_STYLE} from "../../../components/Mascot/Mascot";
import AsyncStorageManager from "../../../managers/AsyncStorageManager";
import CollapsibleFlatList from "../../../components/Collapsible/CollapsibleFlatList";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
}

type State = {
    mascotDialogVisible: boolean,
}

export type Device = {
    id: number,
    name: string,
    caution: number,
    booked_at: Array<{ begin: string, end: string }>,
};

export type RentedDevice = {
    device_id: number,
    device_name: string,
    begin: string,
    end: string,
}

const LIST_ITEM_HEIGHT = 64;

class EquipmentListScreen extends React.Component<Props, State> {

    state = {
        mascotDialogVisible: AsyncStorageManager.getInstance().preferences.equipmentShowBanner.current === "1"
    }

    data: Array<Device>;
    userRents: Array<RentedDevice>;

    authRef: { current: null | AuthenticatedScreen };
    canRefresh: boolean;

    constructor(props: Props) {
        super(props);
        this.canRefresh = false;
        this.authRef = React.createRef();
        this.props.navigation.addListener('focus', this.onScreenFocus);
    }

    onScreenFocus = () => {
        if (this.canRefresh && this.authRef.current != null)
            this.authRef.current.reload();
        this.canRefresh = true;
    };

    getRenderItem = ({item}: { item: Device }) => {
        return (
            <EquipmentListItem
                navigation={this.props.navigation}
                item={item}
                userDeviceRentDates={this.getUserDeviceRentDates(item)}
                height={LIST_ITEM_HEIGHT}/>
        );
    };

    getUserDeviceRentDates(item: Device) {
        let dates = null;
        for (let i = 0; i < this.userRents.length; i++) {
            let device = this.userRents[i];
            if (item.id === device.device_id) {
                dates = [device.begin, device.end];
                break;
            }
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
            <View style={{
                width: "100%",
                marginTop: 10,
                marginBottom: 10,
            }}>
                <Button
                    mode={"contained"}
                    icon={"help-circle"}
                    onPress={this.showMascotDialog}
                    style={{
                        marginRight: "auto",
                        marginLeft: "auto",
                    }}>
                    {i18n.t("screens.equipment.mascotDialog.title")}
                </Button>
            </View>
        );
    }

    keyExtractor = (item: club) => item.id.toString();

    /**
     * Gets the main screen component with the fetched data
     *
     * @param data The data fetched from the server
     * @returns {*}
     */
    getScreen = (data: Array<{ [key: string]: any } | null>) => {
        if (data[0] != null) {
            const fetchedData = data[0];
            if (fetchedData != null)
                this.data = fetchedData["devices"];
        }
        if (data[1] != null) {
            const fetchedData = data[1];
            if (fetchedData != null)
                this.userRents = fetchedData["locations"];
        }
        return (
            <CollapsibleFlatList
                keyExtractor={this.keyExtractor}
                renderItem={this.getRenderItem}
                ListHeaderComponent={this.getListHeader()}
                data={this.data}
            />
        )
    };

    showMascotDialog = () => {
        this.setState({mascotDialogVisible: true})
    };

    hideMascotDialog = () => {
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.equipmentShowBanner.key,
            '0'
        );
        this.setState({mascotDialogVisible: false})
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <AuthenticatedScreen
                    {...this.props}
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
                        }
                    ]}
                    renderFunction={this.getScreen}
                />
                <MascotPopup
                    visible={this.state.mascotDialogVisible}
                    title={i18n.t("screens.equipment.mascotDialog.title")}
                    message={i18n.t("screens.equipment.mascotDialog.message")}
                    icon={"vote"}
                    buttons={{
                        action: null,
                        cancel: {
                            message: i18n.t("screens.equipment.mascotDialog.button"),
                            icon: "check",
                            onPress: this.hideMascotDialog,
                        }
                    }}
                    emotion={MASCOT_STYLE.WINK}
                />
            </View>
        );
    }
}

export default withTheme(EquipmentListScreen);
