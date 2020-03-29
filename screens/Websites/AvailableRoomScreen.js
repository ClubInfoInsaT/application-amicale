// @flow

import * as React from 'react';
import WebViewScreen from "../../components/WebViewScreen";
import i18n from "i18n-js";

type Props = {
    navigation: Object,
}


const ROOM_URL = 'http://planex.insa-toulouse.fr/salles.php';
const PC_URL = 'http://planex.insa-toulouse.fr/sallesInfo.php';
const CUSTOM_CSS_GENERAL = 'https://etud.insa-toulouse.fr/~amicale_app/custom_css/rooms/customMobile.css';

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
                data={[
                    {
                        url: ROOM_URL,
                        icon: 'file-document-outline',
                        name: i18n.t('availableRoomScreen.normalRoom'),
                        customJS: this.customInjectedJS
                    },
                    {
                        url: PC_URL,
                        icon: 'monitor',
                        name: i18n.t('availableRoomScreen.computerRoom'),
                        customJS: this.customInjectedJS
                    },
                ]}
                customInjectedJS={this.customInjectedJS}
                headerTitle={i18n.t('screens.availableRooms')}
                hasHeaderBackButton={true}
                hasSideMenu={false}
                hasFooter={false}/>
        );
    }
}

