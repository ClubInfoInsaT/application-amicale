// @flow

import * as React from 'react';
import SettingsScreen from '../screens/Other/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import DebugScreen from '../screens/About/DebugScreen';
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import i18n from "i18n-js";
import TabNavigator from "./TabNavigator";
import TetrisScreen from "../screens/Tetris/TetrisScreen";
import VoteScreen from "../screens/Amicale/VoteScreen";
import LoginScreen from "../screens/Amicale/LoginScreen";
import {Platform} from "react-native";
import AvailableRoomScreen from "../screens/Websites/AvailableRoomScreen";
import BibScreen from "../screens/Websites/BibScreen";
import SelfMenuScreen from "../screens/Services/SelfMenuScreen";
import ProximoMainScreen from "../screens/Proximo/ProximoMainScreen";
import ProximoListScreen from "../screens/Proximo/ProximoListScreen";
import ProximoAboutScreen from "../screens/Proximo/ProximoAboutScreen";
import {AmicaleWebsiteScreen} from "../screens/Websites/AmicaleWebsiteScreen";
import {ElusEtudiantsWebsiteScreen} from "../screens/Websites/ElusEtudiantsWebsiteScreen";
import {WiketudWebsiteScreen} from "../screens/Websites/WiketudWebsiteScreen";
import {TutorInsaWebsiteScreen} from "../screens/Websites/TutorInsaWebsiteScreen";
import {ENTWebsiteScreen} from "../screens/Websites/ENTWebsiteScreen";
import {BlueMindWebsiteScreen} from "../screens/Websites/BlueMindWebsiteScreen";
import ProfileScreen from "../screens/Amicale/ProfileScreen";
import ClubListScreen from "../screens/Amicale/Clubs/ClubListScreen";
import ClubAboutScreen from "../screens/Amicale/Clubs/ClubAboutScreen";
import ClubDisplayScreen from "../screens/Amicale/Clubs/ClubDisplayScreen";
import {createScreenCollapsibleStack, getWebsiteStack} from "../utils/CollapsibleUtils";

const modalTransition = Platform.OS === 'ios' ? TransitionPresets.ModalPresentationIOS : TransitionPresets.ModalSlideFromBottomIOS;

const screenTransition = TransitionPresets.SlideFromRightIOS;

const defaultScreenOptions = {
    gestureEnabled: true,
    cardOverlayEnabled: true,
    ...screenTransition,
};


const MainStack = createStackNavigator();

function MainStackComponent(props: { createTabNavigator: () => React.Node }) {
    return (
        <MainStack.Navigator
            initialRouteName={'main'}
            headerMode={'screen'}
            screenOptions={defaultScreenOptions}
        >
            <MainStack.Screen
                name="main"
                component={props.createTabNavigator}
                options={{
                    headerShown: false,
                }}
            />
            <MainStack.Screen
                name="settings"
                component={SettingsScreen}
                options={{
                    title: i18n.t('screens.settings'),
                }}
            />
            <MainStack.Screen
                name="about"
                component={AboutScreen}
                options={{
                    title: i18n.t('screens.about'),
                }}
            />
            <MainStack.Screen
                name="dependencies"
                component={AboutDependenciesScreen}
                options={{
                    title: i18n.t('aboutScreen.libs')
                }}
            />
            <MainStack.Screen
                name="debug"
                component={DebugScreen}
                options={{
                    title: i18n.t('aboutScreen.debug')
                }}
            />
            <MainStack.Screen
                name="tetris"
                component={TetrisScreen}
                options={{
                    title: i18n.t("game.title"),
                }}
            />
            <MainStack.Screen
                name="login"
                component={LoginScreen}
                options={{
                    title: i18n.t('screens.login'),
                }}
            />

            {/*     INSA        */}
            {getWebsiteStack("available-rooms", MainStack, AvailableRoomScreen, i18n.t('screens.availableRooms'))}
            {getWebsiteStack("bib", MainStack, BibScreen, i18n.t('screens.bib'))}
            {createScreenCollapsibleStack("self-menu", MainStack, SelfMenuScreen, i18n.t('screens.menuSelf'))}

            {/*     STUDENTS     */}
            {createScreenCollapsibleStack("proximo", MainStack, ProximoMainScreen, i18n.t('screens.proximo'))}
            {createScreenCollapsibleStack(
                "proximo-list",
                MainStack,
                ProximoListScreen,
                i18n.t('screens.proximoArticles'),
                true,
                {...screenTransition},
            )}
            <MainStack.Screen
                name="proximo-about"
                component={ProximoAboutScreen}
                options={{
                    title: i18n.t('screens.proximo'),
                    ...modalTransition,
                }}
            />
            {getWebsiteStack("amicale-website", MainStack, AmicaleWebsiteScreen, i18n.t('screens.amicaleWebsite'))}
            {getWebsiteStack("elus-etudiants", MainStack, ElusEtudiantsWebsiteScreen, "Élus Étudiants")}
            {getWebsiteStack("wiketud", MainStack, WiketudWebsiteScreen, "Wiketud")}
            {getWebsiteStack("tutorinsa", MainStack, TutorInsaWebsiteScreen, "Tutor'INSA")}
            {getWebsiteStack("ent", MainStack, ENTWebsiteScreen, i18n.t('screens.ent'))}
            {getWebsiteStack("bluemind", MainStack, BlueMindWebsiteScreen, i18n.t('screens.bluemind'))}


            {/*     AMICALE     */}
            {createScreenCollapsibleStack("profile", MainStack, ProfileScreen, i18n.t('screens.profile'))}
            {createScreenCollapsibleStack("club-list", MainStack, ClubListScreen, i18n.t('clubs.clubList'))}
            <MainStack.Screen
                name="club-information"
                component={ClubDisplayScreen}
                options={{
                    title: i18n.t('screens.clubDisplayScreen'),
                    ...modalTransition,
                }}
            />
            <MainStack.Screen
                name="club-about"
                component={ClubAboutScreen}
                options={{
                    title: i18n.t('screens.clubsAbout'),
                    ...modalTransition,
                }}
            />
            <MainStack.Screen
                name="vote"
                component={VoteScreen}
                options={{
                    title: i18n.t('screens.vote'),
                }}
            />
        </MainStack.Navigator>
    );
}

type Props = {
    defaultHomeRoute: string | null,
    defaultHomeData: { [key: string]: any }
}

export default class MainNavigator extends React.Component<Props> {

    createTabNavigator: () => React.Node;

    constructor(props: Props) {
        super(props);
        this.createTabNavigator = () => <TabNavigator {...props}/>
    }

    render() {
        return (
            <MainStackComponent createTabNavigator={this.createTabNavigator}/>
        );
    }
}
