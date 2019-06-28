import React from 'react';
import {StyleProvider, Root, View} from 'native-base';
import AppNavigator from './navigation/AppNavigator';
import ThemeManager from './utils/ThemeManager';
import LocaleManager from './utils/LocaleManager';
import * as Font from 'expo-font';
// edited native-base-shoutem-theme according to
// https://github.com/GeekyAnts/theme/pull/5/files/91f67c55ca6e65fe3af779586b506950c9f331be#diff-4cfc2dd4d5dae7954012899f2268a422
// to allow for dynamic theme switching
import { clearThemeCache } from 'native-base-shoutem-theme';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        LocaleManager.getInstance().initTranslations();
        this.updateTheme = this.updateTheme.bind(this);
        this.state = {
            isLoading: true,
            currentTheme: undefined,
        };
    }

    async componentWillMount() {
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
        ThemeManager.getInstance().setUpdateThemeCallback(this.updateTheme);
        await ThemeManager.getInstance().getDataFromPreferences();
        this.setState({
            isLoading: false,
            currentTheme: ThemeManager.getInstance().getCurrentTheme()
        });
    }

    updateTheme() {
        console.log('update theme called');
        // Change not propagating, need to restart the app
        this.setState({
            currentTheme: ThemeManager.getInstance().getCurrentTheme()
        });
        clearThemeCache();
    }

    render() {
        if (this.state.isLoading) {
            return <View/>;
        }
        console.log('rendering');
        console.log(this.state.currentTheme.variables.containerBgColor);
        return (
            <Root>
                <StyleProvider style={this.state.currentTheme}>

                    <AppNavigator/>

                </StyleProvider>
            </Root>
        );
    }
}
