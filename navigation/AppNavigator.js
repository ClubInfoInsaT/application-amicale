// @flow

import {createAppContainer, createStackNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigatorWithInitialRoute} from './MainTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import ProximoListScreen from '../screens/Proximo/ProximoListScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import ProxiwashAboutScreen from '../screens/Proxiwash/ProxiwashAboutScreen';
import ProximoAboutScreen from '../screens/Proximo/ProximoAboutScreen';
import SelfMenuScreen from '../screens/SelfMenuScreen';
import TutorInsaScreen from "../screens/Websites/TutorInsaScreen";
import AmicaleScreen from "../screens/Websites/AmicaleScreen";
import WiketudScreen from "../screens/Websites/WiketudScreen";
import ElusEtudScreen from "../screens/Websites/ElusEtudScreen";
import BlueMindScreen from "../screens/Websites/BlueMindScreen";
import EntScreen from "../screens/Websites/EntScreen";
import AvailableRoomScreen from "../screens/Websites/AvailableRoomScreen";
import DebugScreen from '../screens/DebugScreen';
import {fromRight} from "react-navigation-transitions";


/**
 * Create a stack navigator using the drawer to handle navigation between screens
 */
function createAppContainerWithInitialRoute(initialRoute: string) {
    return createAppContainer(
        createStackNavigator({
                Main: createMaterialBottomTabNavigatorWithInitialRoute(initialRoute),
                // Drawer: MainDrawerNavigator,
                ProximoListScreen: {screen: ProximoListScreen},
                SettingsScreen: {screen: SettingsScreen},
                AboutScreen: {screen: AboutScreen},
                AboutDependenciesScreen: {screen: AboutDependenciesScreen},
                SelfMenuScreen: {screen: SelfMenuScreen},
                TutorInsaScreen: {screen: TutorInsaScreen},
                AmicaleScreen: {screen: AmicaleScreen},
                WiketudScreen: {screen: WiketudScreen},
                ElusEtudScreen: {screen: ElusEtudScreen},
                BlueMindScreen: {screen: BlueMindScreen},
                EntScreen: {screen: EntScreen},
                AvailableRoomScreen: {screen: AvailableRoomScreen},
                ProxiwashAboutScreen: {screen: ProxiwashAboutScreen},
                ProximoAboutScreen: {screen: ProximoAboutScreen},
                DebugScreen: {screen: DebugScreen},
            },
            {
                initialRouteName: "Main",
                mode: 'card',
                headerMode: "none",
                transitionConfig: () => fromRight(),
            })
    );
}

export {createAppContainerWithInitialRoute};
