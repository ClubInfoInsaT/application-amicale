// @flow

import * as React from 'react';
import WebViewScreen from "../../../components/Screens/WebViewScreen";

const URL = 'https://wiki.etud.insa-toulouse.fr/';

const customPadding = (padding: string) => {
    return (
        "$('#p-logo-text').css('top', 10 + " + padding + ");" +
        "$('#site-navigation h2').css('top', 10 + " + padding + ");" +
        "$('#site-tools h2').css('top', 10 + " + padding + ");" +
        "$('#user-tools h2').css('top', 10 + " + padding + ");"
    );
}


/**
 * Class defining the app's available rooms screen.
 * This screen uses a webview to render the page
 */
export const WiketudWebsiteScreen = (props: Object) => {
    return (
        <WebViewScreen
            {...props}
            customPaddingFunction={customPadding}
            url={URL}/>
    );
};

