// @flow

import * as React from 'react';
import WebViewScreen from "../../components/Screens/WebViewScreen";
import {CommonActions} from "@react-navigation/native";

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
            // reset params to prevent infinite loop
            props.navigation.dispatch(CommonActions.setParams({path: null}));
        }
    }
    return (
        <WebViewScreen
            {...props}
            url={URL + path}/>
    );
};

