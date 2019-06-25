import React from 'react';
import {createDrawerNavigator} from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import PlanningScreen from '../screens/PlanningScreen';
import ProxiwashScreen from '../screens/ProxiwashScreen';
import ProximoScreen from '../screens/ProximoScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import SideMenu from "../components/SideMenu";


export default createDrawerNavigator({
        Home: {screen: HomeScreen},
        Planning: {screen: PlanningScreen,},
        Proxiwash: {screen: ProxiwashScreen,},
        Proximo: {screen: ProximoScreen,},
        Settings: {screen: SettingsScreen,},
        About: {screen: AboutScreen,},
    }, {
        contentComponent: SideMenu,
    }
);

