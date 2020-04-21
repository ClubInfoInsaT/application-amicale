// @flow

import * as React from 'react';
import WebViewScreen from "../../components/Screens/WebViewScreen";

const URL = 'https://ent.insa-toulouse.fr/';
/**
 * Class defining the app's available rooms screen.
 * This screen uses a webview to render the page
 */
export const ENTWebsiteScreen = (props: Object) => {
    return (
        <WebViewScreen
            {...props}
            url={URL}/>
    );
};

