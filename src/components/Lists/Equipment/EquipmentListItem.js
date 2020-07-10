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

    render() {
        const colors = this.props.theme.colors;
        const item = this.props.item;
        const isAvailable = isEquipmentAvailable(item);
        const firstAvailability = getFirstEquipmentAvailability(item);
        return (
            <List.Item
                title={item.name}
                description={isAvailable
                    ? i18n.t('equipmentScreen.bail', {cost: item.caution})
                    : i18n.t('equipmentScreen.available', {date: getRelativeDateString(firstAvailability)})}
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
