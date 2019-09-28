import * as React from 'react';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";

import HomeScreen from '../screens/HomeScreen';
import PlanningScreen from '../screens/PlanningScreen';
import ProxiwashScreen from '../screens/Proxiwash/ProxiwashScreen';
import ProximoMainScreen from '../screens/Proximo/ProximoMainScreen';
import PlanexScreen from '../screens/PlanexScreen';
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import ThemeManager from "../utils/ThemeManager";
import AsyncStorageManager from "../utils/AsyncStorageManager";

const TAB_ICONS = {
    Home: 'triangle',
    Planning: 'calendar-range',
    Proxiwash: 'washing-machine',
    Proximo: 'shopping',
    Planex: 'timetable',
};

function createMaterialBottomTabNavigatorWithInitialRoute(initialRoute: string) {
    return createMaterialBottomTabNavigator({
        Home: {screen: HomeScreen},
        Planning: {screen: PlanningScreen,},
        Proxiwash: {screen: ProxiwashScreen,},
        Proximo: {screen: ProximoMainScreen,},
        Planex: {screen: PlanexScreen},
    }, {
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                let icon = TAB_ICONS[navigation.state.routeName];

                return <CustomMaterialIcon icon={icon} color={tintColor}/>;
            }
        }),
        order: ['Proximo', 'Planning', 'Home', 'Proxiwash', 'Planex'],
        initialRouteName: initialRoute,
        activeColor: '#f0edf6',
        inactiveColor: '#4e1108',
        backBehavior: 'initialRoute',
        barStyle: {backgroundColor: ThemeManager.getCurrentThemeVariables().brandPrimary},
    });
}


export {createMaterialBottomTabNavigatorWithInitialRoute};

