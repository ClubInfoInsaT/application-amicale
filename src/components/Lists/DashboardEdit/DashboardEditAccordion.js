// @flow

import * as React from 'react';
import {withTheme} from 'react-native-paper';
import {FlatList, Image, View} from "react-native";
import DashboardEditItem from "./DashboardEditItem";
import AnimatedAccordion from "../../Animations/AnimatedAccordion";
import type {ServiceCategory, ServiceItem} from "../../../managers/ServicesManager";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import type {CustomTheme} from "../../../managers/ThemeManager";

type Props = {
    item: ServiceCategory,
    activeDashboard: Array<string>,
    onPress: (service: ServiceItem) => void,
    theme: CustomTheme,
}

const LIST_ITEM_HEIGHT = 64;

class DashboardEditAccordion extends React.Component<Props> {

    renderItem = ({item}: { item: ServiceItem }) => {
        return (
            <DashboardEditItem
                height={LIST_ITEM_HEIGHT}
                item={item}
                isActive={this.props.activeDashboard.includes(item.key)}
                onPress={() => this.props.onPress(item)}/>
        );
    }

    itemLayout = (data, index) => ({length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index});

    render() {
        const item = this.props.item;
        return (
            <View>
                <AnimatedAccordion
                    title={item.title}
                    left={props => typeof item.image === "number"
                        ? <Image
                            {...props}
                            source={item.image}
                            style={{
                                width: 40,
                                height: 40
                            }}
                        />
                        : <MaterialCommunityIcons
                            //$FlowFixMe
                            name={item.image}
                            color={this.props.theme.colors.primary}
                            size={40}/>}
                >
                    {/*$FlowFixMe*/}
                    <FlatList
                        data={item.content}
                        extraData={this.props.activeDashboard.toString()}
                        renderItem={this.renderItem}
                        listKey={item.key}
                        // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
                        getItemLayout={this.itemLayout}
                        removeClippedSubviews={true}
                    />
                </AnimatedAccordion>
            </View>
        );
    }
}

export default withTheme(DashboardEditAccordion)
