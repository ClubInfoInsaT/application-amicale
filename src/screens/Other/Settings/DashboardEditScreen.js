// @flow

import * as React from 'react';
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../../managers/ThemeManager";
import {Button, Card, Paragraph, withTheme} from "react-native-paper";
import type {ServiceCategory, ServiceItem} from "../../../managers/ServicesManager";
import DashboardManager from "../../../managers/DashboardManager";
import DashboardItem from "../../../components/Home/EventDashboardItem";
import {FlatList} from "react-native";
import {View} from "react-native-animatable";
import DashboardEditAccordion from "../../../components/Lists/DashboardEdit/DashboardEditAccordion";
import DashboardEditPreviewItem from "../../../components/Lists/DashboardEdit/DashboardEditPreviewItem";
import AsyncStorageManager from "../../../managers/AsyncStorageManager";
import i18n from "i18n-js";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
};

type State = {
    currentDashboard: Array<ServiceItem>,
    currentDashboardIdList: Array<string>,
    activeItem: number,
};

/**
 * Class defining the Settings screen. This screen shows controls to modify app preferences.
 */
class DashboardEditScreen extends React.Component<Props, State> {

    content: Array<ServiceCategory>;
    initialDashboard: Array<ServiceItem>;
    initialDashboardIdList: Array<string>;

    constructor(props: Props) {
        super(props);
        let dashboardManager = new DashboardManager(this.props.navigation);
        this.initialDashboardIdList = JSON.parse(AsyncStorageManager.getInstance().preferences.dashboardItems.current);
        this.initialDashboard = dashboardManager.getCurrentDashboard();
        this.state = {
            currentDashboard: [...this.initialDashboard],
            currentDashboardIdList: [...this.initialDashboardIdList],
            activeItem: 0,
        }
        this.content = dashboardManager.getCategories();
    }

    dashboardRowRenderItem = ({item, index}: { item: DashboardItem, index: number }) => {
        return (
            <DashboardEditPreviewItem
                image={item.image}
                onPress={() => this.setState({activeItem: index})}
                isActive={this.state.activeItem === index}
            />
        );
    };

    getDashboard(content: Array<DashboardItem>) {
        return (
            <FlatList
                data={content}
                extraData={this.state}
                renderItem={this.dashboardRowRenderItem}
                horizontal={true}
                contentContainerStyle={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 5,
                }}
            />);
    }

    renderItem = ({item}: { item: ServiceCategory }) => {
        return (
            <DashboardEditAccordion
                item={item}
                onPress={this.updateDashboard}
                activeDashboard={this.state.currentDashboardIdList}
            />
        );
    };

    updateDashboard = (service: ServiceItem) => {
        let currentDashboard = this.state.currentDashboard;
        let currentDashboardIdList = this.state.currentDashboardIdList;
        currentDashboard[this.state.activeItem] = service;
        currentDashboardIdList[this.state.activeItem] = service.key;
        this.setState({
            currentDashboard: currentDashboard,
            currentDashboardIdList: currentDashboardIdList,
        });
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.dashboardItems.key,
            JSON.stringify(currentDashboardIdList)
        );
    }

    undoDashboard = () => {
        this.setState({
            currentDashboard: [...this.initialDashboard],
            currentDashboardIdList: [...this.initialDashboardIdList]
        });
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.dashboardItems.key,
            JSON.stringify(this.initialDashboardIdList)
        );
    }


    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{
                    padding: 5
                }}>
                    <Button
                        mode={"contained"}
                        onPress={this.undoDashboard}
                        style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        {i18n.t("screens.settings.dashboardEdit.undo")}
                    </Button>
                    <View style={{
                        height: 50
                    }}>
                        {this.getDashboard(this.state.currentDashboard)}
                    </View>

                </View>
                <FlatList
                    data={this.content}
                    renderItem={this.renderItem}
                    ListHeaderComponent={<Card style={{margin: 5}}>
                        <Card.Content>
                            <Paragraph
                                style={{textAlign: "center"}}>{i18n.t("screens.settings.dashboardEdit.message")}</Paragraph>
                        </Card.Content>

                    </Card>}
                    style={{}}
                />
            </View>
        );
    }

}

export default withTheme(DashboardEditScreen);
