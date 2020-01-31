// @flow

import * as React from 'react';
import WebViewScreen from "../../components/WebViewScreen";
import i18n from "i18n-js";

type Props = {
    navigation: Object,
}


const URL = 'https://ent.insa-toulouse.fr/';

const CUSTOM_CSS_GENERAL = 'https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/custom_css/ent/customMobile.css';

// let stylesheet = document.createElement('link');
// stylesheet.type = 'text/css';
// stylesheet.rel = 'stylesheet';
// stylesheet.href = 'https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/custom_css/ent/customMobile.css';
// let mobileSpec = document.createElement('meta');
// mobileSpec.name = 'viewport';
// mobileSpec.content = 'width=device-width, initial-scale=1.0';
// document.getElementsByTagName('head')[0].appendChild(mobileSpec);
// // document.getElementsByTagName('head')[0].appendChild(stylesheet);
// document.getElementsByClassName('preference-items')[0].style.display = 'none';
// document.getElementsByClassName('logoInsa')[0].style.display = 'none';
// document.getElementsByClassName('logoPress')[0].style.display = 'none';
// document.getElementsByClassName('ent')[0].style.display = 'none';
// document.getElementById('portal-page-header').style.margin = 0;
// document.querySelectorAll('.uportal-navigation-category').forEach(element => {
//     element.style.cssText = "width: 100%; display: flex; height: 50px;";
//     if (element.children.length > 0)
//         element.children[0].style.margin = 'auto';
// });
// true;


/**
 * Class defining the app's ent screen.
 * This screen uses a webview to render the ent page
 */
export default class EntScreen extends React.Component<Props> {

    customInjectedJS: string;

    constructor() {
        super();
        this.customInjectedJS =
            'let stylesheet = document.createElement(\'link\');\n' +
            'stylesheet.type = \'text/css\';\n' +
            'stylesheet.rel = \'stylesheet\';\n' +
            'stylesheet.href = \'' + CUSTOM_CSS_GENERAL + '\';\n' +
            'let mobileSpec = document.createElement(\'meta\');\n' +
            'mobileSpec.name = \'viewport\';\n' +
            'mobileSpec.content = \'width=device-width, initial-scale=1.0\';\n' +
            'document.getElementsByTagName(\'head\')[0].appendChild(mobileSpec);\n' +
            'document.getElementsByTagName(\'head\')[0].appendChild(stylesheet);\n' +
            'document.getElementsByClassName(\'preference-items\')[0].style.display = \'none\';\n' +
            'document.getElementsByClassName(\'logoInsa\')[0].style.display = \'none\';\n' +
            'document.getElementsByClassName(\'logoPress\')[0].style.display = \'none\';\n' +
            'document.getElementsByClassName(\'ent\')[0].style.display = \'none\';\n' +
            'document.getElementById(\'portal-page-header\').style.margin = 0;\n' +
            'document.querySelectorAll(\'.uportal-navigation-category\').forEach(element => {\n' +
            '    element.style.cssText = "width: 100%; display: flex; height: 50px;";\n' +
            '    if (element.children.length > 0)\n' +
            '        element.children[0].style.margin = \'auto\';\n' +
            '});' +
            'true;';
    }

    render() {
        const nav = this.props.navigation;
        return (
            <WebViewScreen
                navigation={nav}
                data={[
                    {
                        url: URL,
                        icon: '',
                        name: '',
                        customJS: this.customInjectedJS
                    },
                ]}
                headerTitle={i18n.t('screens.ent')}
                hasHeaderBackButton={true}
                hasSideMenu={false}/>
        );
    }
}

