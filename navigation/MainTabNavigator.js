import * as React from 'react';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";

import HomeScreen from '../screens/HomeScreen';
import PlanningScreen from '../screens/PlanningScreen';
import ProxiwashScreen from '../screens/ProxiwashScreen';
import ProximoMainScreen from '../screens/Proximo/ProximoMainScreen';
import PlanexScreen from '../screens/PlanexScreen';
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import ThemeManager from "../utils/ThemeManager";

const TAB_ICONS = {
    Home: 'coffee',
    Planning: 'calendar-range',
    Proxiwash: 'washing-machine',
    Proximo: 'shopping',
    Planex: 'timetable',
};


export default createMaterialBottomTabNavigator({
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
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: '#4e1108',
    backBehavior: 'initialRoute',
    barStyle: {backgroundColor: ThemeManager.getCurrentThemeVariables().brandPrimary},
});
