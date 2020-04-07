// @flow

import * as React from 'react';
import {Platform, StatusBar} from 'react-native';
import LocaleManager from './src/managers/LocaleManager';
import AsyncStorageManager from "./src/managers/AsyncStorageManager";
import CustomIntroSlider from "./src/components/Custom/CustomIntroSlider";
import {Linking, SplashScreen} from 'expo';
import ThemeManager from './src/managers/ThemeManager';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import {initExpoToken} from "./src/utils/Notifications";
import {Provider as PaperProvider} from 'react-native-paper';
import AprilFoolsManager from "./src/managers/AprilFoolsManager";
import Update from "./src/constants/Update";
import ConnectionManager from "./src/managers/ConnectionManager";

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

    onIntroDone: Function;
    onUpdateTheme: Function;

    navigatorRef: Object;

    defaultRoute: Array<string>;
    defaultData: Object;

    createDrawerNavigator: Function;

    constructor() {
        super();
        LocaleManager.initTranslations();
        this.onIntroDone = this.onIntroDone.bind(this);
        this.onUpdateTheme = this.onUpdateTheme.bind(this);
        SplashScreen.preventAutoHide();
        this.navigatorRef = React.createRef();
        this.defaultRoute = [];
        this.defaultData = {};
        // this.defaultRoute = ["main", "home", "club-information"];
        // this.defaultData = {clubId: 0};
        this.handleUrls();
    }

    handleUrls() {
        console.log(Linking.makeUrl('main/home/club-information', {clubId: 1}));
        Linking.addEventListener('url', this.onUrl);
        Linking.parseInitialURLAsync().then(this.onParsedUrl);
    }

    onUrl = (url: string) => {
        this.onParsedUrl(Linking.parse(url));
    };

    onParsedUrl = ({path, queryParams}: Object) => {
        if (path !== null) {
            let pathArray = path.split('/');
            if (this.isClubInformationLink(pathArray))
                this.handleClubInformationUrl(queryParams);
            else if (this.isPlanningInformationLink(pathArray))
                this.handlePlanningInformationUrl(queryParams);
        }
    };

    isClubInformationLink(pathArray: Array<string>) {
        return pathArray[0] === "main" && pathArray[1] === "home" && pathArray[2] === "club-information";
    }

    isPlanningInformationLink(pathArray: Array<string>) {
        return pathArray[0] === "main" && pathArray[1] === "home" && pathArray[2] === "planning-information";
    }

    handleClubInformationUrl(params: Object) {
        if (params !== undefined && params.clubId !== undefined) {
            let id = parseInt(params.clubId);
            if (!isNaN(id)) {
                this.defaultRoute = ["main", "home", "club-information"];
                this.defaultData = {clubId: id};
            }
        }
    }

    handlePlanningInformationUrl(params: Object) {
        if (params !== undefined && params.eventId !== undefined) {
            let id = parseInt(params.eventId);
            if (!isNaN(id)) {
                this.defaultRoute = ["main", "home", "planning-information"];
                this.defaultData = {eventId: id};
            }
        }
    }

    /**
     * Updates the theme
     */
    onUpdateTheme() {
        this.setState({
            currentTheme: ThemeManager.getCurrentTheme()
        });
        this.setupStatusBar();
    }

    setupStatusBar() {
        if (ThemeManager.getNightMode()) {
            StatusBar.setBarStyle('light-content', true);
        } else {
            StatusBar.setBarStyle('dark-content', true);
        }
    }

    /**
     * Callback when user ends the intro. Save in preferences to avaoid showing back the introSlides
     */
    onIntroDone() {
        this.setState({
            showIntro: false,
            showUpdate: false,
            showAprilFools: false,
        });
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.showIntro.key, '0');
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.updateNumber.key, Update.number.toString());
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.showAprilFoolsStart.key, '0');
    }

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

        this.createDrawerNavigator = () => <DrawerNavigator defaultPath={this.defaultRoute} defaultData={this.defaultData}/>;
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
