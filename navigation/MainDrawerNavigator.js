// @flow

import * as React from 'react';
import {createDrawerNavigator} from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import PlanningScreen from '../screens/PlanningScreen';
import ProxiwashScreen from '../screens/ProxiwashScreen';
import ProximoMainScreen from '../screens/Proximo/ProximoMainScreen';
import PlanexScreen from '../screens/PlanexScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import Sidebar from "../components/Sidebar";

/**
 * Creates the drawer navigation stack
 */
export default createDrawerNavigator({
        Home: {screen: HomeScreen},
        Planning: {screen: PlanningScreen,},
        Proxiwash: {screen: ProxiwashScreen,},
        Proximo: {screen: ProximoMainScreen,},
        Planex: {screen: PlanexScreen},
        Settings: {screen: SettingsScreen,},
        About: {screen: AboutScreen,},
    }, {
        contentComponent: Sidebar,
        initialRouteName: 'Home',
        backBehavior: 'initialRoute',
        drawerType: 'front',
        useNativeAnimations: true,
    }
);

