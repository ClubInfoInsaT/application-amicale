// @flow

import React from 'react';
import {Root, StyleProvider, Text} from 'native-base';
import {Ionicons} from '@expo/vector-icons';
import {StyleSheet, View, Image} from 'react-native'
import AppNavigator from './navigation/AppNavigator';
import ThemeManager from './utils/ThemeManager';
import LocaleManager from './utils/LocaleManager';
import * as Font from 'expo-font';
import {LinearGradient} from 'expo-linear-gradient';
import AppIntroSlider from 'react-native-app-intro-slider';
// edited native-base-shoutem-theme according to
// https://github.com/GeekyAnts/theme/pull/5/files/91f67c55ca6e65fe3af779586b506950c9f331be#diff-4cfc2dd4d5dae7954012899f2268a422
// to allow for dynamic theme switching
import {clearThemeCache} from 'native-base-shoutem-theme';
import AsyncStorageManager from "./utils/AsyncStorageManager";
import CustomMaterialIcon from "./components/CustomMaterialIcon";

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
    image: {
        width: 200,
        height: 200,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 22,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
    },
});

const slides = [
    {
        key: '1',
        title: 'L\'application de l\'Amicale',
        text: 'Toutes les informations du campus de Toulouse',
        image: require('./assets/amicale.png'),
        colors: ['#ff8a6d', '#aa1c0d'],
    },
    {
        key: '2',
        title: 'N\'oubliez plus votre linge',
        text: 'Visualisez les disponibilités des machines et rajoutez des alarmes',
        icon: 'washing-machine',
        colors: ['#9cd6d3', '#3186be'],
    },
    {
        key: '3',
        title: 'Le proximo',
        text: 'Regardez le stock de la supérette de l\'INSA depuis n\'importe où' ,
        icon: 'shopping',
        colors: ['#f9a967', '#da5204'],
    },
    {
        key: '4',
        title: 'Toujours en développement',
        text: 'D\'autres fonctionnalités seront disponibles prochainement',
        icon: 'settings-outline',
        colors: ['#9be238', '#1e6a22'],
    },
];


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
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
        await AsyncStorageManager.getInstance().loadPreferences();
        ThemeManager.getInstance().setUpdateThemeCallback(() => this.updateTheme());
        this.setState({
            isLoading: false,
            currentTheme: ThemeManager.getCurrentTheme(),
            showIntro: AsyncStorageManager.getInstance().preferences.showIntro.current === '1'
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


    getIntroRenderItem(item: Object, dimensions: Object) {
        return (
            <LinearGradient
                style={[
                    styles.mainContent,
                    dimensions,
                ]}
                colors={item.colors}
                start={{x: 0, y: 0.1}}
                end={{x: 0.1, y: 1}}
            >
                {item.image !== undefined ?
                    <Image source={item.image} style={styles.image}/>
                    : <CustomMaterialIcon icon={item.icon} color={'#fff'} fontSize={200} width={200}/>}
                <View style={{marginTop: 20}}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.text}>{item.text}</Text>
                </View>
            </LinearGradient>
        );
    }

    onIntroDone() {
        this.setState({showIntro: false});
        AsyncStorageManager.getInstance().savePref(AsyncStorageManager.getInstance().preferences.showIntro.key, '0');
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
        if (this.state.showIntro) {
            return <AppIntroSlider renderItem={({item, dimensions}) => this.getIntroRenderItem(item, dimensions)}
                                   slides={slides} onDone={() => this.onIntroDone()} bottomButton showSkipButton/>;
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
