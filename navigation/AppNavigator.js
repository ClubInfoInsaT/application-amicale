// @flow

import {createAppContainer, createStackNavigator} from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import ProximoListScreen from '../screens/Proximo/ProximoListScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';

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
        },
        {
            initialRouteName: "Main",
            mode: 'card',
            headerMode: "none"
        })
);
