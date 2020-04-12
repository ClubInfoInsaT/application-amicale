// @flow

import * as React from 'react';
import WebViewScreen from "../../components/Screens/WebViewScreen";

type Props = {
    navigation: Object,
}

const BIB_URL = 'https://bibbox.insa-toulouse.fr/';
const CUSTOM_CSS_GENERAL = 'https://etud.insa-toulouse.fr/~amicale_app/custom_css/rooms/customMobile.css';
const CUSTOM_CSS_Bib = 'https://etud.insa-toulouse.fr/~amicale_app/custom_css/rooms/customBibMobile.css';

/**
 * Class defining the app's Bib screen.
 * This screen uses a webview to render the page
 */
export default class AvailableRoomScreen extends React.Component<Props> {

    customInjectedJS: string;
    customBibInjectedJS: string;

    /**
     * Defines custom injected JavaScript to improve the page display on mobile
     */
    constructor() {
        super();
        this.customInjectedJS =
            'document.querySelector(\'head\').innerHTML += \'<meta name="viewport" content="width=device-width, initial-scale=1.0">\';' +
            'document.querySelector(\'head\').innerHTML += \'<link rel="stylesheet" href="' + CUSTOM_CSS_GENERAL + '" type="text/css"/>\';' +
            'let header = $(".table tbody tr:first");' +
            '$("table").prepend("<thead></thead>");true;' + // Fix for crash on ios
            '$("thead").append(header);true;';

        this.customBibInjectedJS =
            'document.querySelector(\'head\').innerHTML += \'<meta name="viewport" content="width=device-width, initial-scale=1.0">\';' +
            'document.querySelector(\'head\').innerHTML += \'<link rel="stylesheet" href="' + CUSTOM_CSS_Bib + '" type="text/css"/>\';' +
            'if ($(".hero-unit-form").length > 0 && $("#customBackButton").length === 0)' +
            '$(".hero-unit-form").append("' +
            '<div style=\'width: 100%; display: flex\'>' +
            '<a style=\'margin: auto\' href=\'' + BIB_URL + '\'>' +
            '<button id=\'customBackButton\' class=\'btn btn-primary\'>Retour</button>' +
            '</a>' +
            '</div>");true;';
    }

    render() {
        const nav = this.props.navigation;
        return (
            <WebViewScreen
                navigation={nav}
                url={BIB_URL}
                customJS={this.customBibInjectedJS}/>
        );
    }
}

