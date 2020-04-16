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
import {FAB, useTheme, withTheme} from 'react-native-paper';
import i18n from "i18n-js";
import ClubDisplayScreen from "../screens/Amicale/Clubs/ClubDisplayScreen";
import ScannerScreen from "../screens/ScannerScreen";
import MaterialHeaderButtons, {Item} from "../components/Custom/HeaderButton";
import FeedItemScreen from "../screens/FeedItemScreen";
import {createCollapsibleStack} from "react-navigation-collapsible";
import GroupSelectionScreen from "../screens/GroupSelectionScreen";

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
        <MaterialHeaderButtons left={true}>
            <Item title="menu" iconName="menu" onPress={navigation.openDrawer}/>
        </MaterialHeaderButtons>
    );
}

const ProximoStack = createStackNavigator();

function ProximoStackComponent() {
    const {colors} = useTheme();
    return (
        <ProximoStack.Navigator
            initialRouteName="index"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            {createCollapsibleStack(
                <ProximoStack.Screen
                    name="index"
                    options={({navigation}) => {
                        const openDrawer = getDrawerButton.bind(this, navigation);
                        return {
                            title: 'Proximo',
                            headerLeft: openDrawer,
                            headerStyle: {
                                backgroundColor: colors.surface,
                            },
                        };
                    }}
                    component={ProximoMainScreen}
                />,
                {
                    collapsedColor: 'transparent',
                    useNativeDriver: true,
                }
            )}
            {createCollapsibleStack(
                <ProximoStack.Screen
                    name="proximo-list"
                    options={{
                        title: i18n.t('screens.proximoArticles'),
                        headerStyle: {
                            backgroundColor: colors.surface,
                        }
                    }}
                    component={ProximoListScreen}
                />,
                {
                    collapsedColor: 'transparent',
                    useNativeDriver: true,
                }
            )}
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
    const {colors} = useTheme();
    return (
        <ProxiwashStack.Navigator
            initialRouteName="index"
            headerMode='float'
            screenOptions={defaultScreenOptions}
        >
            {createCollapsibleStack(
                <ProxiwashStack.Screen
                    name="index"
                    component={ProxiwashScreen}
                    options={({navigation}) => {
                        const openDrawer = getDrawerButton.bind(this, navigation);
                        return {
                            title: i18n.t('screens.proxiwash'),
                            headerLeft: openDrawer,
                            headerStyle: {
                                backgroundColor: colors.surface,
                            },
                        };
                    }}
                />,
                {
                    collapsedColor: 'transparent',
                    useNativeDriver: true,
                }
            )}
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
    const {colors} = useTheme();
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
    const {colors} = useTheme();
    return (
        <HomeStack.Navigator
            initialRouteName={"index"}
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            {createCollapsibleStack(
                <HomeStack.Screen
                    name="index"
                    component={HomeScreen}
                    options={({navigation}) => {
                        const openDrawer = getDrawerButton.bind(this, navigation);
                        return {
                            title: i18n.t('screens.home'),
                            headerLeft: openDrawer,
                            headerStyle: {
                                backgroundColor: colors.surface,
                            },
                        };
                    }}
                    initialParams={data}
                />,
                {
                    collapsedColor: 'transparent',
                    useNativeDriver: true,
                }
            )}
            <HomeStack.Screen
                name="home-planning-information"
                component={PlanningDisplayScreen}
                options={{
                    title: i18n.t('screens.planningDisplayScreen'),
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
            />
            <HomeStack.Screen
                name="home-club-information"
                component={ClubDisplayScreen}
                options={({navigation}) => {
                    return {
                        title: i18n.t('screens.clubDisplayScreen'),
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    };
                }}
            />
            <HomeStack.Screen
                name="feed-information"
                component={FeedItemScreen}
                options={({navigation}) => {
                    return {
                        title: i18n.t('screens.feedDisplayScreen'),
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
    const {colors} = useTheme();
    return (
        <PlanexStack.Navigator
            initialRouteName="index"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            {createCollapsibleStack(
                <PlanexStack.Screen
                    name="index"
                    component={PlanexScreen}
                    options={({navigation}) => {
                        const openDrawer = getDrawerButton.bind(this, navigation);
                        return {
                            title: 'Planex',
                            headerLeft: openDrawer,
                            headerStyle: {
                                backgroundColor: colors.surface,
                            },
                        };
                    }}
                />,
                {
                    collapsedColor: 'transparent',
                    useNativeDriver: false, // native driver does not work with webview
                }
            )}
            {createCollapsibleStack(
                <PlanexStack.Screen
                    name="group-select"
                    component={GroupSelectionScreen}
                    options={({navigation}) => {
                        return {
                            title: 'GroupSelectionScreen',
                            headerStyle: {
                                backgroundColor: colors.surface,
                            },
                            ...TransitionPresets.ModalSlideFromBottomIOS,
                        };
                    }}
                />,
                {
                    collapsedColor: 'transparent',
                    useNativeDriver: true,
                }
            )}
        </PlanexStack.Navigator>
    );
}

const Tab = createMaterialBottomTabNavigator();

type Props = {
    defaultRoute: string | null,
    defaultData: Object
}

class TabNavigator extends React.Component<Props> {

    createHomeStackComponent: Object;

    defaultRoute: string;

    constructor(props) {
        super(props);
        this.defaultRoute = AsyncStorageManager.getInstance().preferences.defaultStartScreen.current.toLowerCase();

        if (props.defaultRoute !== null)
            this.defaultRoute = 'home';

        this.createHomeStackComponent = () => HomeStackComponent(props.defaultRoute, props.defaultData);
    }

    getHomeButton(focused: boolean) {
        let icon = focused ? require('../../assets/tab-icon.png') : require('../../assets/tab-icon-outline.png')
        return (
                <FAB
                    icon={icon}
                    small
                    style={{position: 'absolute', top: '-25%'}}/>
        );
    }

    render() {
        return (
            <Tab.Navigator
                initialRouteName={this.defaultRoute}
                barStyle={{backgroundColor: this.props.theme.colors.surface, overflow: 'visible'}}
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color}) => {
                        let icon = TAB_ICONS[route.name];
                        icon = focused ? icon : icon + ('-outline');
                        if (route.name !== "home")
                            return <MaterialCommunityIcons name={icon} color={color} size={26}/>;
                        else
                            return this.getHomeButton(focused);
                    },
                    tabBarLabel: route.name !== 'home' ? undefined : ''
                })}
                activeColor={this.props.theme.colors.primary}
                inactiveColor={this.props.theme.colors.tabIcon}
            >
                <Tab.Screen
                    name="proximo"
                    option
                    component={ProximoStackComponent}
                    options={{title: i18n.t('screens.proximo')}}
                />
                <Tab.Screen
                    name="planning"
                    component={PlanningStackComponent}
                    options={{title: i18n.t('screens.planning')}}
                />
                <Tab.Screen
                    name="home"
                    component={this.createHomeStackComponent}
                    options={{title: i18n.t('screens.home')}}
                />
                <Tab.Screen
                    name="proxiwash"
                    component={ProxiwashStackComponent}
                    options={{title: i18n.t('screens.proxiwash')}}
                />
                <Tab.Screen
                    name="planex"
                    component={PlanexStackComponent}
                    options={{title: "Planex"}}
                />
            </Tab.Navigator>
        );
    }
}

export default withTheme(TabNavigator);
