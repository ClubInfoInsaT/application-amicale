// @flow

import * as React from 'react';
import {Button, Caption, Card, Headline, Paragraph, withTheme} from 'react-native-paper';
import {Collapsible} from "react-navigation-collapsible";
import {withCollapsible} from "../../../utils/withCollapsible";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import type {Device} from "./EquipmentListScreen";
import {Animated, View} from "react-native";
import i18n from "i18n-js";
import {getRelativeDateString} from "../../../utils/EquipmentBooking";

type Props = {
    navigation: StackNavigationProp,
    route: {
        params?: {
            item?: Device,
            dates: [string, string]
        },
    },
    theme: CustomTheme,
    collapsibleStack: Collapsible,
}


class EquipmentConfirmScreen extends React.Component<Props> {

    item: Device | null;
    dates: [string, string] | null;

    constructor(props: Props) {
        super(props);
        if (this.props.route.params != null) {
            if (this.props.route.params.item != null)
                this.item = this.props.route.params.item;
            else
                this.item = null;
            if (this.props.route.params.dates != null)
                this.dates = this.props.route.params.dates;
            else
                this.dates = null;
        }
    }

    render() {
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        const item = this.item;
        const dates = this.dates;
        if (item != null && dates != null) {
            const start = new Date(dates[0]);
            const end = new Date(dates[1]);
            return (
                <Animated.ScrollView
                    // Animations
                    onScroll={onScroll}
                    contentContainerStyle={{
                        paddingTop: containerPaddingTop,
                        minHeight: '100%'
                    }}
                    scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}>
                    <Card style={{margin: 5}}>
                        <Card.Content>
                            <View style={{flex: 1}}>
                                <View style={{
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                }}>
                                    <Headline style={{textAlign: "center"}}>
                                        {item.name}
                                    </Headline>
                                    <Caption style={{
                                        textAlign: "center",
                                        lineHeight: 35,
                                        marginLeft: 10,
                                    }}>
                                        ({i18n.t('screens.equipment.bail', {cost: item.caution})})
                                    </Caption>
                                </View>
                            </View>
                            <Button
                                icon={"check-circle-outline"}
                                color={this.props.theme.colors.success}
                                mode="text"
                            >
                                {
                                    start == null
                                        ? i18n.t('screens.equipment.booking')
                                        : end != null && start.getTime() !== end.getTime()
                                        ? i18n.t('screens.equipment.bookingPeriod', {
                                            begin: getRelativeDateString(start),
                                            end: getRelativeDateString(end)
                                        })
                                        : i18n.t('screens.equipment.bookingDay', {
                                            date: getRelativeDateString(start)
                                        })
                                }
                            </Button>
                            <Paragraph style={{textAlign: "center"}}>
                                {i18n.t("screens.equipment.bookingConfirmedMessage")}
                            </Paragraph>
                        </Card.Content>
                    </Card>
                </Animated.ScrollView>
            );
        } else
            return null;

    }

}

export default withCollapsible(withTheme(EquipmentConfirmScreen));
