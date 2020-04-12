// @flow

import * as React from 'react';
import WebViewScreen from "../../components/Screens/WebViewScreen";

const URL = 'https://etud.insa-toulouse.fr/~eeinsat/';
/**
 * Class defining the app's available rooms screen.
 * This screen uses a webview to render the page
 */
export const ElusEtudiantsWebsiteScreen = (props: Object) => {
    return (
        <WebViewScreen
            {...props}
            url={URL}/>
    );
};

