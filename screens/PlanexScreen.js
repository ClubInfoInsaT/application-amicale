// @flow

import * as React from 'react';
import ThemeManager from "../utils/ThemeManager";
import WebViewScreen from "../components/WebViewScreen";

type Props = {
    navigation: Object,
}


const PLANEX_URL = 'http://planex.insa-toulouse.fr/';

const CUSTOM_CSS_GENERAL = 'https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/custom_css/planex/customMobile.css';
const CUSTOM_CSS_NIGHTMODE = 'https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/custom_css/planex/customDark.css';

/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class PlanexScreen extends React.Component<Props> {

    customInjectedJS: string;

    constructor() {
        super();
        this.customInjectedJS =
            'document.querySelector(\'head\').innerHTML += \'<meta name="viewport" content="width=device-width, initial-scale=1.0">\';' +
            'document.querySelector(\'head\').innerHTML += \'<link rel="stylesheet" href="' + CUSTOM_CSS_GENERAL + '" type="text/css"/>\';';
        if (ThemeManager.getNightMode())
            this.customInjectedJS += 'document.querySelector(\'head\').innerHTML += \'<link rel="stylesheet" href="' + CUSTOM_CSS_NIGHTMODE + '" type="text/css"/>\';';
    }

    render() {
        const nav = this.props.navigation;
        return (
            <WebViewScreen
                navigation={nav}
                url={PLANEX_URL}
                customInjectedJS={this.customInjectedJS}
                headerTitle={'Planex'}
                hasHeaderBackButton={false}/>
        );
    }
}

