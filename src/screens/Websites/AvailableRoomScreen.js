// @flow

import * as React from 'react';
import WebViewScreen from "../../components/Screens/WebViewScreen";

type Props = {
    navigation: Object,
}


const ROOM_URL = 'http://planex.insa-toulouse.fr/salles.php';
const CUSTOM_CSS_GENERAL = 'https://etud.insa-toulouse.fr/~amicale_app/custom_css/rooms/customMobile2.css';

/**
 * Class defining the app's available rooms screen.
 * This screen uses a webview to render the page
 */
export default class AvailableRoomScreen extends React.Component<Props> {

    customInjectedJS: string;

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
    }

    render() {
        const nav = this.props.navigation;
        return (
            <WebViewScreen
                navigation={nav}
                url={ROOM_URL}
                customJS={this.customInjectedJS}/>
        );
    }
}

