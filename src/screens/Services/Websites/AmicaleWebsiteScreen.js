// @flow

import * as React from 'react';
import WebViewScreen from "../../../components/Screens/WebViewScreen";

const URL = 'https://www.amicale-insat.fr/';
/**
 * Class defining the app's available rooms screen.
 * This screen uses a webview to render the page
 */
export const AmicaleWebsiteScreen = (props: Object) => {
    let path = '';
    if (props.route.params !== undefined) {
        if (props.route.params.path !== undefined && props.route.params.path !== null) {
            path = props.route.params.path;
            path = path.replace(URL, '');
        }
    }
    console.log(URL + path);
    return (
        <WebViewScreen
            {...props}
            url={URL + path}/>
    );
};

