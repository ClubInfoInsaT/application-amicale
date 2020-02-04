import * as React from 'react';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";

import HomeScreen from '../screens/HomeScreen';
import PlanningScreen from '../screens/PlanningScreen';
import PlanningDisplayScreen from '../screens/PlanningDisplayScreen';
import ProxiwashScreen from '../screens/Proxiwash/ProxiwashScreen';
import ProxiwashAboutScreen from '../screens/Proxiwash/ProxiwashAboutScreen';
import ProximoMainScreen from '../screens/Proximo/ProximoMainScreen';
import ProximoListScreen from "../screens/Proximo/ProximoListScreen";
import ProximoAboutScreen from "../screens/Proximo/ProximoAboutScreen";
import PlanexScreen from '../screens/Websites/PlanexScreen';
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import ThemeManager from "../utils/ThemeManager";

const TAB_ICONS = {
    Home: 'triangle',
    Planning: 'calendar-range',
    Proxiwash: 'washing-machine',
    Proximo: 'shopping',
    Planex: 'timetable',
};

const ProximoStack = createStackNavigator({
        ProximoMainScreen: {screen: ProximoMainScreen},
        ProximoListScreen: {screen: ProximoListScreen},
        ProximoAboutScreen: {
            screen: ProximoAboutScreen,
            navigationOptions: ({ navigation }) => ({
                ...TransitionPresets.ModalPresentationIOS,
            }),
        },
    },
    {
        initialRouteName: "ProximoMainScreen",
        mode: 'card',
        headerMode: "none",
        defaultNavigationOptions: {
            gestureEnabled: true,
            cardOverlayEnabled: true,
            ...TransitionPresets.SlideFromRightIOS,
        },
    });

const ProxiwashStack = createStackNavigator({
        ProxiwashScreen: {screen: ProxiwashScreen},
        ProxiwashAboutScreen: {screen: ProxiwashAboutScreen},
    },
    {
        initialRouteName: "ProxiwashScreen",
        mode: 'card',
        headerMode: "none",
        defaultNavigationOptions: {
            gestureEnabled: true,
            cardOverlayEnabled: true,
            ...TransitionPresets.ModalPresentationIOS,
        },
    });

const PlanningStack = createStackNavigator({
        PlanningScreen: {screen: PlanningScreen},
        PlanningDisplayScreen: {screen: PlanningDisplayScreen},
    },
    {
        initialRouteName: "PlanningScreen",
        mode: 'card',
        headerMode: "none",
        defaultNavigationOptions: {
            gestureEnabled: true,
            cardOverlayEnabled: true,
            ...TransitionPresets.ModalPresentationIOS,
        },
    });

const HomeStack = createStackNavigator({
        HomeScreen: {screen: HomeScreen},
        PlanningDisplayScreen: {screen: PlanningDisplayScreen},
    },
    {
        initialRouteName: "HomeScreen",
        mode: 'card',
        headerMode: "none",
        defaultNavigationOptions: {
            gestureEnabled: true,
            cardOverlayEnabled: true,
            ...TransitionPresets.ModalPresentationIOS,
        },
    });

function createMaterialBottomTabNavigatorWithInitialRoute(initialRoute: string) {
    return createMaterialBottomTabNavigator({
        Home: HomeStack,
        Planning: PlanningStack,
        Proxiwash: ProxiwashStack,
        Proximo: ProximoStack,
        Planex: {
            screen: PlanexScreen,
            navigationOptions: ({navigation}) => {
                const showTabBar = navigation.state && navigation.state.params ? navigation.state.params.showTabBar : true;
                return {
                    tabBarVisible: showTabBar,
                };
            },
        },
    }, {
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, tintColor}) => {
                let icon = TAB_ICONS[navigation.state.routeName];
                // tintColor is ignoring activeColor et inactiveColor for some reason
                let color = focused ? "#f0edf6" : "#4e1108";
                return <CustomMaterialIcon icon={icon} color={color}/>;
            },
            tabBarVisible: true,
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

