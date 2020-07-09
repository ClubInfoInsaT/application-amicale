// @flow

import * as React from 'react';
import {Avatar, List, withTheme} from 'react-native-paper';
import type {CustomTheme} from "../../../managers/ThemeManager";
import type {Device} from "../../../screens/Amicale/Equipment/EquipmentListScreen";
import i18n from "i18n-js";
import {getTimeOnlyString, stringToDate} from "../../../utils/Planning";

type Props = {
    onPress: () => void,
    item: Device,
    height: number,
    theme: CustomTheme,
}

class EquipmentListItem extends React.Component<Props> {

    shouldComponentUpdate() {
        return false;
    }

    isAvailable() {
        const availableDate = stringToDate(this.props.item.available_at);
        return availableDate != null && availableDate < new Date();
    }

    /**
     * Gets the string representation of the given date.
     *
     * If the given date is the same day as today, only return the tile.
     * Otherwise, return the full date.
     *
     * @param dateString The string representation of the wanted date
     * @returns {string}
     */
    getDateString(dateString: string): string {
        const today = new Date();
        const date = stringToDate(dateString);
        if (date != null && today.getDate() === date.getDate()) {
            const str = getTimeOnlyString(dateString);
            return str != null ? str : "";
        } else
            return dateString;
    }


    render() {
        const colors = this.props.theme.colors;
        const item = this.props.item;
        const isAvailable = this.isAvailable();
        return (
            <List.Item
                title={item.name}
                description={isAvailable
                    ? i18n.t('equipmentScreen.bail', {cost: item.caution})
                    : i18n.t('equipmentScreen.availableAt', {date: this.getDateString(item.available_at)})}
                onPress={this.props.onPress}
                left={(props) => <Avatar.Icon
                    {...props}
                    style={{
                        backgroundColor: 'transparent',
                    }}
                    icon={isAvailable ? "check-circle-outline" : "update"}
                    color={isAvailable ? colors.success : colors.primary}
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
