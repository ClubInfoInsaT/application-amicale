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
import {MaterialCommunityIcons} from "@expo/vector-icons";
import ThemeManager from "../utils/ThemeManager";
import AsyncStorageManager from "../utils/AsyncStorageManager";
import HeaderButton from "../components/HeaderButton";

const TAB_ICONS = {
    Home: 'triangle',
    Planning: 'calendar-range',
    Proxiwash: 'washing-machine',
    Proximo: 'shopping',
    Planex: 'timetable',
};

const defaultScreenOptions = {
    gestureEnabled: true,
    cardOverlayEnabled: true,
    ...TransitionPresets.SlideFromRightIOS,
};

function getDrawerButton(navigation: Object) {
    return (
        <HeaderButton icon={'menu'} onPress={navigation.openDrawer}/>
    );
}

const ProximoStack = createStackNavigator();

function ProximoStackComponent() {
    return (
        <ProximoStack.Navigator
            initialRouteName="ProximoMainScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <ProximoStack.Screen
                name="ProximoMainScreen"
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: 'Proximo',
                        headerLeft: openDrawer
                    };
                }}
                component={ProximoMainScreen}
            />
            <ProximoStack.Screen
                name="ProximoListScreen"
                options={{
                    title: 'Articles'
                }}
                component={ProximoListScreen}
            />
            <ProximoStack.Screen
                name="ProximoAboutScreen"
                component={ProximoAboutScreen}
                options={{
                    title: 'Proximo',
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
            headerMode='float'
            screenOptions={defaultScreenOptions}
        >
            <ProxiwashStack.Screen
                name="ProxiwashScreen"
                component={ProxiwashScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: 'Proxiwash',
                        headerLeft: openDrawer
                    };
                }}
            />
            <ProxiwashStack.Screen
                name="ProxiwashAboutScreen"
                component={ProxiwashAboutScreen}
                options={{
                    title: 'Proxiwash',
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
            />
        </ProxiwashStack.Navigator>
    );
}

const PlanningStack = createStackNavigator();

function PlanningStackComponent() {
    return (
        <PlanningStack.Navigator
            initialRouteName="PlanningScreen"
            headerMode='float'
            screenOptions={defaultScreenOptions}
        >
            <PlanningStack.Screen
                name="PlanningScreen"
                component={PlanningScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: 'Planning',
                        headerLeft: openDrawer
                    };
                }}
            />
            <PlanningStack.Screen
                name="PlanningDisplayScreen"
                component={PlanningDisplayScreen}
                options={{
                    title: 'Details',
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
            />
        </PlanningStack.Navigator>
    );
}

const HomeStack = createStackNavigator();

function HomeStackComponent() {
    return (
        <HomeStack.Navigator
            initialRouteName="HomeScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <HomeStack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: 'Home',
                        headerLeft: openDrawer
                    };
                }}
            />
            <HomeStack.Screen
                name="PlanningDisplayScreen"
                component={PlanningDisplayScreen}
                options={{
                    title: 'Details',
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
            />
        </HomeStack.Navigator>
    );
}

const PlanexStack = createStackNavigator();

function PlanexStackComponent() {
    return (
        <PlanexStack.Navigator
            initialRouteName="HomeScreen"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <PlanexStack.Screen
                name="PlanexScreen"
                component={PlanexScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: 'Planex',
                        headerLeft: openDrawer
                    };
                }}
            />
        </PlanexStack.Navigator>
    );
}

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName={AsyncStorageManager.getInstance().preferences.defaultStartScreen.current}
            barStyle={{backgroundColor: ThemeManager.getCurrentThemeVariables().primary}}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let icon = TAB_ICONS[route.name];
                    // tintColor is ignoring activeColor and inactiveColor for some reason
                    color = focused ? "#f0edf6" : "#4e1108";
                    return <MaterialCommunityIcons name={icon} color={color} size={26}/>;
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
                component={PlanexStackComponent}
            />
        </Tab.Navigator>
    );
}
