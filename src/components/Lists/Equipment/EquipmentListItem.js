// @flow

import * as React from 'react';
import {Avatar, List, withTheme} from 'react-native-paper';
import type {CustomTheme} from "../../../managers/ThemeManager";
import type {Device} from "../../../screens/Amicale/Equipment/EquipmentListScreen";
import i18n from "i18n-js";
import {
    getFirstEquipmentAvailability,
    getRelativeDateString,
    isEquipmentAvailable
} from "../../../utils/EquipmentBooking";
import {StackNavigationProp} from "@react-navigation/stack";

type Props = {
    navigation: StackNavigationProp,
    userDeviceRentDates: [string, string],
    item: Device,
    height: number,
    theme: CustomTheme,
}

class EquipmentListItem extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Props): boolean {
        return nextProps.userDeviceRentDates !== this.props.userDeviceRentDates;
    }

    render() {
        const colors = this.props.theme.colors;
        const item = this.props.item;
        const userDeviceRentDates = this.props.userDeviceRentDates;
        const isRented = userDeviceRentDates != null;
        const isAvailable = isEquipmentAvailable(item);
        const firstAvailability = getFirstEquipmentAvailability(item);

        let onPress;
        if (isRented)
            onPress = () => this.props.navigation.navigate("equipment-confirm", {
                item: item,
                dates: userDeviceRentDates
            });
        else
            onPress = () => this.props.navigation.navigate("equipment-rent", {item: item});

        let description;
        if (isRented) {
            const start = new Date(userDeviceRentDates[0]);
            const end = new Date(userDeviceRentDates[1]);
            if (start.getTime() !== end.getTime())
                description = i18n.t('screens.equipment.bookingPeriod', {
                    begin: getRelativeDateString(start),
                    end: getRelativeDateString(end)
                });
            else
                description = i18n.t('screens.equipment.bookingDay', {
                    date: getRelativeDateString(start)
                });
        } else if (isAvailable)
            description = i18n.t('screens.equipment.bail', {cost: item.caution});
        else
            description = i18n.t('screens.equipment.available', {date: getRelativeDateString(firstAvailability)});

        let icon;
        if (isRented)
            icon = "bookmark-check";
        else if (isAvailable)
            icon = "check-circle-outline";
        else
            icon = "update";

        let color;
        if (isRented)
            color = colors.warning;
        else if (isAvailable)
            color = colors.success;
        else
            color = colors.primary;

        return (
            <List.Item
                title={item.name}
                description={description}
                onPress={onPress}
                left={(props) => <Avatar.Icon
                    {...props}
                    style={{
                        backgroundColor: 'transparent',
                    }}
                    icon={icon}
                    color={color}
                />}
                right={(props) => <Avatar.Icon
                    {...props}
                    style={{
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        backgroundColor: 'transparent',
                    }}
                    size={48}
                    icon={"chevron-right"}
                />}
                style={{
                    height: this.props.height,
                    justifyContent: 'center',
                }}
            />
        );
    }
}

export default withTheme(EquipmentListItem);
