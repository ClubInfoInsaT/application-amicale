// @flow

import { createDrawerNavigator } from 'react-navigation-drawer';
import {createMaterialBottomTabNavigatorWithInitialRoute} from './MainTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import SelfMenuScreen from '../screens/SelfMenuScreen';
import TutorInsaScreen from "../screens/Websites/TutorInsaScreen";
import AmicaleScreen from "../screens/Websites/AmicaleScreen";
import WiketudScreen from "../screens/Websites/WiketudScreen";
import ElusEtudScreen from "../screens/Websites/ElusEtudScreen";
import BlueMindScreen from "../screens/Websites/BlueMindScreen";
import EntScreen from "../screens/Websites/EntScreen";
import AvailableRoomScreen from "../screens/Websites/AvailableRoomScreen";
import DebugScreen from '../screens/DebugScreen';
import Sidebar from "../components/Sidebar";
import {createStackNavigator, TransitionPresets} from "react-navigation-stack";

const AboutStack = createStackNavigator({
        AboutScreen: {screen: AboutScreen},
        AboutDependenciesScreen: {screen: AboutDependenciesScreen},
        DebugScreen: {screen: DebugScreen},
    },
    {
        initialRouteName: "AboutScreen",
        mode: 'card',
        headerMode: "none",
        defaultNavigationOptions: {
            gestureEnabled: true,
            cardOverlayEnabled: true,
            ...TransitionPresets.SlideFromRightIOS,
        },
    });


// Create a stack to use animations
function createDrawerStackWithInitialRoute(initialRoute: string) {
    return createStackNavigator({
            Main: createMaterialBottomTabNavigatorWithInitialRoute(initialRoute),
            SettingsScreen: {screen: SettingsScreen},
            AboutScreen: AboutStack,
            SelfMenuScreen: {screen: SelfMenuScreen},
            TutorInsaScreen: {screen: TutorInsaScreen},
            AmicaleScreen: {screen: AmicaleScreen},
            WiketudScreen: {screen: WiketudScreen},
            ElusEtudScreen: {screen: ElusEtudScreen},
            BlueMindScreen: {screen: BlueMindScreen},
            EntScreen: {screen: EntScreen},
            AvailableRoomScreen: {screen: AvailableRoomScreen},
        },
        {
            initialRouteName: "Main",
            mode: 'card',
            headerMode: "none",
            defaultNavigationOptions: {
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            },
        });
}

/**
 * Creates the drawer navigation stack
 */
function createDrawerNavigatorWithInitialRoute(initialRoute: string) {
    return createDrawerNavigator({
        Main: createDrawerStackWithInitialRoute(initialRoute),
    }, {
        contentComponent: Sidebar,
        initialRouteName: 'Main',
        backBehavior: 'initialRoute',
        drawerType: 'front',
        useNativeAnimations: true,
    });
}

export {createDrawerNavigatorWithInitialRoute};
