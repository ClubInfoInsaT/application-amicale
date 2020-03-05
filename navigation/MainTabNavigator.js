import * as React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";

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
import AboutScreen from "../screens/About/AboutScreen";
import AboutDependenciesScreen from "../screens/About/AboutDependenciesScreen";
import DebugScreen from "../screens/DebugScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AsyncStorageManager from "../utils/AsyncStorageManager";

const TAB_ICONS = {
    Home: 'triangle',
    Planning: 'calendar-range',
    Proxiwash: 'washing-machine',
    Proximo: 'shopping',
    Planex: 'timetable',
};

const ProximoStack = createStackNavigator();

function ProximoStackComponent() {
    return (
        <ProximoStack.Navigator
            initialRouteName="ProximoMainScreen"
            mode='card'
            headerMode="none"
            screenOptions={{
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
            <ProximoStack.Screen
                name="ProximoMainScreen"
                component={ProximoMainScreen}
            />
            <ProximoStack.Screen
                name="ProximoListScreen"
                component={ProximoListScreen}
            />
            <ProximoStack.Screen
                name="ProximoAboutScreen"
                component={ProximoAboutScreen}
                options={{
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
            />
        </ProximoStack.Navigator>
    );
}

const ProxiwashStack = createStackNavigator();

function ProxiwashStackComponent() {
    return (
        <ProxiwashStack.Navigator
            initialRouteName="ProxiwashScreen"
            mode='card'
            headerMode="none"
            screenOptions={{
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
        >
            <ProxiwashStack.Screen
                name="ProxiwashScreen"
                component={ProxiwashScreen}
            />
            <ProxiwashStack.Screen
                name="ProxiwashAboutScreen"
                component={ProxiwashAboutScreen}
            />
        </ProxiwashStack.Navigator>
    );
}

const PlanningStack = createStackNavigator();

function PlanningStackComponent() {
    return (
        <PlanningStack.Navigator
            initialRouteName="PlanningScreen"
            mode='card'
            headerMode="none"
            screenOptions={{
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
        >
            <PlanningStack.Screen
                name="PlanningScreen"
                component={PlanningScreen}
            />
            <PlanningStack.Screen
                name="PlanningDisplayScreen"
                component={PlanningDisplayScreen}
            />
        </PlanningStack.Navigator>
    );
}

const HomeStack = createStackNavigator();

function HomeStackComponent() {
    return (
        <HomeStack.Navigator
            initialRouteName="HomeScreen"
            mode='card'
            headerMode="none"
            screenOptions={{
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
        >
            <HomeStack.Screen
                name="HomeScreen"
                component={HomeScreen}
            />
            <HomeStack.Screen
                name="PlanningDisplayScreen"
                component={PlanningDisplayScreen}
            />
        </HomeStack.Navigator>
    );
}

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName={AsyncStorageManager.getInstance().preferences.defaultStartScreen}
            barStyle={{backgroundColor: ThemeManager.getCurrentThemeVariables().brandPrimary}}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let icon = TAB_ICONS[route.name];
                    // tintColor is ignoring activeColor and inactiveColor for some reason
                    color = focused ? "#f0edf6" : "#4e1108";
                    return <CustomMaterialIcon icon={icon} color={color}/>;
                },
            })}
        >
            <Tab.Screen
                name="Proximo"
                component={ProximoStackComponent}
            />
            <Tab.Screen
                name="Planning"
                component={PlanningStackComponent}
            />
            <Tab.Screen
                name="Home"
                component={HomeStackComponent}
            />
            <Tab.Screen
                name="Proxiwash"
                component={ProxiwashStackComponent}
            />
            <Tab.Screen
                name="Planex"
                component={PlanexScreen}
            />
        </Tab.Navigator>
    );
}
