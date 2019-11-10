// @flow

import * as React from 'react';
import ThemeManager from "../utils/ThemeManager";
import WebViewScreen from "../components/WebViewScreen";
import i18n from "i18n-js";

type Props = {
    navigation: Object,
}


const PLANEX_URL = 'http://planex.insa-toulouse.fr/';

const CUSTOM_CSS_GENERAL = 'https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/custom_css/planex/customMobile2.css';
const CUSTOM_CSS_NIGHTMODE = 'https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/custom_css/planex/customDark2.css';

// Remove transparency to planex items to prevent invisible items
const REMOVE_ALPHA_FUNCTION_INJECTED =
    'function removeAlpha() {' +
    '   $(".fc-event-container .fc-event").each(function(index) {' +
    '       let bg = $(this).css("background-color");' +
    '       if (bg.match("^rgba")) {' +
    '           let a = bg.slice(5).split(\',\');' +
    '           let newBg = \'rgb(\' + a[0] + \',\' + parseInt(a[1]) + \',\' + parseInt(a[2]) + \')\';' +
    '           $(this).css("background-color", newBg);' +
    '       };' +
    '   });' +
    '}';

// Watch for changes in the calendar and call the remove alpha function
const OBSERVE_MUTATIONS_INJECTED =
    'let observer = new MutationObserver(function(mutations) {' +
    '   removeAlpha();' +
    '});' +
    'observer.observe(document.querySelector(".fc-body"), {attributes: false, childList: true, characterData: false, subtree:true});';


/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class PlanexScreen extends React.Component<Props> {

    customInjectedJS: string;

    constructor() {
        super();
        this.customInjectedJS =
            '$(document).ready(function() {' +
            REMOVE_ALPHA_FUNCTION_INJECTED +
            OBSERVE_MUTATIONS_INJECTED +
            '$("head").append(\'<meta name="viewport" content="width=device-width, initial-scale=1.0">\');' +
            '$("head").append(\'<link rel="stylesheet" href="' + CUSTOM_CSS_GENERAL + '" type="text/css"/>\');';

        if (ThemeManager.getNightMode())
            this.customInjectedJS += '$("head").append(\'<link rel="stylesheet" href="' + CUSTOM_CSS_NIGHTMODE + '" type="text/css"/>\');';

        this.customInjectedJS +=
            '$(".fc-toolbar .fc-center").append(\'<p id="rotateToLandscape">' + i18n.t("planexScreen.rotateToLandscape") + '</p>\');' +
            '$(".fc-toolbar .fc-center").append(\'<p id="rotateToPortrait">' + i18n.t("planexScreen.rotateToPortrait") + '</p>\');' +
            'removeAlpha();' +
            '});true;'; // Prevent crash on ios

    }

    render() {
        const nav = this.props.navigation;
        return (
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
        );
    }
}

