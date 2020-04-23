// @flow

import * as React from 'react';
import WebViewScreen from "../../../components/Screens/WebViewScreen";

const URL = 'https://www.etud.insa-toulouse.fr/~tutorinsa/';
/**
 * Class defining the app's available rooms screen.
 * This screen uses a webview to render the page
 */
export const TutorInsaWebsiteScreen = (props: Object) => {
    return (
        <WebViewScreen
            {...props}
            url={URL}/>
    );
};

