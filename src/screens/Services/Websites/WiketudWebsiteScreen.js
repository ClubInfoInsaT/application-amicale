// @flow

import * as React from 'react';
import WebViewScreen from "../../../components/Screens/WebViewScreen";

const URL = 'https://wiki.etud.insa-toulouse.fr/';
/**
 * Class defining the app's available rooms screen.
 * This screen uses a webview to render the page
 */
export const WiketudWebsiteScreen = (props: Object) => {
    return (
        <WebViewScreen
            {...props}
            url={URL}/>
    );
};

