// @flow

import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigator from './MainTabNavigator';
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
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";

const AboutStack = createStackNavigator();

function AboutStackComponent() {
    return (
        <AboutStack.Navigator
            initialRouteName="AboutScreen"
            mode='card'
            headerMode="none"
            screenOptions={{
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
            <AboutStack.Screen
                name="AboutScreen"
                component={AboutScreen}
            />
            <AboutStack.Screen
                name="AboutDependenciesScreen"
                component={AboutDependenciesScreen}
            />
            <AboutStack.Screen
                name="DebugScreen"
                component={DebugScreen}
            />
        </AboutStack.Navigator>
    );
}

const Drawer = createDrawerNavigator();

function getDrawerContent(nav) {
    return <Sidebar navigation={nav}/>
}

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            initialRouteName={'Main'}
            mode='card'
            drawerContent={props => getDrawerContent(props.navigation)}
            screenOptions={{
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
            <Drawer.Screen
                name="Main"
                component={TabNavigator}
            >
            </Drawer.Screen>
            <Drawer.Screen
                name="SettingsScreen"
                component={SettingsScreen}
            />
            <Drawer.Screen
                name="AboutScreen"
                component={AboutStackComponent}
            />
            <Drawer.Screen
                name="SelfMenuScreen"
                component={SelfMenuScreen}
            />
            <Drawer.Screen
                name="TutorInsaScreen"
                component={TutorInsaScreen}
            />
            <Drawer.Screen
                name="AmicaleScreen"
                component={AmicaleScreen}
            />
            <Drawer.Screen
                name="WiketudScreen"
                component={WiketudScreen}
            />
            <Drawer.Screen
                name="ElusEtudScreen"
                component={ElusEtudScreen}
            />
            <Drawer.Screen
                name="BlueMindScreen"
                component={BlueMindScreen}
            />
            <Drawer.Screen
                name="EntScreen"
                component={EntScreen}
            />
            <Drawer.Screen
                name="AvailableRoomScreen"
                component={AvailableRoomScreen}
            />
        </Drawer.Navigator>
    );
}
//
// // Create a stack to use animations
// function createDrawerStackWithInitialRoute(initialRoute: string) {
//     return createStackNavigator({
//             Main: createMaterialBottomTabNavigatorWithInitialRoute(initialRoute),
//             SettingsScreen: {screen: SettingsScreen},
//             AboutScreen: AboutStack,
//             SelfMenuScreen: {screen: SelfMenuScreen},
//             TutorInsaScreen: {screen: TutorInsaScreen},
//             AmicaleScreen: {screen: AmicaleScreen},
//             WiketudScreen: {screen: WiketudScreen},
//             ElusEtudScreen: {screen: ElusEtudScreen},
//             BlueMindScreen: {screen: BlueMindScreen},
//             EntScreen: {screen: EntScreen},
//             AvailableRoomScreen: {screen: AvailableRoomScreen},
//         },
//         {
//             initialRouteName: "Main",
//             mode: 'card',
//             headerMode: "none",
//             defaultNavigationOptions: {
//                 gestureEnabled: true,
//                 cardOverlayEnabled: true,
//                 ...TransitionPresets.SlideFromRightIOS,
//             },
//         });
// }

// /**
//  * Creates the drawer navigation stack
//  */
// function createDrawerNavigatorWithInitialRoute(initialRoute: string) {
//     return createDrawerNavigator({
//         Main: createDrawerStackWithInitialRoute(initialRoute),
//     }, {
//         contentComponent: Sidebar,
//         initialRouteName: 'Main',
//         backBehavior: 'initialRoute',
//         drawerType: 'front',
//         useNativeAnimations: true,
//     });
// }
//
// export {createDrawerNavigatorWithInitialRoute};
