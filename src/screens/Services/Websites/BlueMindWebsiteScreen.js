// @flow

import * as React from 'react';
import WebViewScreen from "../../../components/Screens/WebViewScreen";

const URL = 'https://etud-mel.insa-toulouse.fr/webmail/';

const customPadding = (padding: string) => {
    return (
        "$('head').append('<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">');" +
        "$('.minwidth').css('top', " + padding + ");" +
        "$('#mailview-bottom').css('min-height', 500);"
    );
}

/**
 * Class defining the app's available rooms screen.
 * This screen uses a webview to render the page
 */
export const BlueMindWebsiteScreen = (props: Object) => {
    return (
        <WebViewScreen
            {...props}
            customPaddingFunction={customPadding}
            url={URL}/>
    );
};

