// @flow

import * as React from 'react';
import {createDrawerNavigator, DrawerNavigationProp} from '@react-navigation/drawer';
import SettingsScreen from '../screens/Other/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import SelfMenuScreen from '../screens/Other/SelfMenuScreen';
import AvailableRoomScreen from "../screens/Websites/AvailableRoomScreen";
import BibScreen from "../screens/Websites/BibScreen";
import TetrisScreen from "../screens/Tetris/TetrisScreen";
import DebugScreen from '../screens/About/DebugScreen';
import Sidebar from "../components/Sidebar/Sidebar";
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import i18n from "i18n-js";
import LoginScreen from "../screens/Amicale/LoginScreen";
import ProfileScreen from "../screens/Amicale/ProfileScreen";
import ClubListScreen from "../screens/Amicale/Clubs/ClubListScreen";
import ClubDisplayScreen from "../screens/Amicale/Clubs/ClubDisplayScreen";
import ClubAboutScreen from "../screens/Amicale/Clubs/ClubAboutScreen";
import VoteScreen from "../screens/Amicale/VoteScreen";
import AmicaleContactScreen from "../screens/Amicale/AmicaleContactScreen";
import {AmicaleWebsiteScreen} from "../screens/Websites/AmicaleWebsiteScreen";
import {TutorInsaWebsiteScreen} from "../screens/Websites/TutorInsaWebsiteScreen";
import {WiketudWebsiteScreen} from "../screens/Websites/WiketudWebsiteScreen";
import {ElusEtudiantsWebsiteScreen} from "../screens/Websites/ElusEtudiantsWebsiteScreen";
import {createCollapsibleStack} from "react-navigation-collapsible";
import {useTheme} from "react-native-paper";
import TabNavigator from "./MainTabNavigator";

const defaultScreenOptions = {
    gestureEnabled: true,
    cardOverlayEnabled: true,
    ...TransitionPresets.SlideFromRightIOS,
};

function createScreenCollapsibleStack (name: string, component: any, title: string, useNativeDriver?: boolean) {
    const {colors} = useTheme();
    return createCollapsibleStack(
        <DrawerStack.Screen
            name={name}
            component={component}
            options={{
                title: title,
                headerStyle: {
                    backgroundColor: colors.surface,
                },
            }}
        />,
        {
            collapsedColor: 'transparent',
            useNativeDriver: useNativeDriver != null ? useNativeDriver : true, // native driver does not work with webview
        }
    )
}

function getWebsiteStack(name: string, component: any, title: string) {
    return createScreenCollapsibleStack(name, component, title, false);
}

const DrawerStack = createStackNavigator();

function DrawerStackComponent(props) {
        return (
            <DrawerStack.Navigator
                initialRouteName={'main'}
                headerMode={'screen'}
                screenOptions={defaultScreenOptions}
            >
                <DrawerStack.Screen
                    name="main"
                    component={props.createTabNavigator}
                    options={{
                        headerShown: false,
                    }}
                />
                <DrawerStack.Screen
                    name="settings"
                    component={SettingsScreen}
                    options={{
                        title: i18n.t('screens.settings'),
                    }}
                />
                <DrawerStack.Screen
                    name="about"
                    component={AboutScreen}
                    options={{
                        title: i18n.t('screens.about'),
                    }}
                />
                <DrawerStack.Screen
                    name="dependencies"
                    component={AboutDependenciesScreen}
                    options={{
                        title: i18n.t('aboutScreen.libs')
                    }}
                />
                <DrawerStack.Screen
                    name="debug"
                    component={DebugScreen}
                    options={{
                        title: i18n.t('aboutScreen.debug')
                    }}
                />
                {createScreenCollapsibleStack("self-menu", SelfMenuScreen, i18n.t('screens.menuSelf'))}
                {getWebsiteStack("available-rooms", AvailableRoomScreen, i18n.t('screens.availableRooms'))}
                {getWebsiteStack("bib", BibScreen, i18n.t('screens.bib'))}
                {getWebsiteStack("amicale-website", AmicaleWebsiteScreen, "Amicale")}
                {getWebsiteStack("elus-etudiants", ElusEtudiantsWebsiteScreen, "Élus Étudiants")}
                {getWebsiteStack("wiketud", WiketudWebsiteScreen, "Wiketud")}
                {getWebsiteStack("tutorinsa", TutorInsaWebsiteScreen, "Tutor'INSA")}
                <DrawerStack.Screen
                    name="tetris"
                    component={TetrisScreen}
                    options={{
                        title: i18n.t("game.title"),
                    }}
                />
                <DrawerStack.Screen
                    name="login"
                    component={LoginScreen}
                    options={{
                        title: i18n.t('screens.login'),
                    }}
                />
                <DrawerStack.Screen
                    name="profile"
                    component={ProfileScreen}
                    options={{
                            title: i18n.t('screens.profile'),
                        }}
                />
                {createScreenCollapsibleStack("club-list", ClubListScreen, i18n.t('clubs.clubList'))}
                <DrawerStack.Screen
                    name="club-information"
                    component={ClubDisplayScreen}
                    options={{
                        title: i18n.t('screens.clubDisplayScreen'),
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    }}
                />
                <DrawerStack.Screen
                    name="club-about"
                    component={ClubAboutScreen}
                    options={{
                        title: i18n.t('screens.clubsAbout'),
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    }}
                />
                <DrawerStack.Screen
                    name="vote"
                    component={VoteScreen}
                    options={{
                        title: i18n.t('screens.vote'),
                    }}
                />
                <DrawerStack.Screen
                    name="amicale-contact"
                    component={AmicaleContactScreen}
                    options={{
                        title: i18n.t('screens.amicaleAbout'),
                    }}
                />
            </DrawerStack.Navigator>
        );
}

const Drawer = createDrawerNavigator();

type Props = {
    defaultHomeRoute: string | null,
    defaultHomeData: { [key: string]: any }
}

export default class DrawerNavigator extends React.Component<Props> {

    createDrawerStackComponent: () => React.Node;

    constructor(props: Props) {
        super(props);
        const createTabNavigator = () => <TabNavigator {...props}/>
        this.createDrawerStackComponent = () => <DrawerStackComponent createTabNavigator={createTabNavigator}/>;
    }

    getDrawerContent = (props: {
        navigation: DrawerNavigationProp,
        state: { [key: string]: any }
    }) => <Sidebar {...props}/>

    render() {
        return (
            <Drawer.Navigator
                initialRouteName={'stack'}
                headerMode={'none'}
                backBehavior={'initialRoute'}
                drawerType={'front'}
                drawerContent={this.getDrawerContent}
                screenOptions={defaultScreenOptions}
            >
                <Drawer.Screen
                    name="stack"
                    component={this.createDrawerStackComponent}
                />
            </Drawer.Navigator>
        );
    }
}
