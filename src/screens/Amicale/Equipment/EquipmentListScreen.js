// @flow

import * as React from 'react';
import {Animated, Image} from "react-native";
import {Card, Paragraph, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../../components/Amicale/AuthenticatedScreen";
import {Collapsible} from "react-navigation-collapsible";
import {withCollapsible} from "../../../utils/withCollapsible";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import i18n from "i18n-js";
import type {club} from "../Clubs/ClubListScreen";
import EquipmentListItem from "../../../components/Lists/Equipment/EquipmentListItem";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
    collapsibleStack: Collapsible,
}

export type Device = {
    id: number,
    name: string,
    caution: number,
    booked_at: Array<{begin: string, end: string}>,
};

export type RentedDevice = {
    device_id: number,
    device_name: string,
    begin: string,
    end: string,
}

const ICON_AMICALE = require('../../../../assets/amicale.png');
const LIST_ITEM_HEIGHT = 64;

class EquipmentListScreen extends React.Component<Props> {

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
        return <Card style={{margin: 5}}>
            <Card.Title
                title={i18n.t('screens.equipment.title')}
                left={(props) => <Image
                    {...props}
                    style={{
                        width: props.size,
                        height: props.size,
                    }}
                    source={ICON_AMICALE}
                />}
            />
            <Card.Content>
                <Paragraph>
                    {i18n.t('screens.equipment.message')}
                </Paragraph>
            </Card.Content>
        </Card>;
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
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        return (
            <Animated.FlatList
                keyExtractor={this.keyExtractor}
                renderItem={this.getRenderItem}
                ListHeaderComponent={this.getListHeader()}
                data={this.data}
                // Animations
                onScroll={onScroll}
                contentContainerStyle={{
                    paddingTop: containerPaddingTop,
                    minHeight: '100%'
                }}
                scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
            />
        )
    };

    render() {
        return (
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
        );
    }
}

export default withCollapsible(withTheme(EquipmentListScreen));
