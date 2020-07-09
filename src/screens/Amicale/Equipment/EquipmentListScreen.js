// @flow

import * as React from 'react';
import {Animated} from "react-native";
import {Avatar, Card, Paragraph, withTheme} from 'react-native-paper';
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
    available_at: string,
};

const TEST_DATASET = [
    {
        id: 1,
        name: "Petit barbecue",
        caution: 100,
        available_at: "2020-07-07 21:12"
    },
    {
        id: 2,
        name: "Grand barbecue",
        caution: 100,
        available_at: "2020-07-08 21:12"
    },
    {
        id: 3,
        name: "Appareil à fondue",
        caution: 100,
        available_at: "2020-07-09 14:12"
    },
    {
        id: 4,
        name: "Appareil à croque-monsieur",
        caution: 100,
        available_at: "2020-07-10 12:12"
    }
]

const ICON_AMICALE = require('../../../../assets/amicale.png');
const LIST_ITEM_HEIGHT = 64;

class EquipmentListScreen extends React.Component<Props> {

    data: Array<Device>;

    getRenderItem = ({item}: { item: Device }) => {
        return (
            <EquipmentListItem
                onPress={() => this.props.navigation.navigate('equipment-lend', {item: item})}
                item={item}
                height={LIST_ITEM_HEIGHT}/>
        );
    };

    /**
     * Gets the list header, with explains this screen's purpose
     *
     * @returns {*}
     */
    getListHeader() {
        return <Card style={{margin: 5}}>
            <Card.Title
                title={i18n.t('equipmentScreen.title')}
                left={(props) => <Avatar.Image
                    {...props}
                    source={ICON_AMICALE}
                    style={{backgroundColor: 'transparent'}}
                />}
            />
            <Card.Content>
                <Paragraph>
                    {i18n.t('equipmentScreen.message')}
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

            this.data = TEST_DATASET; // TODO remove in prod
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
                requests={[
                    {
                        link: 'user/profile',
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
