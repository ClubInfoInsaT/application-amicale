import * as React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import HomeScreen from '../screens/Home/HomeScreen';
import PlanningScreen from '../screens/Planning/PlanningScreen';
import PlanningDisplayScreen from '../screens/Planning/PlanningDisplayScreen';
import ProxiwashScreen from '../screens/Proxiwash/ProxiwashScreen';
import ProxiwashAboutScreen from '../screens/Proxiwash/ProxiwashAboutScreen';
import ProximoMainScreen from '../screens/Proximo/ProximoMainScreen';
import ProximoListScreen from "../screens/Proximo/ProximoListScreen";
import ProximoAboutScreen from "../screens/Proximo/ProximoAboutScreen";
import PlanexScreen from '../screens/Planex/PlanexScreen';
import AsyncStorageManager from "../managers/AsyncStorageManager";
import {useTheme} from 'react-native-paper';
import {Platform} from 'react-native';
import i18n from "i18n-js";
import ClubDisplayScreen from "../screens/Amicale/Clubs/ClubDisplayScreen";
import ScannerScreen from "../screens/Home/ScannerScreen";
import FeedItemScreen from "../screens/Home/FeedItemScreen";
import {createCollapsibleStack} from "react-navigation-collapsible";
import GroupSelectionScreen from "../screens/Planex/GroupSelectionScreen";
import CustomTabBar from "../components/Tabbar/CustomTabBar";
import SelfMenuScreen from "../screens/Services/SelfMenuScreen";
import AvailableRoomScreen from "../screens/Websites/AvailableRoomScreen";
import BibScreen from "../screens/Websites/BibScreen";
import {AmicaleWebsiteScreen} from "../screens/Websites/AmicaleWebsiteScreen";
import {ElusEtudiantsWebsiteScreen} from "../screens/Websites/ElusEtudiantsWebsiteScreen";
import {WiketudWebsiteScreen} from "../screens/Websites/WiketudWebsiteScreen";
import {TutorInsaWebsiteScreen} from "../screens/Websites/TutorInsaWebsiteScreen";
import {ENTWebsiteScreen} from "../screens/Websites/ENTWebsiteScreen";
import {BlueMindWebsiteScreen} from "../screens/Websites/BlueMindWebsiteScreen";
import LoginScreen from "../screens/Amicale/LoginScreen";
import ProfileScreen from "../screens/Amicale/ProfileScreen";
import ClubListScreen from "../screens/Amicale/Clubs/ClubListScreen";
import ClubAboutScreen from "../screens/Amicale/Clubs/ClubAboutScreen";
import VoteScreen from "../screens/Amicale/VoteScreen";
import AmicaleContactScreen from "../screens/Amicale/AmicaleContactScreen";
import AmicaleHomeScreen from "../screens/Amicale/AmicaleHomeScreen";
import WebsitesHomeScreen from "../screens/Services/ServicesScreen";
import ServicesSectionScreen from "../screens/Services/ServicesSectionScreen";

const defaultScreenOptions = {
    gestureEnabled: true,
    cardOverlayEnabled: true,
    ...TransitionPresets.ScaleFromCenterAndroid,
};

const modalTransition = Platform.OS === 'ios' ? TransitionPresets.ModalPresentationIOS : TransitionPresets.ModalSlideFromBottomIOS;

const screenTransition = Platform.OS === 'ios' ? TransitionPresets.SlideFromRightIOS : TransitionPresets.ScaleFromCenterAndroid;

function createScreenCollapsibleStack(
    name: string,
    Stack: any,
    component: any,
    title: string,
    useNativeDriver?: boolean,
    options?: { [key: string]: any }) {
    const {colors} = useTheme();
    const screenOptions = options != null ? options : {};
    return createCollapsibleStack(
        <Stack.Screen
            name={name}
            component={component}
            options={{
                title: title,
                headerStyle: {
                    backgroundColor: colors.surface,
                },
                ...screenOptions,
            }}
        />,
        {
            collapsedColor: 'transparent',
            useNativeDriver: useNativeDriver != null ? useNativeDriver : true, // native driver does not work with webview
        }
    )
}

function getWebsiteStack(name: string, Stack: any, component: any, title: string) {
    return createScreenCollapsibleStack(name, Stack, component, title, false);
}


const ServicesStack = createStackNavigator();

function ServicesStackComponent() {
    return (
        <ServicesStack.Navigator
            initialRouteName="index"
            headerMode={"screen"}
            screenOptions={defaultScreenOptions}
        >
            {createScreenCollapsibleStack("index", ServicesStack, WebsitesHomeScreen, i18n.t('screens.services'))}
            {createScreenCollapsibleStack("services-section", ServicesStack, ServicesSectionScreen, "SECTION")}

            {createScreenCollapsibleStack("proximo", ServicesStack, ProximoMainScreen, "Proximo")}
            {createScreenCollapsibleStack(
                "proximo-list",
                ServicesStack,
                ProximoListScreen,
                i18n.t('screens.proximoArticles'),
                true,
                {...screenTransition},
            )}
            <ServicesStack.Screen
                name="proximo-about"
                component={ProximoAboutScreen}
                options={{
                    title: i18n.t('screens.proximo'),
                    ...modalTransition,
                }}
            />

            {getWebsiteStack("available-rooms", ServicesStack, AvailableRoomScreen, i18n.t('screens.availableRooms'))}
            {getWebsiteStack("bib", ServicesStack, BibScreen, i18n.t('screens.bib'))}
            {createScreenCollapsibleStack("self-menu", ServicesStack, SelfMenuScreen, i18n.t('screens.menuSelf'))}

            {getWebsiteStack("amicale-website", ServicesStack, AmicaleWebsiteScreen, "Amicale")}
            {getWebsiteStack("elus-etudiants", ServicesStack, ElusEtudiantsWebsiteScreen, "Élus Étudiants")}
            {getWebsiteStack("wiketud", ServicesStack, WiketudWebsiteScreen, "Wiketud")}
            {getWebsiteStack("tutorinsa", ServicesStack, TutorInsaWebsiteScreen, "Tutor'INSA")}
            {getWebsiteStack("ent", ServicesStack, ENTWebsiteScreen, "ENT INSA")}
            {getWebsiteStack("bluemind", ServicesStack, BlueMindWebsiteScreen, "BlueMind")}
        </ServicesStack.Navigator>
    );
}

const ProxiwashStack = createStackNavigator();

function ProxiwashStackComponent() {
    return (
        <ProxiwashStack.Navigator
            initialRouteName="index"
            headerMode={"screen"}
            screenOptions={defaultScreenOptions}
        >
            {createScreenCollapsibleStack("index", ProxiwashStack, ProxiwashScreen, i18n.t('screens.proxiwash'))}
            <ProxiwashStack.Screen
                name="proxiwash-about"
                component={ProxiwashAboutScreen}
                options={{
                    title: i18n.t('screens.proxiwash'),
                    ...modalTransition,
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
            headerMode={"screen"}
            screenOptions={defaultScreenOptions}
        >
            <PlanningStack.Screen
                name="planning"
                component={PlanningScreen}
                options={{
                    title: i18n.t('screens.planning'),
                }}
            />
            <PlanningStack.Screen
                name="planning-information"
                component={PlanningDisplayScreen}
                options={{
                    title: i18n.t('screens.planningDisplayScreen'),
                    ...modalTransition,
                }}
            />
        </PlanningStack.Navigator>
    );
}

const HomeStack = createStackNavigator();

function HomeStackComponent(initialRoute: string | null, defaultData: { [key: string]: any }) {
    let params = undefined;
    if (initialRoute != null)
        params = {data: defaultData, nextScreen: initialRoute, shouldOpen: true};
    const {colors} = useTheme();
    return (
        <HomeStack.Navigator
            initialRouteName={"index"}
            headerMode={"screen"}
            screenOptions={defaultScreenOptions}
        >
            {createCollapsibleStack(
                <HomeStack.Screen
                    name="index"
                    component={HomeScreen}
                    options={{
                        title: i18n.t('screens.home'),
                        headerStyle: {
                            backgroundColor: colors.surface,
                        },
                    }}
                    initialParams={params}
                />,
                {
                    collapsedColor: 'transparent',
                    useNativeDriver: true,
                }
            )}
            <HomeStack.Screen
                name="scanner"
                component={ScannerScreen}
                options={{
                    title: i18n.t('screens.scanner'),
                    ...modalTransition,
                }}
            />
            <HomeStack.Screen
                name="club-information"
                component={ClubDisplayScreen}
                options={{
                    title: i18n.t('screens.clubDisplayScreen'),
                    ...modalTransition,
                }}
            />
            <HomeStack.Screen
                name="feed-information"
                component={FeedItemScreen}
                options={{
                    title: i18n.t('screens.feedDisplayScreen'),
                    ...modalTransition,
                }}
            />
            <HomeStack.Screen
                name="planning-information"
                component={PlanningDisplayScreen}
                options={{
                    title: i18n.t('screens.planningDisplayScreen'),
                    ...modalTransition,
                }}
            />
            {createScreenCollapsibleStack("self-menu", HomeStack, SelfMenuScreen, i18n.t('screens.menuSelf'), true, {...modalTransition})}

            <HomeStack.Screen
                name="login"
                component={LoginScreen}
                options={{
                    title: i18n.t('screens.login'),
                }}
            />
            {createScreenCollapsibleStack("profile", HomeStack, ProfileScreen, i18n.t('screens.profile'))}
            {createScreenCollapsibleStack("club-list", HomeStack, ClubListScreen, i18n.t('clubs.clubList'))}
            <HomeStack.Screen
                name="club-about"
                component={ClubAboutScreen}
                options={{
                    title: i18n.t('screens.clubsAbout'),
                    ...modalTransition,
                }}
            />
            <HomeStack.Screen
                name="vote"
                component={VoteScreen}
                options={{
                    title: i18n.t('screens.vote'),
                }}
            />
            <HomeStack.Screen
                name="amicale-contact"
                component={AmicaleContactScreen}
                options={{
                    title: i18n.t('screens.amicaleAbout'),
                }}
            />
            <HomeStack.Screen
                name="amicale-home"
                component={AmicaleHomeScreen}
                options={{
                    title: "AMICALE HOME",
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
            headerMode={"screen"}
            screenOptions={defaultScreenOptions}
        >
            {getWebsiteStack("index", PlanexStack, PlanexScreen, "Planex")}
            {createScreenCollapsibleStack(
                "group-select",
                PlanexStack,
                GroupSelectionScreen,
                "GROUP SELECT",
                true,
                {...modalTransition})}
        </PlanexStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

type Props = {
    defaultHomeRoute: string | null,
    defaultHomeData: { [key: string]: any }
}

export default class TabNavigator extends React.Component<Props> {

    createHomeStackComponent: () => HomeStackComponent;
    defaultRoute: string;

    constructor(props) {
        super(props);
        if (props.defaultHomeRoute != null)
            this.defaultRoute = 'home';
        else
            this.defaultRoute = AsyncStorageManager.getInstance().preferences.defaultStartScreen.current.toLowerCase();
        this.createHomeStackComponent = () => HomeStackComponent(props.defaultHomeRoute, props.defaultHomeData);
    }

    render() {
        return (
            <Tab.Navigator
                initialRouteName={this.defaultRoute}
                tabBar={props => <CustomTabBar {...props} />}
            >
                <Tab.Screen
                    name="services"
                    option
                    component={ServicesStackComponent}
                    options={{title: i18n.t('screens.services')}}
                />
                <Tab.Screen
                    name="proxiwash"
                    component={ProxiwashStackComponent}
                    options={{title: i18n.t('screens.proxiwash')}}
                />
                <Tab.Screen
                    name="home"
                    component={this.createHomeStackComponent}
                    options={{title: i18n.t('screens.home')}}
                />
                <Tab.Screen
                    name="planning"
                    component={PlanningStackComponent}
                    options={{title: i18n.t('screens.planning')}}
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
