// @flow

import * as React from 'react';
import WebViewScreen from "../components/WebViewScreen";
import i18n from "i18n-js";

type Props = {
    navigation: Object,
}


const URL = 'http://planex.insa-toulouse.fr/salles.php';

/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class AvailableRoomScreen extends React.Component<Props> {

    customInjectedJS: string;

    constructor() {
        super();
        this.customInjectedJS = '';
    }

    render() {
        const nav = this.props.navigation;
        return (
            <WebViewScreen
                navigation={nav}
                url={URL}
                customInjectedJS={this.customInjectedJS}
                headerTitle={i18n.t('screens.availableRooms')}
                hasHeaderBackButton={true}
                hasSideMenu={false}/>
        );
    }
}

