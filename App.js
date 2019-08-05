// @flow

import React from 'react';
import {StyleProvider, Root, View} from 'native-base';
import AppNavigator from './navigation/AppNavigator';
import ThemeManager from './utils/ThemeManager';
import LocaleManager from './utils/LocaleManager';
import * as Font from 'expo-font';
// edited native-base-shoutem-theme according to
// https://github.com/GeekyAnts/theme/pull/5/files/91f67c55ca6e65fe3af779586b506950c9f331be#diff-4cfc2dd4d5dae7954012899f2268a422
// to allow for dynamic theme switching
import {clearThemeCache} from 'native-base-shoutem-theme';
import AsyncStorageManager from "./utils/AsyncStorageManager";

type Props = {};

type State = {
    isLoading: boolean,
    currentTheme: ?Object,
};

export default class App extends React.Component<Props, State> {

    state = {
        isLoading: true,
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
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
        await AsyncStorageManager.getInstance().loadPreferences();
        ThemeManager.getInstance().setUpdateThemeCallback(() => this.updateTheme());
        this.setState({
            isLoading: false,
            currentTheme: ThemeManager.getCurrentTheme()
        });
    }

    /**
     * Updates the theme and clears the cache to force reloading the app colors
     */
    updateTheme() {
        // console.log('update theme called');
        this.setState({
            currentTheme: ThemeManager.getCurrentTheme()
        });
        clearThemeCache();
    }

    /**
     * Renders the app based on loading state
     *
     * @returns {*}
     */
    render() {
        if (this.state.isLoading) {
            return <View/>;
        }
        // console.log('rendering');
        // console.log(this.state.currentTheme.variables.containerBgColor);
        return (
            <Root>
                <StyleProvider style={this.state.currentTheme}>

                    <AppNavigator/>

                </StyleProvider>
            </Root>
        );
    }
}
