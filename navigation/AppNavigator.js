// @flow

import {createAppContainer, createStackNavigator} from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import ProximoListScreen from '../screens/Proximo/ProximoListScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import ProxiwashAboutScreen from '../screens/ProxiwashAboutScreen';
import ProximoAboutScreen from '../screens/Proximo/ProximoAboutScreen';
import SelfMenuScreen from '../screens/SelfMenuScreen';
import {fromRight} from "react-navigation-transitions";

/**
 * Create a stack navigator using the drawer to handle navigation between screens
 */
export default createAppContainer(
    createStackNavigator({
            Main: MainTabNavigator,
            // Drawer: MainDrawerNavigator,
            ProximoListScreen: {screen: ProximoListScreen},
            SettingsScreen: {screen: SettingsScreen},
            AboutScreen: {screen: AboutScreen},
            AboutDependenciesScreen: {screen: AboutDependenciesScreen},
            SelfMenuScreen: {screen: SelfMenuScreen},
            ProxiwashAboutScreen: {screen: ProxiwashAboutScreen},
            ProximoAboutScreen: {screen: ProximoAboutScreen},
        },
        {
            initialRouteName: "Main",
            mode: 'card',
            headerMode: "none",
            transitionConfig: () => fromRight(),
        })
);
