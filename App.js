// @flow

import * as React from 'react';
import {Platform, StatusBar, YellowBox} from 'react-native';
import LocaleManager from './src/managers/LocaleManager';
import AsyncStorageManager from "./src/managers/AsyncStorageManager";
import CustomIntroSlider from "./src/components/Custom/CustomIntroSlider";
import {SplashScreen} from 'expo';
import ThemeManager from './src/managers/ThemeManager';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import {initExpoToken} from "./src/utils/Notifications";
import {Provider as PaperProvider} from 'react-native-paper';
import AprilFoolsManager from "./src/managers/AprilFoolsManager";
import Update from "./src/constants/Update";
import ConnectionManager from "./src/managers/ConnectionManager";
import URLHandler from "./src/utils/URLHandler";
import {setSafeBounceHeight} from "react-navigation-collapsible";

YellowBox.ignoreWarnings([ // collapsible headers cause this warning, just ignore as it is not an issue
    'Non-serializable values were found in the navigation state',
]);

type Props = {};

type State = {
    isLoading: boolean,
    showIntro: boolean,
    showUpdate: boolean,
    showAprilFools: boolean,
    currentTheme: ?Object,
};

const Stack = createStackNavigator();

export default class App extends React.Component<Props, State> {

    state = {
        isLoading: true,
        showIntro: true,
        showUpdate: true,
        showAprilFools: false,
        currentTheme: null,
    };

    navigatorRef: Object;

    defaultRoute: string | null;
    defaultData: Object;

    createDrawerNavigator: Function;

    urlHandler: URLHandler;

    constructor() {
        super();
        LocaleManager.initTranslations();
        SplashScreen.preventAutoHide();
        this.navigatorRef = React.createRef();
        this.defaultRoute = null;
        this.defaultData = {};
        this.urlHandler = new URLHandler(this.onInitialURLParsed, this.onDetectURL);
        this.urlHandler.listen();
        setSafeBounceHeight(Platform.OS === 'ios' ? 100 : 0);
    }

    onInitialURLParsed = ({route, data}: Object) => {
        this.defaultRoute = route;
        this.defaultData = data;
    };

    onDetectURL = ({route, data}: Object) => {
        // Navigate to nested navigator and pass data to the index screen
        this.navigatorRef.current.navigate('home', {
            screen: 'index',
            params: {nextScreen: route, data: data}
        });
    };

    /**
     * Updates the theme
     */
    onUpdateTheme = () => {
        this.setState({
            currentTheme: ThemeManager.getCurrentTheme()
        });
        this.setupStatusBar();
    };

    setupStatusBar() {
        if (ThemeManager.getNightMode()) {
            StatusBar.setBarStyle('light-content', true);
        } else {
            StatusBar.setBarStyle('dark-content', true);
        }
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor(ThemeManager.getCurrentTheme().colors.surface);
    }

    /**
     * Callback when user ends the intro. Save in preferences to avaoid showing back the introSlides
     */
    onIntroDone = () => {
        this.setState({
            showIntro: false,
            showUpdate: false,
            showAprilFools: false,
        });
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.showIntro.key, '0');
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.updateNumber.key, Update.number.toString());
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.showAprilFoolsStart.key, '0');
    };

    async componentDidMount() {
        await this.loadAssetsAsync();
    }

    async loadAssetsAsync() {
        // Wait for custom fonts to be loaded before showing the app
        await AsyncStorageManager.getInstance().loadPreferences();
        ThemeManager.getInstance().setUpdateThemeCallback(this.onUpdateTheme);
        await initExpoToken();
        try {
            await ConnectionManager.getInstance().recoverLogin();
        } catch (e) {
        }

        this.createDrawerNavigator = () => <DrawerNavigator defaultRoute={this.defaultRoute}
                                                            defaultData={this.defaultData}/>;
        this.onLoadFinished();
    }

    onLoadFinished() {
        // console.log("finished");
        // Only show intro if this is the first time starting the app
        this.setState({
            isLoading: false,
            currentTheme: ThemeManager.getCurrentTheme(),
            showIntro: AsyncStorageManager.getInstance().preferences.showIntro.current === '1',
            showUpdate: AsyncStorageManager.getInstance().preferences.updateNumber.current !== Update.number.toString(),
            showAprilFools: AprilFoolsManager.getInstance().isAprilFoolsEnabled() && AsyncStorageManager.getInstance().preferences.showAprilFoolsStart.current === '1',
        });
        // Status bar goes dark if set too fast on ios
        if (Platform.OS === 'ios')
            setTimeout(this.setupStatusBar, 1000);
        else
            this.setupStatusBar();
        SplashScreen.hide();
    }

    /**
     * Renders the app based on loading state
     */
    render() {
        if (this.state.isLoading) {
            return null;
        } else if (this.state.showIntro || this.state.showUpdate || this.state.showAprilFools) {
            return <CustomIntroSlider
                onDone={this.onIntroDone}
                isUpdate={this.state.showUpdate && !this.state.showIntro}
                isAprilFools={this.state.showAprilFools && !this.state.showIntro}
            />;
        } else {
            return (
                <PaperProvider theme={this.state.currentTheme}>
                    <NavigationContainer theme={this.state.currentTheme} ref={this.navigatorRef}>
                        <Stack.Navigator headerMode="none">
                            <Stack.Screen name="Root" component={this.createDrawerNavigator}/>
                        </Stack.Navigator>
                    </NavigationContainer>
                </PaperProvider>
            );
        }
    }
}
