// @flow

import * as React from 'react';
import SettingsScreen from '../screens/Other/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';
import DebugScreen from '../screens/About/DebugScreen';
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import i18n from "i18n-js";
import TabNavigator from "./MainTabNavigator";

const defaultScreenOptions = {
    gestureEnabled: true,
    cardOverlayEnabled: true,
    ...TransitionPresets.SlideFromRightIOS,
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
        </MainStack.Navigator>
    );
}

type Props = {
    defaultHomeRoute: string | null,
    defaultHomeData: { [key: string]: any }
}

export default class DrawerNavigator extends React.Component<Props> {

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
