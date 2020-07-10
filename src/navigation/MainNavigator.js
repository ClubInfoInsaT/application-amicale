// @flow

import * as React from 'react';
import SettingsScreen from '../screens/Other/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import DebugScreen from '../screens/About/DebugScreen';
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import i18n from "i18n-js";
import TabNavigator from "./TabNavigator";
import TetrisScreen from "../screens/Tetris/TetrisScreen";
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
                    title: i18n.t('screens.home'),
                }}
            />
            <MainStack.Screen
                name="settings"
                component={SettingsScreen}
                options={{
                    title: i18n.t('screens.settings'),
                }}
            />
            <MainStack.Screen
                name="about"
                component={AboutScreen}
                options={{
                    title: i18n.t('screens.about'),
                }}
            />
            <MainStack.Screen
                name="dependencies"
                component={AboutDependenciesScreen}
                options={{
                    title: i18n.t('aboutScreen.libs')
                }}
            />
            <MainStack.Screen
                name="debug"
                component={DebugScreen}
                options={{
                    title: i18n.t('aboutScreen.debug')
                }}
            />
            <MainStack.Screen
                name="tetris"
                component={TetrisScreen}
                options={{
                    title: i18n.t("game.title"),
                }}
            />
            <MainStack.Screen
                name="login"
                component={LoginScreen}
                options={{
                    title: i18n.t('screens.login'),
                }}
            />

            {getWebsiteStack("website", MainStack, WebsiteScreen, "")}


            {createScreenCollapsibleStack("self-menu", MainStack, SelfMenuScreen, i18n.t('screens.menuSelf'))}
            {createScreenCollapsibleStack("proximo", MainStack, ProximoMainScreen, i18n.t('screens.proximo'))}
            {createScreenCollapsibleStack(
                "proximo-list",
                MainStack,
                ProximoListScreen,
                i18n.t('screens.proximoArticles'),
                true,
                {...screenTransition},
            )}
            <MainStack.Screen
                name="proximo-about"
                component={ProximoAboutScreen}
                options={{
                    title: i18n.t('screens.proximo'),
                    ...modalTransition,
                }}
            />

            {createScreenCollapsibleStack("profile", MainStack, ProfileScreen, i18n.t('screens.profile'))}
            {createScreenCollapsibleStack("club-list", MainStack, ClubListScreen, i18n.t('clubs.clubList'))}
            {createScreenCollapsibleStack("equipment-list", MainStack, EquipmentScreen, i18n.t('screens.equipmentList'))}
            {createScreenCollapsibleStack("equipment-rent", MainStack, EquipmentLendScreen, i18n.t('screens.equipmentLend'))}
            {createScreenCollapsibleStack("equipment-confirm", MainStack, EquipmentConfirmScreen, i18n.t('screens.equipmentConfirm'))}
            <MainStack.Screen
                name="club-information"
                component={ClubDisplayScreen}
                options={{
                    title: i18n.t('screens.clubDisplayScreen'),
                    ...modalTransition,
                }}
            />
            <MainStack.Screen
                name="club-about"
                component={ClubAboutScreen}
                options={{
                    title: i18n.t('screens.clubsAbout'),
                    ...modalTransition,
                }}
            />
            <MainStack.Screen
                name="vote"
                component={VoteScreen}
                options={{
                    title: i18n.t('screens.vote'),
                }}
            />

            <MainStack.Screen
                name="feedback"
                component={BugReportScreen}
                options={{
                    title: i18n.t('screens.feedback'),
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
