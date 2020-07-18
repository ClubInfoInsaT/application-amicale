// @flow

import * as React from 'react';
import SettingsScreen from '../screens/Other/Settings/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import DebugScreen from '../screens/About/DebugScreen';
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import i18n from "i18n-js";
import TabNavigator from "./TabNavigator";
import GameScreen from "../screens/Game/GameScreen";
import VoteScreen from "../screens/Amicale/VoteScreen";
import LoginScreen from "../screens/Amicale/LoginScreen";
import {Platform} from "react-native";
import SelfMenuScreen from "../screens/Services/SelfMenuScreen";
import ProximoMainScreen from "../screens/Services/Proximo/ProximoMainScreen";
import ProximoListScreen from "../screens/Services/Proximo/ProximoListScreen";
import ProximoAboutScreen from "../screens/Services/Proximo/ProximoAboutScreen";
import ProfileScreen from "../screens/Amicale/ProfileScreen";
import ClubListScreen from "../screens/Amicale/Clubs/ClubListScreen";
import ClubAboutScreen from "../screens/Amicale/Clubs/ClubAboutScreen";
import ClubDisplayScreen from "../screens/Amicale/Clubs/ClubDisplayScreen";
import {createScreenCollapsibleStack, getWebsiteStack} from "../utils/CollapsibleUtils";
import BugReportScreen from "../screens/Other/FeedbackScreen";
import WebsiteScreen from "../screens/Services/WebsiteScreen";
import EquipmentScreen from "../screens/Amicale/Equipment/EquipmentListScreen";
import EquipmentLendScreen from "../screens/Amicale/Equipment/EquipmentRentScreen";
import EquipmentConfirmScreen from "../screens/Amicale/Equipment/EquipmentConfirmScreen";
import DashboardEditScreen from "../screens/Other/Settings/DashboardEditScreen";

const modalTransition = Platform.OS === 'ios' ? TransitionPresets.ModalPresentationIOS : TransitionPresets.ModalSlideFromBottomIOS;

const screenTransition = TransitionPresets.SlideFromRightIOS;

const defaultScreenOptions = {
    gestureEnabled: true,
    cardOverlayEnabled: true,
    ...screenTransition,
};


const MainStack = createStackNavigator();

function MainStackComponent(props: { createTabNavigator: () => React.Node }) {
    return (
        <MainStack.Navigator
            initialRouteName={'main'}
            headerMode={'screen'}
            screenOptions={defaultScreenOptions}
        >
            <MainStack.Screen
                name="main"
                component={props.createTabNavigator}
                options={{
                    headerShown: false,
                    title: i18n.t('screens.home.title'),
                }}
            />
            <MainStack.Screen
                name="settings"
                component={SettingsScreen}
                options={{
                    title: i18n.t('screens.settings.title'),
                }}
            />
            <MainStack.Screen
                name="dashboard-edit"
                component={DashboardEditScreen}
                options={{
                    title: i18n.t('screens.settings.dashboardEdit.title'),
                }}
            />
            <MainStack.Screen
                name="about"
                component={AboutScreen}
                options={{
                    title: i18n.t('screens.about.title'),
                }}
            />
            <MainStack.Screen
                name="dependencies"
                component={AboutDependenciesScreen}
                options={{
                    title: i18n.t('screens.about.libs')
                }}
            />
            <MainStack.Screen
                name="debug"
                component={DebugScreen}
                options={{
                    title: i18n.t('screens.about.debug')
                }}
            />
            <MainStack.Screen
                name="tetris"
                component={GameScreen}
                options={{
                    title: i18n.t("screens.game.title"),
                }}
            />
            {createScreenCollapsibleStack("login", MainStack, LoginScreen, i18n.t('screens.login.title'),
                true, {headerTintColor: "#fff"}, 'transparent')}
            {getWebsiteStack("website", MainStack, WebsiteScreen, "")}


            {createScreenCollapsibleStack("self-menu", MainStack, SelfMenuScreen, i18n.t('screens.menu.title'))}
            {createScreenCollapsibleStack("proximo", MainStack, ProximoMainScreen, i18n.t('screens.proximo.title'))}
            {createScreenCollapsibleStack(
                "proximo-list",
                MainStack,
                ProximoListScreen,
                i18n.t('screens.proximo.articleList'),
                true,
                {...screenTransition},
            )}
            <MainStack.Screen
                name="proximo-about"
                component={ProximoAboutScreen}
                options={{
                    title: i18n.t('screens.proximo.title'),
                    ...modalTransition,
                }}
            />

            {createScreenCollapsibleStack("profile", MainStack, ProfileScreen, i18n.t('screens.profile.title'))}
            {createScreenCollapsibleStack("club-list", MainStack, ClubListScreen, i18n.t('screens.clubs.title'))}
            {createScreenCollapsibleStack("equipment-list", MainStack, EquipmentScreen, i18n.t('screens.equipment.title'))}
            {createScreenCollapsibleStack("equipment-rent", MainStack, EquipmentLendScreen, i18n.t('screens.equipment.book'))}
            {createScreenCollapsibleStack("equipment-confirm", MainStack, EquipmentConfirmScreen, i18n.t('screens.equipment.confirm'))}
            <MainStack.Screen
                name="club-information"
                component={ClubDisplayScreen}
                options={{
                    title: i18n.t('screens.clubs.details'),
                    ...modalTransition,
                }}
            />
            <MainStack.Screen
                name="club-about"
                component={ClubAboutScreen}
                options={{
                    title: i18n.t('screens.clubs.title'),
                    ...modalTransition,
                }}
            />
            <MainStack.Screen
                name="vote"
                component={VoteScreen}
                options={{
                    title: i18n.t('screens.vote.title'),
                }}
            />

            <MainStack.Screen
                name="feedback"
                component={BugReportScreen}
                options={{
                    title: i18n.t('screens.feedback.title'),
                }}
            />
        </MainStack.Navigator>
    );
}

type Props = {
    defaultHomeRoute: string | null,
    defaultHomeData: { [key: string]: any }
}

export default class MainNavigator extends React.Component<Props> {

    createTabNavigator: () => React.Node;

    constructor(props: Props) {
        super(props);
        this.createTabNavigator = () => <TabNavigator {...props}/>
    }

    render() {
        return (
            <MainStackComponent createTabNavigator={this.createTabNavigator}/>
        );
    }
}
