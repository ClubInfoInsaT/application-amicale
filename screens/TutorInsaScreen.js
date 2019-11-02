// @flow

import * as React from 'react';
import ThemeManager from "../utils/ThemeManager";
import WebViewScreen from "../components/WebViewScreen";

type Props = {
    navigation: Object,
}


const URL = 'https://www.etud.insa-toulouse.fr/~tutorinsa/';

/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class TutorInsaScreen extends React.Component<Props> {

    render() {
        const nav = this.props.navigation;
        return (
            <WebViewScreen
                navigation={nav}
                url={URL}
                headerTitle={'Tutor\'INSA'}
                hasHeaderBackButton={true}
                hasSideMenu={false}/>
        );
    }
}

