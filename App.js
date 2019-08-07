// @flow

import * as React from 'react';
import {Root, StyleProvider, Text} from 'native-base';
import {Image, StyleSheet, View} from 'react-native'
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
import SideBar from "./components/Sidebar";
import SideMenu from "react-native-side-menu";

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

// Content to be used int the intro slides
const slides = [
    {
        key: '1',
        title: 'Bienvenue sur COFFEE',
        text: ' La nouvelle app à consulter pendant la pause café pour être au courant de la vie du campus !',
        image: require('./assets/amicale.png'),
        colors: ['#ff8a6d', '#aa1c0d'],
    },
    {
        key: '2',
        title: 'Restez informés',
        text: 'COFFEE vous permettra bientôt d\'être au courant de tous les événements qui ont lieu sur le campus, de la vente de crêpes jusqu\'aux concerts enfoiros !',
        icon: 'calendar-range',
        colors: ['#9cd6d3', '#3186be'],
    },
    {
        key: '3',
        title: 'N\'oubliez plus votre linge !',
        text: 'COFFEE vous informe de la disponibilité des machines et vous permet d\'être notifiés lorsque la vôtre se termine bientôt !',
        icon: 'washing-machine',
        colors: ['#f9a967', '#da5204'],
    },
    {
        key: '4',
        title: 'Proximo',
        text: 'Il vous manque des pâtes ? Ou un petit creux au gouter, regardez les stocks de votre supérette insaienne en temps réel',
        icon: 'shopping',
        colors: ['#f9a967', '#da5204'],
    },
    {
        key: '5',
        title: 'Planex',
        text: 'Consultez votre emploi du temps sur COFFEE',
        icon: 'timetable',
        colors: ['#f9a967', '#da5204'],
    },
    {
        key: '6',
        title: 'Toujours en développement',
        text: 'D\'autres fonctionnalités arrivent bientôt, n\'hésitez pas à nous donner votre avis pour améliorer l\'appli',
        icon: 'cogs',
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
     * Render item to be used for the intro slides
     * @param item
     * @param dimensions
     */
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

    menu = <View/>;
}
