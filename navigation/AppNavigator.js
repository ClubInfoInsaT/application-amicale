// @flow

import {createAppContainer, createStackNavigator} from 'react-navigation';

import MainDrawerNavigator from './MainDrawerNavigator';
import MainTabNavigator from './MainTabNavigator';
import ProximoListScreen from '../screens/Proximo/ProximoListScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';

/**
 * Create a stack navigator using the drawer to handle navigation between screens
 */
export default createAppContainer(
    createStackNavigator({
            Tabs: MainTabNavigator,
            // Drawer: MainDrawerNavigator,
            ProximoListScreen: {screen: ProximoListScreen},
            AboutDependenciesScreen: {screen: AboutDependenciesScreen},
        },
        {
            initialRouteName: "Tabs",
            mode: 'card',
            headerMode: "none"
        })
);
