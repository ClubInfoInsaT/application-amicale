// @flow

import * as React from 'react';
import WebViewScreen from "../components/WebViewScreen";
import i18n from "i18n-js";

type Props = {
    navigation: Object,
}


const ROOM_URL = 'http://planex.insa-toulouse.fr/salles.php';
const PC_URL = 'http://planex.insa-toulouse.fr/sallesInfo.php';
const BIB_URL = 'https://bibbox.insa-toulouse.fr/';
const CUSTOM_CSS_GENERAL = 'https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/custom_css/rooms/customMobile.css';
const CUSTOM_CSS_Bib = 'https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/custom_css/rooms/customBibMobile.css';

/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class AvailableRoomScreen extends React.Component<Props> {

    customInjectedJS: string;
    customBibInjectedJS: string;

    constructor() {
        super();
        this.customInjectedJS =
            'document.querySelector(\'head\').innerHTML += \'<meta name="viewport" content="width=device-width, initial-scale=1.0">\';' +
            'document.querySelector(\'head\').innerHTML += \'<link rel="stylesheet" href="' + CUSTOM_CSS_GENERAL + '" type="text/css"/>\';' +
            'let header = $(".table tbody tr:first");' +
            '$("table").prepend("<thead></thead>");' +
            '$("thead").append(header);';

        this.customBibInjectedJS =
            'document.querySelector(\'head\').innerHTML += \'<meta name="viewport" content="width=device-width, initial-scale=1.0">\';' +
            'document.querySelector(\'head\').innerHTML += \'<link rel="stylesheet" href="' + CUSTOM_CSS_Bib + '" type="text/css"/>\';';
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
                    {
                        url: BIB_URL,
                        icon: 'book',
                        name: i18n.t('availableRoomScreen.bibRoom'),
                        customJS: this.customBibInjectedJS
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

