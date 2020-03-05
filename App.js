// @flow

import * as React from 'react';
import {Platform, StatusBar} from 'react-native';
import {Root, StyleProvider} from 'native-base';
import LocaleManager from './utils/LocaleManager';
import * as Font from 'expo-font';
import {clearThemeCache} from 'native-base-shoutem-theme';
import AsyncStorageManager from "./utils/AsyncStorageManager";
import CustomIntroSlider from "./components/CustomIntroSlider";
import {SplashScreen} from 'expo';
import NotificationsManager from "./utils/NotificationsManager";
import ThemeManager from './utils/ThemeManager';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './navigation/DrawerNavigator';

type Props = {};

type State = {
    isLoading: boolean,
    showIntro: boolean,
    showUpdate: boolean,
    currentTheme: ?Object,
};

const Stack = createStackNavigator();

export default class App extends React.Component<Props, State> {

    state = {
        isLoading: true,
        showIntro: true,
        showUpdate: true,
        currentTheme: null,
    };

    constructor(props: Object) {
        super(props);
        LocaleManager.initTranslations();
    }

    /**
     * Updates the theme and clears the cache to force reloading the app colors. Need to edit shoutem theme for ti to work
     */
    updateTheme() {
        this.setState({
            currentTheme: ThemeManager.getCurrentTheme()
        });
        this.setupStatusBar();
        clearThemeCache();
    }

    setupStatusBar() {
        if (Platform.OS === 'ios') {
            if (ThemeManager.getNightMode()) {
                StatusBar.setBarStyle('light-content', true);
            } else {
                StatusBar.setBarStyle('dark-content', true);
            }
        }
    }

    /**
     * Callback when user ends the intro. Save in preferences to avaoid showing back the introSlides
     */
    onIntroDone() {
        this.setState({
            showIntro: false,
            showUpdate: false,
        });
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.showIntro.key, '0');
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.showUpdate5.key, '0');
    }

    async componentDidMount() {
        await this.loadAssetsAsync();
    }

    async loadAssetsAsync() {
        // Wait for custom fonts to be loaded before showing the app
        console.log("loading Fonts");
        SplashScreen.preventAutoHide();
        await Font.loadAsync({
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
        console.log("loading preferences");
        await AsyncStorageManager.getInstance().loadPreferences();
        ThemeManager.getInstance().setUpdateThemeCallback(() => this.updateTheme());
        console.log("loading Expo token");
        await NotificationsManager.initExpoToken();
        console.log("loaded");
        this.onLoadFinished();
    }

    onLoadFinished() {

        console.log("finished");
        // Only show intro if this is the first time starting the app
        this.setState({
            isLoading: false,
            currentTheme: ThemeManager.getCurrentTheme(),
            showIntro: AsyncStorageManager.getInstance().preferences.showIntro.current === '1',
            showUpdate: AsyncStorageManager.getInstance().preferences.showUpdate5.current === '1'
        });
        // Status bar goes dark if set too fast
        setTimeout(this.setupStatusBar, 1000);
        SplashScreen.hide();
    }

    /**
     * Renders the app based on loading state
     */
    render() {
        console.log("render");
        if (this.state.isLoading) {
            return null;
        } else if (this.state.showIntro || this.state.showUpdate) {
            return <CustomIntroSlider onDone={this.onIntroDone}
                                      isUpdate={this.state.showUpdate && !this.state.showIntro}/>;
        } else {

            return (
                <Root>
                    <StyleProvider style={this.state.currentTheme}>
                        <NavigationContainer>
                            <Stack.Navigator headerMode="none">
                                <Stack.Screen name="Root" component={DrawerNavigator} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </StyleProvider>
                </Root>
            );
        }
    }
}
