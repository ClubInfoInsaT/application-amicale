// @flow

import * as React from 'react';
import {Platform, StatusBar, YellowBox} from 'react-native';
import LocaleManager from './src/managers/LocaleManager';
import AsyncStorageManager from "./src/managers/AsyncStorageManager";
import CustomIntroSlider from "./src/components/Overrides/CustomIntroSlider";
import {AppLoading} from 'expo';
import type {CustomTheme} from "./src/managers/ThemeManager";
import ThemeManager from './src/managers/ThemeManager';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import {initExpoToken} from "./src/utils/Notifications";
import {Provider as PaperProvider} from 'react-native-paper';
import AprilFoolsManager from "./src/managers/AprilFoolsManager";
import Update from "./src/constants/Update";
import ConnectionManager from "./src/managers/ConnectionManager";
import URLHandler from "./src/utils/URLHandler";
import {setSafeBounceHeight} from "react-navigation-collapsible";
import {enableScreens} from 'react-native-screens';
import {View} from "react-native-animatable";

// Native optimizations https://reactnavigation.org/docs/react-native-screens
enableScreens();


YellowBox.ignoreWarnings([ // collapsible headers cause this warning, just ignore as it is not an issue
    'Non-serializable values were found in the navigation state',
]);

type Props = {};

type State = {
    isLoading: boolean,
    showIntro: boolean,
    showUpdate: boolean,
    showAprilFools: boolean,
    currentTheme: CustomTheme | null,
};

export default class App extends React.Component<Props, State> {

    state = {
        isLoading: true,
        showIntro: true,
        showUpdate: true,
        showAprilFools: false,
        currentTheme: null,
    };

    navigatorRef: { current: null | NavigationContainer };

    defaultHomeRoute: string | null;
    defaultHomeData: { [key: string]: any }

    createDrawerNavigator: () => React.Node;

    urlHandler: URLHandler;
    storageManager: AsyncStorageManager;

    constructor() {
        super();
        LocaleManager.initTranslations();
        // SplashScreen.preventAutoHide();
        this.navigatorRef = React.createRef();
        this.defaultHomeRoute = null;
        this.defaultHomeData = {};
        this.storageManager = AsyncStorageManager.getInstance();
        this.urlHandler = new URLHandler(this.onInitialURLParsed, this.onDetectURL);
        this.urlHandler.listen();
        setSafeBounceHeight(Platform.OS === 'ios' ? 100 : 20);
        this.loadAssetsAsync().then(() => {
            this.onLoadFinished();
        });
    }

    /**
     * THe app has been started by an url, and it has been parsed.
     * Set a new default start route based on the data parsed.
     *
     * @param parsedData The data parsed from the url
     */
    onInitialURLParsed = (parsedData: { route: string, data: { [key: string]: any } }) => {
        this.defaultHomeRoute = parsedData.route;
        this.defaultHomeData = parsedData.data;
    };

    /**
     * An url has been opened and parsed while the app was active.
     * Redirect the user to the screen according to parsed data.
     *
     * @param parsedData The data parsed from the url
     */
    onDetectURL = (parsedData: { route: string, data: { [key: string]: any } }) => {
        // Navigate to nested navigator and pass data to the index screen
        if (this.navigatorRef.current != null) {
            this.navigatorRef.current.navigate('home', {
                screen: 'index',
                params: {nextScreen: parsedData.route, data: parsedData.data}
            });
        }
    };

    /**
     * Updates the current theme
     */
    onUpdateTheme = () => {
        this.setState({
            currentTheme: ThemeManager.getCurrentTheme()
        });
        this.setupStatusBar();
    };

    /**
     * Updates status bar content color if on iOS only,
     * as the android status bar is always set to black.
     */
    setupStatusBar() {
        if (ThemeManager.getNightMode()) {
            StatusBar.setBarStyle('light-content', true);
        } else {
            StatusBar.setBarStyle('dark-content', true);
        }
        StatusBar.setBackgroundColor(ThemeManager.getCurrentTheme().colors.surface, true);
    }

    /**
     * Callback when user ends the intro. Save in preferences to avoid showing back the introSlides
     */
    onIntroDone = () => {
        this.setState({
            showIntro: false,
            showUpdate: false,
            showAprilFools: false,
        });
        this.storageManager.savePref(this.storageManager.preferences.showIntro.key, '0');
        this.storageManager.savePref(this.storageManager.preferences.updateNumber.key, Update.number.toString());
        this.storageManager.savePref(this.storageManager.preferences.showAprilFoolsStart.key, '0');
    };

    /**
     * Loads every async data
     *
     * @returns {Promise<void>}
     */
    loadAssetsAsync = async () => {
        await this.storageManager.loadPreferences();
        await initExpoToken();
        try {
            await ConnectionManager.getInstance().recoverLogin();
        } catch (e) {
        }
    }

    /**
     * Async loading is done, finish processing startup data
     */
    onLoadFinished() {
        // Only show intro if this is the first time starting the app
        this.createDrawerNavigator = () => <MainNavigator
            defaultHomeRoute={this.defaultHomeRoute}
            defaultHomeData={this.defaultHomeData}
        />;
        ThemeManager.getInstance().setUpdateThemeCallback(this.onUpdateTheme);
        // Status bar goes dark if set too fast on ios
        if (Platform.OS === 'ios')
            setTimeout(this.setupStatusBar, 1000);
        else
            this.setupStatusBar();
        this.setState({
            isLoading: false,
            currentTheme: ThemeManager.getCurrentTheme(),
            showIntro: this.storageManager.preferences.showIntro.current === '1',
            showUpdate: this.storageManager.preferences.updateNumber.current !== Update.number.toString(),
            showAprilFools: AprilFoolsManager.getInstance().isAprilFoolsEnabled() && this.storageManager.preferences.showAprilFoolsStart.current === '1',
        });
    }

    /**
     * Renders the app based on loading state
     */
    render() {
        if (this.state.isLoading) {
            return <AppLoading/>;
        } else if (this.state.showIntro || this.state.showUpdate || this.state.showAprilFools) {
            return <CustomIntroSlider
                onDone={this.onIntroDone}
                isUpdate={this.state.showUpdate && !this.state.showIntro}
                isAprilFools={this.state.showAprilFools && !this.state.showIntro}
            />;
        } else {
            return (
                <PaperProvider theme={this.state.currentTheme}>
                    <View style={{backgroundColor: ThemeManager.getCurrentTheme().colors.background, flex: 1}}>
                        <NavigationContainer theme={this.state.currentTheme} ref={this.navigatorRef}>
                            <MainNavigator
                                defaultHomeRoute={this.defaultHomeRoute}
                                defaultHomeData={this.defaultHomeData}
                            />
                        </NavigationContainer>
                    </View>
                </PaperProvider>
            );
        }
    }
}
