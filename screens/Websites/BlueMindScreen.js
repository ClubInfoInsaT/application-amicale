// @flow

import * as React from 'react';
import WebViewScreen from "../../components/WebViewScreen";
import i18n from "i18n-js";

type Props = {
    navigation: Object,
}


const URL = 'https://etud-mel.insa-toulouse.fr/webmail/';

const CUSTOM_CSS_GENERAL = 'https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/custom_css/bluemind/customMobile.css';


/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class BlueMindScreen extends React.Component<Props> {

    customInjectedJS: string;

    constructor() {
        super();
        // Breaks website on ios
        this.customInjectedJS = '';
            // '$("head").append(\'<meta name="viewport" content="width=device-width, initial-scale=1.0">\');' +
            // '$("head").append(\'<link rel="stylesheet" href="' + CUSTOM_CSS_GENERAL + '" type="text/css"/>\');true;';
    }

    render() {
        const nav = this.props.navigation;
        return (
            <WebViewScreen
                navigation={nav}
                data={[
                    {
                        url: URL,
                        icon: '',
                        name: '',
                        customJS: this.customInjectedJS
                    },
                ]}
                headerTitle={i18n.t('screens.bluemind')}
                hasHeaderBackButton={true}
                hasSideMenu={false}/>
        );
    }
}

