import React from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import {StyleProvider, Root} from 'native-base';
import AppNavigator from './navigation/AppNavigator';
import ThemeManager from './utils/ThemeManager';
import LocaleManager from './utils/LocaleManager';
import * as Font from 'expo-font';


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
        // this.setState({
        //     currentTheme: ThemeManager.getInstance().getCurrentTheme()
        // });
    }

    render() {
        if (this.state.isLoading) {
            return <View/>;
        }
        console.log('rendering');
        // console.log(this.state.currentTheme.variables.containerBgColor);
        return (
            <StyleProvider style={this.state.currentTheme}>
                <Root>
                    <AppNavigator/>
                </Root>
            </StyleProvider>);
    }
}
