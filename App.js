// @flow

import * as React from 'react';
import {StatusBar, Platform} from 'react-native';
import {Root, StyleProvider} from 'native-base';
import {createAppContainerWithInitialRoute} from './navigation/AppNavigator';
import ThemeManager from './utils/ThemeManager';
import LocaleManager from './utils/LocaleManager';
import * as Font from 'expo-font';
import {clearThemeCache} from 'native-base-shoutem-theme';
import AsyncStorageManager from "./utils/AsyncStorageManager";
import CustomIntroSlider from "./components/CustomIntroSlider";
import {AppLoading} from 'expo';
import NotificationsManager from "./utils/NotificationsManager";

type Props = {};

type State = {
    isLoading: boolean,
    showIntro: boolean,
    showUpdate: boolean,
    currentTheme: ?Object,
};

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
            console.log(ThemeManager.getNightMode());
            if (ThemeManager.getNightMode()) {
                console.log('setting light mode');
                StatusBar.setBarStyle('light-content', true);
            } else {
                console.log('setting dark mode');
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
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.showUpdate4.key, '0');
    }

    async loadAssetsAsync() {
        console.log('Starting loading assets...');
        // Wait for custom fonts to be loaded before showing the app
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            'material-community': require('native-base/Fonts/MaterialCommunityIcons.ttf'),
        });
        await AsyncStorageManager.getInstance().loadPreferences();
        ThemeManager.getInstance().setUpdateThemeCallback(() => this.updateTheme());
        await NotificationsManager.initExpoToken();
        // console.log(AsyncStorageManager.getInstance().preferences.expoToken.current);
    }

    onLoadFinished() {
        // Only show intro if this is the first time starting the app
        console.log('Finished loading');
        this.setState({
            isLoading: false,
            currentTheme: ThemeManager.getCurrentTheme(),
            showIntro: AsyncStorageManager.getInstance().preferences.showIntro.current === '1',
            showUpdate: AsyncStorageManager.getInstance().preferences.showUpdate4.current === '1'
            // showIntro: true
        });
        // Status bar goes dark if set too fast
        setTimeout(this.setupStatusBar,
            1000
        )
    }

    /**
     * Renders the app based on loading state
     */
    render() {
        if (this.state.isLoading) {
            return (
                <AppLoading
                    startAsync={() => this.loadAssetsAsync()}
                    onFinish={() => this.onLoadFinished()}
                    onError={console.warn}
                />
            );
        }
        if (this.state.showIntro || this.state.showUpdate) {
            return <CustomIntroSlider onDone={() => this.onIntroDone()}
                                      isUpdate={this.state.showUpdate && !this.state.showIntro}/>;
        } else {
            const AppNavigator = createAppContainerWithInitialRoute(AsyncStorageManager.getInstance().preferences.defaultStartScreen.current);
            return (
                <Root>
                    <StyleProvider style={this.state.currentTheme}>
                        <AppNavigator/>
                    </StyleProvider>
                </Root>
            );
        }
    }
}
