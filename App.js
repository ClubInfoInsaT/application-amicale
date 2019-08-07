// @flow

import * as React from 'react';
import {Root, StyleProvider} from 'native-base';
import {View} from 'react-native'
import AppNavigator from './navigation/AppNavigator';
import ThemeManager from './utils/ThemeManager';
import LocaleManager from './utils/LocaleManager';
import * as Font from 'expo-font';
// edited native-base-shoutem-theme according to
// https://github.com/GeekyAnts/theme/pull/5/files/91f67c55ca6e65fe3af779586b506950c9f331be#diff-4cfc2dd4d5dae7954012899f2268a422
// to allow for dynamic theme switching
import {clearThemeCache} from 'native-base-shoutem-theme';
import AsyncStorageManager from "./utils/AsyncStorageManager";
import CustomIntroSlider from "./components/CustomIntroSlider";

type Props = {};

type State = {
    isLoading: boolean,
    showIntro: boolean,
    currentTheme: ?Object,
};

export default class App extends React.Component<Props, State> {

    state = {
        isLoading: true,
        showIntro: true,
        currentTheme: null,
    };

    constructor(props: Object) {
        super(props);
        LocaleManager.initTranslations();
    }

    /**
     * Loads FetchedData before components are mounted, like fonts and themes
     * @returns {Promise}
     */
    async componentWillMount() {
        // Wait for custom fonts to be loaded before showing the app
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
        await AsyncStorageManager.getInstance().loadPreferences();
        ThemeManager.getInstance().setUpdateThemeCallback(() => this.updateTheme());
        // Only show intro if this is the first time starting the app
        this.setState({
            isLoading: false,
            currentTheme: ThemeManager.getCurrentTheme(),
            // showIntro: AsyncStorageManager.getInstance().preferences.showIntro.current === '1'
            showIntro: true
        });
    }

    /**
     * Updates the theme and clears the cache to force reloading the app colors. Need to edit shoutem theme for ti to work
     */
    updateTheme() {
        this.setState({
            currentTheme: ThemeManager.getCurrentTheme()
        });
        clearThemeCache();
    }

    /**
     * Callback when user ends the intro. Save in preferences to avaoid showing back the slides
     */
    onIntroDone() {
        this.setState({showIntro: false});
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.showIntro.key, '0');
    }

    /**
     * Renders the app based on loading state
     */
    render() {
        if (this.state.isLoading) {
            return <View/>;
        }
        if (this.state.showIntro) {
            return <CustomIntroSlider onDone={() => this.onIntroDone()}/>;
        } else {
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
