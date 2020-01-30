// @flow

import * as React from 'react';
import ThemeManager from "../../utils/ThemeManager";
import WebViewScreen from "../../components/WebViewScreen";
import i18n from "i18n-js";

type Props = {
    navigation: Object,
}


const URL = 'https://etud-mel.insa-toulouse.fr/webmail/';

const CUSTOM_CSS_GENERAL = '';


/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class AmicaleScreen extends React.Component<Props> {

    customInjectedJS: string;

    constructor() {
        super();
        this.customInjectedJS =
            '$(document).ready(function() {' +
            '$("head").append(\'<meta name="viewport" content="width=device-width, initial-scale=1.0">\');' +
            '$("head").append(\'<link rel="stylesheet" href="' + CUSTOM_CSS_GENERAL + '" type="text/css"/>\');true;';
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
                        customJS: ''
                    },
                ]}
                headerTitle={'Mails BlueMind'}
                hasHeaderBackButton={true}
                hasSideMenu={false}/>
        );
    }
}

