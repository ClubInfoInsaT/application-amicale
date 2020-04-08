import * as React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";

import HomeScreen from '../screens/HomeScreen';
import PlanningScreen from '../screens/Planning/PlanningScreen';
import PlanningDisplayScreen from '../screens/Planning/PlanningDisplayScreen';
import ProxiwashScreen from '../screens/Proxiwash/ProxiwashScreen';
import ProxiwashAboutScreen from '../screens/Proxiwash/ProxiwashAboutScreen';
import ProximoMainScreen from '../screens/Proximo/ProximoMainScreen';
import ProximoListScreen from "../screens/Proximo/ProximoListScreen";
import ProximoAboutScreen from "../screens/Proximo/ProximoAboutScreen";
import PlanexScreen from '../screens/Websites/PlanexScreen';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import AsyncStorageManager from "../managers/AsyncStorageManager";
import HeaderButton from "../components/Custom/HeaderButton";
import {withTheme} from 'react-native-paper';
import i18n from "i18n-js";
import ClubDisplayScreen from "../screens/Amicale/Clubs/ClubDisplayScreen";
import ScannerScreen from "../screens/ScannerScreen";


const TAB_ICONS = {
    home: 'triangle',
    planning: 'calendar-range',
    proxiwash: 'tshirt-crew',
    proximo: 'cart',
    planex: 'clock',
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
            initialRouteName="index"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <ProximoStack.Screen
                name="index"
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
                name="proximo-list"
                options={{
                    title: i18n.t('screens.proximoArticles')
                }}
                component={ProximoListScreen}
            />
            <ProximoStack.Screen
                name="proximo-about"
                component={ProximoAboutScreen}
                options={{
                    title: i18n.t('screens.proximo'),
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
            initialRouteName="index"
            headerMode='float'
            screenOptions={defaultScreenOptions}
        >
            <ProxiwashStack.Screen
                name="index"
                component={ProxiwashScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.proxiwash'),
                        headerLeft: openDrawer
                    };
                }}
            />
            <ProxiwashStack.Screen
                name="proxiwash-about"
                component={ProxiwashAboutScreen}
                options={{
                    title: i18n.t('screens.proxiwash'),
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
            initialRouteName="index"
            headerMode='float'
            screenOptions={defaultScreenOptions}
        >
            <PlanningStack.Screen
                name="index"
                component={PlanningScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.planning'),
                        headerLeft: openDrawer
                    };
                }}
            />
            <PlanningStack.Screen
                name="planning-information"
                component={PlanningDisplayScreen}
                options={{
                    title: i18n.t('screens.planningDisplayScreen'),
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
            />
        </PlanningStack.Navigator>
    );
}

const HomeStack = createStackNavigator();

function HomeStackComponent(initialRoute: string | null, defaultData: Object) {
    let data;
    if (initialRoute !== null)
        data = {data: defaultData, nextScreen: initialRoute, shouldOpen: true};

    return (
        <HomeStack.Navigator
            initialRouteName={"index"}
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <HomeStack.Screen
                name="index"
                component={HomeScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.home'),
                        headerLeft: openDrawer
                    };
                }}
                initialParams={data}
            />
            <HomeStack.Screen
                name="planning-information"
                component={PlanningDisplayScreen}
                options={{
                    title: i18n.t('screens.planningDisplayScreen'),
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
            />
            <HomeStack.Screen
                name="club-information"
                component={ClubDisplayScreen}
                options={({navigation}) => {
                    return {
                        title: '',
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    };
                }}
            />
            <HomeStack.Screen
                name="scanner"
                component={ScannerScreen}
                options={({navigation}) => {
                    return {
                        title: i18n.t('screens.scanner'),
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    };
                }}
            />
        </HomeStack.Navigator>
    );
}

const PlanexStack = createStackNavigator();

function PlanexStackComponent() {
    return (
        <PlanexStack.Navigator
            initialRouteName="index"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <PlanexStack.Screen
                name="index"
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

type Props = {
    defaultRoute: string | null,
    defaultData: Object
}

class TabNavigator extends React.Component<Props>{

    createHomeStackComponent: Object;
    colors: Object;

    defaultRoute: string;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.defaultRoute = AsyncStorageManager.getInstance().preferences.defaultStartScreen.current.toLowerCase();

        if (props.defaultRoute !== null)
            this.defaultRoute = 'home';

        this.createHomeStackComponent = () => HomeStackComponent(props.defaultRoute, props.defaultData);
    }

    render() {
        return (
            <Tab.Navigator
                initialRouteName={this.defaultRoute}
                barStyle={{backgroundColor: this.colors.surface}}
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let icon = TAB_ICONS[route.name];
                        // tintColor is ignoring activeColor and inactiveColor for some reason
                        icon = focused ? icon : icon + ('-outline');
                        return <MaterialCommunityIcons name={icon} color={color} size={26}/>;
                    },
                })}
                activeColor={this.colors.primary}
                inactiveColor={this.colors.tabIcon}
            >
                <Tab.Screen
                    name="proximo"
                    component={ProximoStackComponent}
                />
                <Tab.Screen
                    name="planning"
                    component={PlanningStackComponent}
                />
                <Tab.Screen
                    name="home"
                    component={this.createHomeStackComponent}
                    options={{title: i18n.t('screens.home')}}
                />
                <Tab.Screen
                    name="proxiwash"
                    component={ProxiwashStackComponent}
                />
                <Tab.Screen
                    name="planex"
                    component={PlanexStackComponent}
                />
            </Tab.Navigator>
        );
    }
}

export default withTheme(TabNavigator);
