// @flow

import * as React from 'react';
import ThemeManager from "../../utils/ThemeManager";
import WebViewScreen from "../../components/WebViewScreen";
import {Avatar, Banner} from "react-native-paper";
import i18n from "i18n-js";
import {View} from "react-native";
import AsyncStorageManager from "../../utils/AsyncStorageManager";

type Props = {
    navigation: Object,
}

type State = {
    bannerVisible: boolean,
}


const PLANEX_URL = 'http://planex.insa-toulouse.fr/';

const CUSTOM_CSS_GENERAL = 'https://etud.insa-toulouse.fr/~amicale_app/custom_css/planex/customMobile3.css';
const CUSTOM_CSS_NIGHTMODE = 'https://etud.insa-toulouse.fr/~amicale_app/custom_css/planex/customDark2.css';

// // JS + JQuery functions used to remove alpha from events. Copy paste in browser console for quick testing
// // Remove alpha from given Jquery node
// function removeAlpha(node) {
//     let bg = node.css("background-color");
//     if (bg.match("^rgba")) {
//         let a = bg.slice(5).split(',');
//         // Fix for tooltips with broken background
//         if (parseInt(a[0]) === parseInt(a[1]) && parseInt(a[1]) === parseInt(a[2]) && parseInt(a[2]) === 0) {
//             a[0] = a[1] = a[2] = '255';
//         }
//         let newBg ='rgb(' + a[0] + ',' + a[1] + ',' + a[2] + ')';
//         node.css("background-color", newBg);
//     }
// }
// // Observe for planning DOM changes
// let observer = new MutationObserver(function(mutations) {
//     for (let i = 0; i < mutations.length; i++) {
//         if (mutations[i]['addedNodes'].length > 0 &&
//             ($(mutations[i]['addedNodes'][0]).hasClass("fc-event") || $(mutations[i]['addedNodes'][0]).hasClass("tooltiptopicevent")))
//             removeAlpha($(mutations[i]['addedNodes'][0]))
//     }
// });
// // observer.observe(document.querySelector(".fc-body"), {attributes: false, childList: true, characterData: false, subtree:true});
// observer.observe(document.querySelector("body"), {attributes: false, childList: true, characterData: false, subtree:true});
// // Run remove alpha a first time on whole planning. Useful when code injected after planning fully loaded.
// $(".fc-event-container .fc-event").each(function(index) {
//     removeAlpha($(this));
// });

// Watch for changes in the calendar and call the remove alpha function
const OBSERVE_MUTATIONS_INJECTED =
    'function removeAlpha(node) {\n' +
    '    let bg = node.css("background-color");\n' +
    '    if (bg.match("^rgba")) {\n' +
    '        let a = bg.slice(5).split(\',\');\n' +
    '        // Fix for tooltips with broken background\n' +
    '        if (parseInt(a[0]) === parseInt(a[1]) && parseInt(a[1]) === parseInt(a[2]) && parseInt(a[2]) === 0) {\n' +
    '            a[0] = a[1] = a[2] = \'255\';\n' +
    '        }\n' +
    '        let newBg =\'rgb(\' + a[0] + \',\' + a[1] + \',\' + a[2] + \')\';\n' +
    '        node.css("background-color", newBg);\n' +
    '    }\n' +
    '}\n' +
    '// Observe for planning DOM changes\n' +
    'let observer = new MutationObserver(function(mutations) {\n' +
    '    for (let i = 0; i < mutations.length; i++) {\n' +
    '        if (mutations[i][\'addedNodes\'].length > 0 &&\n' +
    '            ($(mutations[i][\'addedNodes\'][0]).hasClass("fc-event") || $(mutations[i][\'addedNodes\'][0]).hasClass("tooltiptopicevent")))\n' +
    '            removeAlpha($(mutations[i][\'addedNodes\'][0]))\n' +
    '    }\n' +
    '});\n' +
    '// observer.observe(document.querySelector(".fc-body"), {attributes: false, childList: true, characterData: false, subtree:true});\n' +
    'observer.observe(document.querySelector("body"), {attributes: false, childList: true, characterData: false, subtree:true});\n' +
    '// Run remove alpha a first time on whole planning. Useful when code injected after planning fully loaded.\n' +
    '$(".fc-event-container .fc-event").each(function(index) {\n' +
    '    removeAlpha($(this));\n' +
    '});';
/**
 * Class defining the app's Planex screen.
 * This screen uses a webview to render the page
 */
export default class PlanexScreen extends React.Component<Props, State> {

    customInjectedJS: string;
    onHideBanner: Function;
    onGoToSettings: Function;
    state = {
        bannerVisible:
            AsyncStorageManager.getInstance().preferences.planexShowBanner.current === '1' &&
            AsyncStorageManager.getInstance().preferences.defaultStartScreen.current !== 'Planex',
    };

    /**
     * Defines custom injected JavaScript to improve the page display on mobile
     */
    constructor() {
        super();
        this.customInjectedJS =
            '$(document).ready(function() {' +
            OBSERVE_MUTATIONS_INJECTED +
            '$("head").append(\'<meta name="viewport" content="width=device-width, initial-scale=0.9">\');' +
            '$("head").append(\'<link rel="stylesheet" href="' + CUSTOM_CSS_GENERAL + '" type="text/css"/>\');';

        if (ThemeManager.getNightMode())
            this.customInjectedJS += '$("head").append(\'<link rel="stylesheet" href="' + CUSTOM_CSS_NIGHTMODE + '" type="text/css"/>\');';

        this.customInjectedJS +=
            'removeAlpha();' +
            '});true;'; // Prevents crash on ios
        this.onHideBanner = this.onHideBanner.bind(this);
        this.onGoToSettings = this.onGoToSettings.bind(this);
    }

    /**
     * Callback used when closing the banner.
     * This hides the banner and saves to preferences to prevent it from reopening
     */
    onHideBanner() {
        this.setState({bannerVisible: false});
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.planexShowBanner.key,
            '0'
        );
    }

    /**
     * Callback used when the used click on the navigate to settings button.
     * This will hide the banner and open the SettingsScreen
     *
     */
    onGoToSettings() {
        this.onHideBanner();
        this.props.navigation.navigate('SettingsScreen');
    }

    render() {
        const nav = this.props.navigation;
        return (
            <View style={{
                height: '100%'
            }}>
                <Banner
                    visible={this.state.bannerVisible}
                    actions={[
                        {
                            label: i18n.t('planexScreen.enableStartOK'),
                            onPress: this.onGoToSettings,
                        },
                        {
                            label: i18n.t('planexScreen.enableStartCancel'),
                            onPress: this.onHideBanner,
                        },

                    ]}
                    icon={() => <Avatar.Icon
                        icon={'information'}
                        size={40}
                    />}
                >
                    {i18n.t('planexScreen.enableStartScreen')}
                </Banner>
                <WebViewScreen
                    navigation={nav}
                    data={[
                        {
                            url: PLANEX_URL,
                            icon: '',
                            name: '',
                            customJS: this.customInjectedJS
                        },
                    ]}
                    customInjectedJS={this.customInjectedJS}
                    headerTitle={'Planex'}
                    hasHeaderBackButton={false}
                    hasFooter={false}/>
            </View>
        );
    }
}

