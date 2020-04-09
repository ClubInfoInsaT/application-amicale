// @flow

import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigator from './MainTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import SelfMenuScreen from '../screens/SelfMenuScreen';
import AvailableRoomScreen from "../screens/Websites/AvailableRoomScreen";
import BibScreen from "../screens/Websites/BibScreen";
import TetrisScreen from "../screens/Tetris/TetrisScreen";
import DebugScreen from '../screens/About/DebugScreen';
import Sidebar from "../components/Sidebar/Sidebar";
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import HeaderButton from "../components/Custom/HeaderButton";
import i18n from "i18n-js";
import LoginScreen from "../screens/Amicale/LoginScreen";
import ProfileScreen from "../screens/Amicale/ProfileScreen";
import ClubListScreen from "../screens/Amicale/Clubs/ClubListScreen";
import ClubDisplayScreen from "../screens/Amicale/Clubs/ClubDisplayScreen";
import ClubAboutScreen from "../screens/Amicale/Clubs/ClubAboutScreen";
import VoteScreen from "../screens/Amicale/VoteScreen";

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

const AboutStack = createStackNavigator();

function AboutStackComponent() {
    return (
        <AboutStack.Navigator
            initialRouteName="about"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <AboutStack.Screen
                name="about"
                component={AboutScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.about'),
                        headerLeft: openDrawer
                    };
                }}
            />
            <AboutStack.Screen
                name="dependencies"
                component={AboutDependenciesScreen}
                options={{
                    title: i18n.t('aboutScreen.libs')
                }}
            />
            <AboutStack.Screen
                name="debug"
                component={DebugScreen}
                options={{
                    title: i18n.t('aboutScreen.debug')
                }}
            />
        </AboutStack.Navigator>
    );
}

const SettingsStack = createStackNavigator();

function SettingsStackComponent() {
    return (
        <SettingsStack.Navigator
            initialRouteName="settings"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <SettingsStack.Screen
                name="settings"
                component={SettingsScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.settings'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </SettingsStack.Navigator>
    );
}

const SelfMenuStack = createStackNavigator();

function SelfMenuStackComponent() {
    return (
        <SelfMenuStack.Navigator
            initialRouteName="self-menu"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <SelfMenuStack.Screen
                name="self-menu"
                component={SelfMenuScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.menuSelf'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </SelfMenuStack.Navigator>
    );
}

const AvailableRoomStack = createStackNavigator();

function AvailableRoomStackComponent() {
    return (
        <AvailableRoomStack.Navigator
            initialRouteName="available-rooms"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <AvailableRoomStack.Screen
                name="available-rooms"
                component={AvailableRoomScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.availableRooms'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </AvailableRoomStack.Navigator>
    );
}

const BibStack = createStackNavigator();

function BibStackComponent() {
    return (
        <BibStack.Navigator
            initialRouteName="bib"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <BibStack.Screen
                name="bib"
                component={BibScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.bib'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </BibStack.Navigator>
    );
}

const TetrisStack = createStackNavigator();

function TetrisStackComponent() {
    return (
        <TetrisStack.Navigator
            initialRouteName="tetris"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <TetrisStack.Screen
                name="tetris"
                component={TetrisScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t("game.title"),
                        headerLeft: openDrawer
                    };
                }}
            />
        </TetrisStack.Navigator>
    );
}

const LoginStack = createStackNavigator();

function LoginStackComponent() {
    return (
        <LoginStack.Navigator
            initialRouteName="login"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <LoginStack.Screen
                name="login"
                component={LoginScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.login'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </LoginStack.Navigator>
    );
}

const ProfileStack = createStackNavigator();

function ProfileStackComponent() {
    return (
        <ProfileStack.Navigator
            initialRouteName="profile"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <ProfileStack.Screen
                name="profile"
                component={ProfileScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.profile'),
                        headerLeft: openDrawer
                    };
                }}
            />
            <ClubStack.Screen
                name="club-information"
                component={ClubDisplayScreen}
                options={({navigation}) => {
                    return {
                        title: i18n.t('screens.clubDisplayScreen'),
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    };
                }}
            />
        </ProfileStack.Navigator>
    );
}


const VoteStack = createStackNavigator();

function VoteStackComponent() {
    return (
        <VoteStack.Navigator
            initialRouteName="vote"
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <VoteStack.Screen
                name="vote"
                component={VoteScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('screens.vote'),
                        headerLeft: openDrawer
                    };
                }}
            />
        </VoteStack.Navigator>
    );
}

const ClubStack = createStackNavigator();

function ClubStackComponent() {
    return (
        <ClubStack.Navigator
            initialRouteName={"club-list"}
            headerMode="float"
            screenOptions={defaultScreenOptions}
        >
            <ClubStack.Screen
                name="club-list"
                component={ClubListScreen}
                options={({navigation}) => {
                    const openDrawer = getDrawerButton.bind(this, navigation);
                    return {
                        title: i18n.t('clubs.clubList'),
                        headerLeft: openDrawer
                    };
                }}
            />
            <ClubStack.Screen
                name="club-information"
                component={ClubDisplayScreen}
                options={({navigation}) => {
                    return {
                        title: i18n.t('screens.clubDisplayScreen'),
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    };
                }}
            />
            <ClubStack.Screen
                name="club-about"
                component={ClubAboutScreen}
                options={({navigation}) => {
                    return {
                        title: i18n.t('screens.about'),
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    };
                }}
            />
        </ClubStack.Navigator>
    );
}


const Drawer = createDrawerNavigator();

function getDrawerContent(props) {
    return <Sidebar {...props}/>
}

type Props = {
    defaultRoute: string | null,
    defaultData: Object
}


export default class DrawerNavigator extends React.Component<Props> {

    createTabNavigator: Object;

    constructor(props: Object) {
        super(props);

        this.createTabNavigator = () => <TabNavigator defaultRoute={props.defaultRoute} defaultData={props.defaultData}/>
    }

    render() {
        return (
            <Drawer.Navigator
                initialRouteName={'Main'}
                headerMode={'float'}
                backBehavior={'initialRoute'}
                drawerType={'front'}
                drawerContent={(props) => getDrawerContent(props)}
                screenOptions={defaultScreenOptions}
            >
                <Drawer.Screen
                    name="main"
                    component={this.createTabNavigator}
                >
                </Drawer.Screen>
                <Drawer.Screen
                    name="settings"
                    component={SettingsStackComponent}
                />
                <Drawer.Screen
                    name="about"
                    component={AboutStackComponent}
                />
                <Drawer.Screen
                    name="self-menu"
                    component={SelfMenuStackComponent}
                />
                <Drawer.Screen
                    name="available-rooms"
                    component={AvailableRoomStackComponent}
                />
                <Drawer.Screen
                    name="bib"
                    component={BibStackComponent}
                />
                <Drawer.Screen
                    name="tetris"
                    component={TetrisStackComponent}
                />
                <Drawer.Screen
                    name="login"
                    component={LoginStackComponent}
                />
                <Drawer.Screen
                    name="profile"
                    component={ProfileStackComponent}
                />
                <Drawer.Screen
                    name="club-list"
                    component={ClubStackComponent}
                />
                <Drawer.Screen
                    name="vote"
                    component={VoteStackComponent}
                />
            </Drawer.Navigator>
        );
    }
}
