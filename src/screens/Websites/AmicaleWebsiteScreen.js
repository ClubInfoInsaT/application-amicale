// @flow

import * as React from 'react';
import WebViewScreen from "../../components/Screens/WebViewScreen";

const URL = 'https://amicale-insat.fr/';
/**
 * Class defining the app's available rooms screen.
 * This screen uses a webview to render the page
 */
export const AmicaleWebsiteScreen = (props: Object) => {
    return (
        <WebViewScreen
            {...props}
            url={URL}/>
    );
};

